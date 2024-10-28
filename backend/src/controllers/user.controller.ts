import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { client } from "../db/db.connect";
import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/apiResponse";
import bcrypt from "bcryptjs";


const registerUser = asyncHandler(async (req, res) => {

  const { username, phone_number, password } = req.body;

  let userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Validate input fields
  if ([username, phone_number, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const phoneRegex = /^\+91\d{10}$/;
  if (!phoneRegex.test(phone_number.trim())) {
    throw new ApiError(400, "Invalid phone number.");
  }

  // Check if the username already exists
  const userExistsQuery = 'SELECT 1 FROM "user" WHERE username = $1 OR phone_number = $2; ';
  const values = [username, phone_number];


  const userExistsResult = await client.query(userExistsQuery, values);

  if (userExistsResult.rowCount !== null && userExistsResult.rowCount > 0) {
    throw new ApiError(409, "Username or phone number already exists");
  }

  // if user doesnot exist bring otpToken for that user
  const getOtpTokenQuery = 'SELECT token from "phone_login_otp" WHERE phone_number = $1;'

  const getOtpTokenResult = await client.query(getOtpTokenQuery, [phone_number.trim()]);


  if (!(getOtpTokenResult && getOtpTokenResult.rowCount && getOtpTokenResult.rowCount > 0)) {
    throw new ApiError(505, "Phone number verification required.");
  }

  const { token } = getOtpTokenResult.rows[0];

  const otpToken = token;

  if (!otpToken) {
    throw new ApiError(505, "Token not found");
  }

  const jwt_secret = process.env.JWT_SECRET
  if (!jwt_secret) {
    throw new ApiError(504, "Critical Error : Secret key missing.");
  }

  jwt.verify(otpToken,
    jwt_secret,
    (err: any, token: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw new ApiError(505, "Session has ended.")
        } else {
          throw new ApiError(505, "Something went wrong while verifying otp token.")
        }
      } else {
        // match the ip adress and save user in db
        const { ip, type } = token;
        
        if (ip.trim() !== userIp && type !== "register") {
          throw new ApiError(505, "Network change detected registeration aborted.")
        }

      }
    });

    const saltRounds = process.env.BCRYPT_SALT_ROUNDS

  let hashPassword = ""
  if (saltRounds) {
    hashPassword = await bcrypt.hash(password, Number(saltRounds))
  } else {
    throw new ApiError(501, "Salt Rounds not found")
  }

  const registerUserQuery = 'INSERT INTO "user" (username, phone_number, password, status, role, refresh_token, last_login_time, login_attempt) VALUES ($1, $2, $3, $4, \'customer\', NULL, NULL, 0);'

  const userValues = [username.trim(), phone_number.trim(), hashPassword , "active"]

  const registerUserResult = await client.query(registerUserQuery, userValues)

  if (!registerUserResult) {
    throw new ApiError(505,"Failed to register user.")
  }

  //delete record from otp db
  const delteQuery = 'DELETE FROM "phone_login_otp" WHERE phone_number = $1;'

  await client.query(delteQuery,[phone_number.trim()]);

  res.status(200).json(new ApiResponse(200,null,"User registerd successfully."))
});

export { registerUser };
