import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { client } from "../db/db.connect";
import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/apiResponse";
import bcrypt from "bcryptjs";

const generateAccessAndRefreshToken = async ({ _id, status, role }: { _id: number, status: string, role: string }) => {

  try {
    const jwtSecret = process.env.JWT_SECRET || "";

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
      'UPDATE "user" SET refresh_token = $1 ;', [refreshToken]
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
    throw new ApiError(401, "All fields are required");
  }
  if ([username, phone_number, password].some((field) => field?.trim() === "")) {
    throw new ApiError(401, "All fields are required");
  }

  const phoneRegex = /^\+91\d{10}$/;
  if (!phoneRegex.test(phone_number.trim())) {
    throw new ApiError(401, "Invalid phone number.");
  }

  // Check if the username already exists
  const userExistsQuery = 'SELECT 1 FROM "user" WHERE phone_number = $1; ';

  const userExistsResult = await client.query(userExistsQuery, [phone_number.trim()]);

  if (userExistsResult.rowCount !== null && userExistsResult.rowCount > 0) {
    throw new ApiError(401, "Phone number already in use.");
  }

  // if user doesnot exist bring otpToken for that user
  const getOtpTokenQuery = 'SELECT token from "phone_login_otp" WHERE phone_number = $1;'

  const getOtpTokenResult = await client.query(getOtpTokenQuery, [phone_number.trim()]);


  if (!(getOtpTokenResult && getOtpTokenResult.rowCount && getOtpTokenResult.rowCount > 0)) {
    throw new ApiError(401, "Phone number verification required.");
  }

  const { token } = getOtpTokenResult.rows[0];

  const otpToken = token;

  if (!otpToken) {
    throw new ApiError(505, "Token not found");
  }

  const jwt_secret = process.env.JWT_SECRET
  if (!jwt_secret) {
    throw new ApiError(505, "Critical Error : Secret key missing.");
  }

  jwt.verify(otpToken,
    jwt_secret,
    (err: any, token: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw new ApiError(401, "Phone number is invalid as 10 minutes have passed.")
        } else {
          throw new ApiError(505, "Something went wrong while verifying otp token.")
        }
      } else {
        // match the ip adress and save user in db
        const { ip, type } = token;

        if (ip.trim() !== userIp && type !== "register") {
          throw new ApiError(401, "Network change detected registeration aborted.")
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
    throw new ApiError(401, "Failed to register user.")
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
    throw new ApiError(401, "All fields are required");
  }
  if ([phone_number, userPassword].some((field) => field?.trim() === "")) {
    throw new ApiError(401, "All fields are required");
  }

  phone_number = phone_number.trim();
  userPassword = userPassword.trim();

  const phoneRegex = /^\+91\d{10}$/;
  if (!phoneRegex.test(phone_number)) {
    throw new ApiError(401, "Invalid phone number.");
  }

  const findUserQuery = 'SELECT _id , username , password , status , role , last_login_time , login_attempt FROM "user" WHERE phone_number = $1;'

  const findUserResult = await client.query(findUserQuery, [phone_number]);

  if (!(findUserResult && findUserResult.rowCount && findUserResult.rowCount > 0)) {
    throw new ApiError(401, "Account not found. Check Your Phone number")
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
    throw new ApiError(401, "Too many failed attempts. Please try again after 12 hours." + " Last Login Time : " + last_login_time);
  }

  const isPasswordCorrect = await bcrypt.compare(userPassword, password);

  if (!isPasswordCorrect) {
    login_attempt += 1; // Increment login attempts on a wrong password

    await client.query(
      'UPDATE "user" SET login_attempt = $1, last_login_time = $2 WHERE _id = $3;',
      [login_attempt, new Date(), _id]
    );

    throw new ApiError(401, `Wrong Password. Attempts Remaining : ${3 - login_attempt}/3`);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken({ _id, status, role })

  const options = {
    httpOnly: true, 
    secure: process.env.COOKIE_SECURE === "true", 
    sameSite: process.env.COOKIE_SAMESITE as "lax" | "none",
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: parseInt(process.env.COOKIE_MAX_AGE || "2592000000") // Default: 30 days
  };

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
        },
        tokens:{
          accessToken,
          refreshToken
        }
      },
      "User logged In Successfully"
    ));

})

const logoutUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    throw new ApiError(401, "User ID is missing from request.");
  }

  try {
    const updateTokenQuery = `
      UPDATE "user"
      SET refresh_token = $1
      WHERE _id = $2;
    `;

    const result = await client.query(updateTokenQuery, ["", _id]);

    if (result.rowCount === 0) {
      throw new ApiError(401, "User not found.");
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
  } catch (error: any) {

    throw new ApiError(501, error?.message ? error?.message : "Failed to log out user.");
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {

  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request.")
  }

  const jwt_secret = process.env.JWT_SECRET
  if (!jwt_secret) {
    throw new ApiError(501, "Critical Error : Secret key missing.");
  }

  interface JwtPayload {
    _id: string
  }

  let decodedToken = null;
  try {

    decodedToken = jwt.verify(incomingRefreshToken, jwt_secret) as JwtPayload;

  } catch (error: any) {
    if (error?.name === 'TokenExpiredError') {
      throw new ApiError(577, 'Session has expired');
    } else {
      throw new ApiError(501, 'Invalid token');
    }
  }
  const userId = decodedToken?._id;

  const findUserQuery = 'SELECT _id , username , password , status , role , refresh_token FROM "user" WHERE _id = $1;'

  const findUserResult = await client.query(findUserQuery, [userId]);

  if (!(findUserResult && findUserResult.rowCount && findUserResult.rowCount > 0)) {
    throw new ApiError(401, "Invalid Request Token.")
  }

  let { _id, status, role, refresh_token } = findUserResult.rows[0];

  if (incomingRefreshToken !== refresh_token) {
    throw new ApiError(577, "Refresh Token Expired or used.")
  }

  const options = {
    httpOnly: true, 
    secure: process.env.COOKIE_SECURE === "true", 
    sameSite: process.env.COOKIE_SAMESITE as "lax" | "none",
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: parseInt(process.env.COOKIE_MAX_AGE || "2592000000") // Default: 30 days
  };

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken({ _id, status, role });

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
      200,
      {tokens:{
        accessToken,
        refreshToken
      }},
      "Tokens Refreshed Successfully."
    ))

})

