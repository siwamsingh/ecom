import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { client } from "../db/db.connect";
import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/apiResponse";

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

  if (userExistsResult.rowCount != null && userExistsResult.rowCount > 0) {
    throw new ApiError(409, "Username or phone number already exists");
  }

  // if user doesnot exist bring bring otpToken for that user
  const getOtpTokenQuery = 'SELECT token from "phone_login_otp" WHERE phone_number = $1'

  const getOtpTokenResult = await client.query(getOtpTokenQuery, [phone_number.trim()]);


  if (!(getOtpTokenResult && getOtpTokenResult.rowCount && getOtpTokenResult.rowCount > 0)) {
    throw new ApiError(505, "Could not get token from data base");
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
          console.log('ERROR: Token has expired');
          throw new ApiError(505, "Session has ended.")
        } else {
          throw new ApiError(505, "Something went wrong while verifying otp token.")
        }
      } else {
        // match the ip adress and save user in db
        const { ip } = token;

        if(ip.trim() !== userIp){
          throw new ApiError(505,"Network change detected registeration aborted.")
        }

        // insert the user in db
        // const registerUserQuery = 

        // const registerUserResult = await client.query(registerUserQuery,[])
      }
    });


});

export { registerUser };
