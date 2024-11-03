import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { client } from "../db/db.connect";
import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/apiResponse";
import bcrypt from "bcryptjs";

const generateAccessAndRefreshToken = async ({ _id, status, role }: { _id: number, status: string, role: string }) => {

  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new ApiError(500, "Something went wrong while generating access and refresh token.")
    }

    const accessToken = jwt.sign(
      { _id, status, role },
      jwtSecret,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' }
    );

    const refreshToken = jwt.sign(
      { _id },
      jwtSecret,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d' }
    );

    await client.query(
      'UPDATE "user" SET refresh_token = $1 ;',
      [ refreshToken ]
    );

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token.")
  }
}

// TODO: insted of using .trim() every where use once like in loginUser
const registerUser = asyncHandler(async (req, res) => {

  const { username, phone_number, password } = req.body;

  let userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Validate input fields
  if ([username, phone_number, password].some((field) => !field)) {
    throw new ApiError(400, "All fields are required");
  }
  if ([username, phone_number, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const phoneRegex = /^\+91\d{10}$/;
  if (!phoneRegex.test(phone_number.trim())) {
    throw new ApiError(400, "Invalid phone number.");
  }

  // Check if the username already exists
  const userExistsQuery = 'SELECT 1 FROM "user" WHERE phone_number = $1; ';

  const userExistsResult = await client.query(userExistsQuery, [phone_number.trim()]);

  if (userExistsResult.rowCount !== null && userExistsResult.rowCount > 0) {
    throw new ApiError(409, "Phone number already in use.");
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

  const userValues = [username.trim(), phone_number.trim(), hashPassword, "active"]

  const registerUserResult = await client.query(registerUserQuery, userValues)

  if (!registerUserResult) {
    throw new ApiError(505, "Failed to register user.")
  }

  //delete record from otp db
  const delteQuery = 'DELETE FROM "phone_login_otp" WHERE phone_number = $1;'

  await client.query(delteQuery, [phone_number.trim()]);

  res.status(200).json(new ApiResponse(200, null, "User registerd successfully."))
});

const loginUser = asyncHandler(async (req, res) => {
  let { phone_number, userPassword } = req.body;

  // Validate input fields
  if ([phone_number, userPassword].some((field) => !field)) {
    throw new ApiError(400, "All fields are required");
  }
  if ([phone_number, userPassword].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  phone_number = phone_number.trim();
  userPassword = userPassword.trim();

  const phoneRegex = /^\+91\d{10}$/;
  if (!phoneRegex.test(phone_number)) {
    throw new ApiError(400, "Invalid phone number.");
  }

  const findUserQuery = 'SELECT _id , username , password , status , role , last_login_time , login_attempt FROM "user" WHERE phone_number = $1;'

  const findUserResult = await client.query(findUserQuery, [phone_number]);

  if (!(findUserResult && findUserResult.rowCount && findUserResult.rowCount > 0)) {
    throw new ApiError(401, "User doesnot exist.")
  }

  let { _id, username, password, status, role, last_login_time, login_attempt } = findUserResult.rows[0];

  // Handle first login or reset attempts if last login was more than 12 hours ago
  const currentTime = new Date().getTime();
  const twelveHoursInMs = 12 * 60 * 60 * 1000;

  if (!last_login_time || !login_attempt) {
    last_login_time = currentTime;
    login_attempt = 0;
  } else {
    const lastLoginDate = new Date(last_login_time).getTime();
    const timeDifference = currentTime - lastLoginDate;

    if (timeDifference > twelveHoursInMs) {
      login_attempt = 0;
    }
  }

  // If login_attempt reaches 3, block login attempts for the next 12 hours
  if (login_attempt >= 3) {
    throw new ApiError(429, "Too many failed attempts. Please try again after 12 hours." + " @" + last_login_time);
  }

  const isPasswordCorrect = await bcrypt.compare(userPassword, password);

  if (!isPasswordCorrect) {
    login_attempt += 1; // Increment login attempts on a wrong password

    await client.query(
      'UPDATE "user" SET login_attempt = $1, last_login_time = $2 WHERE _id = $3;',
      [login_attempt, new Date(), _id]
    );

    throw new ApiError(402, "Wrong Password.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken({ _id, status, role })

  const options = {
    httpOnly: true,
    secure: true
  }

  res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
      200,
      {
        user: {
          _id,
          username,
          phone_number,
          status,
          role
        }
      },
      "User logged In Successfully"
    ));

})

const logoutUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  ;

  if (!_id) {
    throw new ApiError(400, "User ID is missing from request.");
  }

  try {
    const updateTokenQuery = `
      UPDATE "user"
      SET refresh_token = $1
      WHERE _id = $2;
    `;

    const result = await client.query(updateTokenQuery, ["", _id]);

    if (result.rowCount === 0) {
      throw new ApiError(404, "User not found.");
    }

    const options = {
      httpOnly: true,
      secure: true
    }

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, null, "User logged out."));
  } catch (error) {
    throw new ApiError(500, "Failed to log out user.");
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {

  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request.")
  }

  const jwt_secret = process.env.JWT_SECRET
  if (!jwt_secret) {
    throw new ApiError(504, "Critical Error : Secret key missing.");
  }

  interface JwtPayload {
    _id: string
  }

  const decodedToken = jwt.verify(incomingRefreshToken, jwt_secret) as JwtPayload;

  const userId = decodedToken?._id;

  const findUserQuery = 'SELECT _id , username , password , status , role , refresh_token FROM "user" WHERE _id = $1;'

  const findUserResult = await client.query(findUserQuery, [userId]);

  if (!(findUserResult && findUserResult.rowCount && findUserResult.rowCount > 0)) {
    throw new ApiError(401, "Invalid Request Token.")
  }

  let { _id , status, role, refresh_token } = findUserResult.rows[0];

  if (incomingRefreshToken !== refresh_token) {
    throw new ApiError(401, "Refresh Token Expired or used.")
  }

  const options = {
    httpOnly: true,
    secure: true
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken({_id , status ,role});

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(new ApiResponse(
    200,
    null,
    "Tokens Refreshed Successfully."
  ))

})

export { registerUser, loginUser, logoutUser , refreshAccessToken};