// only for admin 
const editUserConfig = asyncHandler(async (req, res) => {
  let user = req.user;

  if (user.role && user.role !== "admin") {
    throw new ApiError(401, "Permisson Denied.")
  }

  const { user_id, user_phone_number, user_status, user_login_attempt } = req.body

  const customerUserId = user_id;
  const customerPhoneNumber = user_phone_number;


  if (!customerUserId && !customerPhoneNumber) {
    throw new ApiError(401, "User Id or Phone Number Is Required.");
  }

  if (!user_status && !user_login_attempt) {
    throw new ApiError(401, "Atleast One Field Is Required.");
  }

  if (user_status !== "active" && user_status !== "inactive" && user_status !== "blocked") {
    throw new ApiError(401, "Enter A Valid User Status.");
  }

  if (user_login_attempt < 0 || user_login_attempt > 3) {
    throw new ApiError(401, "Enter A Valid Number Between 0 And 3");
  }

  let queryParam: string;
  let queryParamVal: number | string;

  if (customerPhoneNumber) {
    queryParam = "phone_number = $1"
    queryParamVal = customerPhoneNumber
  } else {
    queryParam = "_id = $1"
    queryParamVal = customerUserId
  }

  try {
    const checkQuery = `SELECT _id , role FROM "user" WHERE ${queryParam}`;

    const checkResult = await client.query(checkQuery, [queryParamVal]);

    if (checkResult.rowCount === 0) {
      throw new ApiError(401, "User doesn't exist.");
    }

    const userToUpdate = checkResult.rows[0];
    const userToUpdateId = checkResult.rows[0]._id;

    if (userToUpdate.role === "admin") {
      throw new ApiError(401, "Cannot edit another admin.")
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (user_login_attempt) {
      updateFields.push("login_attempt = $" + (updateValues.length + 1));
      updateValues.push(user_login_attempt);
    }
    if (user_status) {
      updateFields.push("status = $" + (updateValues.length + 1));
      updateValues.push(user_status);
    }

    updateValues.push(userToUpdateId)

    const updateQuery = `
    UPDATE "user"
    SET ${updateFields.join(", ")}
    WHERE _id = $${updateValues.length} ;`;

    await client.query(updateQuery, updateValues);

    res.status(200).json(
      new ApiResponse(200, {}, "User updated successfully.")
    );

  } catch (error: any) {
    throw new ApiError(error?.statusCode ? error.statusCode : 501, error?.message ? error.message : "Something went wrong while updating user data.")
  }
})

const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, role, status } = req.body;
  const limit = 10;

  if (limit < 1 || page < 1) {
    throw new ApiError(400, "Page and limit must be greater than 0.");
  }

  const conditions: string[] = [];
  const queryValues: any[] = [];

  if (role) {
    conditions.push(`role = $${queryValues.length + 1}`);
    queryValues.push(role);
  }
  if (status) {
    conditions.push(`status = $${queryValues.length + 1}`);
    queryValues.push(status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  // Query to fetch users
  const fetchQuery = `
    SELECT _id, username, phone_number, status, role, last_login_time, login_attempt, created_at
    FROM "user"
    ${whereClause}
    ORDER BY _id ASC
    LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2};
  `;

  // Query to count total users matching the conditions
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM "user"
    ${whereClause};
  `;

  queryValues.push(limit, (page - 1) * limit);

  try {
    const [userResult, countResult] = await Promise.all([
      client.query(fetchQuery, queryValues),
      client.query(countQuery, queryValues.slice(0, -2)),
    ]);

    const totalUsers = parseInt(countResult.rows[0].total, 10);
    const maxPages = Math.ceil(totalUsers / limit);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          success: true,
          total: totalUsers,
          page,
          limit,
          maxPages,
          data: userResult.rows,
        },
        "Users fetched successfully."
      )
    );
  } catch (error: any) {
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Error fetching user data."
    );
  }
});


const getUser = asyncHandler(async (req, res) => {
  let { user_id, user_phone_number } = req.body;
  const user = req.user

  if(!user_id){
    user_id = user._id;
  }

  if (!user_id && !user_phone_number) {
    throw new ApiError(400, "User ID or Phone Number is required.");
  }

  if(user_id !== user._id && user.role !== "admin"){
    throw new ApiError(401,"User doent have permission.")
  }

  let query;
  let queryValue;

  if (user_id) {
    query = 'SELECT _id, username, phone_number, status, role, last_login_time, login_attempt, created_at FROM "user" WHERE _id = $1';
    queryValue = user_id;
  } else {
    query = 'SELECT _id, username, phone_number, status, role, last_login_time, login_attempt, created_at FROM "user" WHERE phone_number = $1';
    queryValue = user_phone_number;
  }

  try {
    const result = await client.query(query, [queryValue]);

    if (result.rowCount === 0) {
      throw new ApiError(404, "User not found.");
    }

    res.status(200).json(
      new ApiResponse(200, {
        success: true,
        user: result.rows[0]
      }, "User fetched successfully.")
    );

  } catch (error: any) {
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Error fetching user data."
    );
  }
});




export { registerUser, loginUser, logoutUser, refreshAccessToken, editUserConfig, getUsers, getUser };
