import { client } from "../db/db.connect";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const gernerateRegisterOtp = asyncHandler(async (req, res) => {
  const { phone_number } = req.body;
  let userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const phoneRegex = /^\+91\d{10}$/;

  if (!phone_number || !phoneRegex.test(phone_number.trim())) {
    throw new ApiError(400, "Invalid phone number.")
  }

  const userExistsQuery = 'SELECT 1 FROM "user" WHERE phone_number = $1; ';

  const userExistsResult = await client.query(userExistsQuery, [phone_number.trim()]);

  if (userExistsResult.rowCount !== null && userExistsResult.rowCount > 0) {
    throw new ApiError(408, "Phone number is already verified.");
  }

  const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

  const saltRounds = process.env.BCRYPT_SALT_ROUNDS

  let hashOtp = ""
  if (saltRounds) {
    hashOtp = await bcrypt.hash(otp, Number(saltRounds))
  } else {
    throw new ApiError(501, "Salt Rounds not found")
  }

  //this data will send to user
  let numberOfAttempts: number = -1, lastRegisterRequestTime: Date | null = null;

  // only take attempt_count and last_request_time from db
  const phoneExistQuery = 'SELECT attempt_count, last_request_time FROM phone_login_otp WHERE phone_number = $1;';
  const values = [phone_number.trim()];
  const phoneExistsResult = await client.query(phoneExistQuery, values);

  if (phoneExistsResult.rowCount !== null && phoneExistsResult.rowCount > 0) {
    const { attempt_count, last_request_time } = phoneExistsResult.rows[0];

    lastRegisterRequestTime = last_request_time;

    // Convert last_request_time to a JavaScript Date object
    const lastRequestTime = new Date(last_request_time).getTime();
    const currentTime = new Date().getTime();

    const fiveMinutesPassed = (currentTime - lastRequestTime) > 300000; // 5 minutes in milliseconds

    const updateOtpQuery = 'UPDATE "phone_login_otp" SET otp = $2, token = $3, attempt_count = $4, last_request_time = $5, ip_address = $6 WHERE phone_number = $1;';

    if (fiveMinutesPassed) {
      if (attempt_count >= 3) {
        if ((currentTime - lastRequestTime) > 86400000) {

          // if 24 hr have passed reset record to 1 attempt
          const values = [phone_number.trim(), hashOtp, "", 1, new Date(), userIp]

          const updateInOtpTableResult = await client.query(updateOtpQuery, values);

          numberOfAttempts = 1;
        } else {
          throw new ApiError(402, "Only 3 request can be sent every 24 hours");
        }
      } else {
        // if 5 min passed and requestNo < 3 send a update req. attempNo + 1
        const values = [phone_number.trim(), hashOtp, "", attempt_count + 1, new Date(), userIp]

        const updateInOtpTableResult = await client.query(updateOtpQuery, values);

        numberOfAttempts = attempt_count + 1;
      }
    } else {
      throw new ApiError(400, "Otp limit reached. Only one otp every 5 min");
    }
  } else {
    // if phone not exist add new record in db

    const insertOtpQuery = 'INSERT INTO "phone_login_otp" (phone_number, otp, token, attempt_count, last_request_time, ip_address) VALUES ($1, $2, $3, $4, $5, $6);'

    const values = [phone_number.trim(), hashOtp, "", 1, new Date(), userIp]

    const insertInOtpTableResult = await client.query(insertOtpQuery, values);

    numberOfAttempts = 1; //set number of attempts to 1

  }

  // send otp to user phone_number
  console.log("this mimics sending otp to user | OTP is ", otp);


  // send some date back to user
  res.status(200).json(
    new ApiResponse(
      200,
      {
        numberOfAttempts,
        lastRegisterRequestTime
      },
      "otp send successfully"
    )
  )
})

const verifyRegisterOtp = asyncHandler(async (req, res) => {
  const { phone_number, verification_otp }: { phone_number: string, verification_otp: string } = req.body;

  let userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const phoneRegex = /^\+91\d{10}$/;

  if (!phone_number || !phoneRegex.test(phone_number.trim())) {
    throw new ApiError(400, "Invalid phone number.");
  }

  const otpRegex = /^\d{6}$/;

  if (!verification_otp || !otpRegex.test(verification_otp.trim())) {
    throw new ApiError(400, "Invalid otp.");
  }

  const getOtpDataQuery = ' SELECT otp , last_request_time , ip_address FROM phone_login_otp WHERE phone_number = $1;'

  const values = [phone_number.trim()]

  const getOtpDataResult = await client.query(getOtpDataQuery, values);

  if (!getOtpDataResult) {
    throw new ApiError(500, "Something went wrong while fetching otp data.");
  }
  if (getOtpDataResult.rowCount && getOtpDataResult.rowCount === 0) {
    throw new ApiError(500, "No record for the given number was found.")
  }

  const { otp, last_request_time, ip_address }: { otp: string, last_request_time: Date, ip_address: string } = getOtpDataResult.rows[0];

  const timeNow = new Date().getTime()
  const lastRequestTime = new Date(last_request_time).getTime();

  let isOtpCorrect = false;

  try {
    isOtpCorrect = await bcrypt.compare(verification_otp.trim(), otp);
  } catch (error) {
    throw new ApiError(502, "Something went wrong while compairing otp");
  }

  const isWithingFiveMin = (timeNow - lastRequestTime) < 300000;

  const isIpMatching = (userIp === ip_address);

  if (!isOtpCorrect) {
    throw new ApiError(400, "Wrong Otp try again.");
  }
  if (!isWithingFiveMin) {
    throw new ApiError(400, "OTP has expired try again.");
  }
  if (!isIpMatching) {
    throw new ApiError(403, "Network was changed.");
  }

  // if otp and ip matches in 5 min send a token in db

  const jwt_secret = process.env.JWT_SECRET
  if (!jwt_secret) {
    throw new ApiError(504, "Critical Error : Secret key missing.");
  }

  const otpToken = jwt.sign({ ip: userIp, type: "register"}, jwt_secret, { expiresIn: '10min' });

  if (!otpToken) {
    throw new ApiError(500, "Could not create token.")
  }

  const updateTokenQuery = 'UPDATE "phone_login_otp" SET token = $2 WHERE phone_number = $1;'

  // update token on db
  const updateTokenResult = await client.query(updateTokenQuery, [phone_number, otpToken])

  if(updateTokenResult){res.status(200).json(
    new ApiResponse(
      200,
      null,
      "verified successfully"
    )
  )}else{
    throw new ApiError(504,"Database error could not store token.")
  }

  
})

export { gernerateRegisterOtp, verifyRegisterOtp }