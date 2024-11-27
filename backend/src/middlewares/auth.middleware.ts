import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { client } from "../db/db.connect";
import { Request } from "express";

const verifyJWT = asyncHandler(async (req, res, next) => {

  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const jwt_secret = process.env.JWT_SECRET
  if (!jwt_secret) {
    throw new ApiError(504, "Critical Error : Secret key missing.");
  }

  interface JwtPayload {
    _id: string
  }

  let decodedToken = null;
  try {
    decodedToken = jwt.verify(token, jwt_secret) as JwtPayload;

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(577, 'Token has expired');
    } else {
      throw new ApiError(501, 'Invalid token');
    }
  }

  const _id = decodedToken?._id

  const searchUserQuery = 'SELECT _id, username, phone_number, status, role FROM "user" WHERE _id = $1;';

  const searchQueryResult = await client.query(searchUserQuery, [_id]);

  if (!(searchQueryResult.rowCount && searchQueryResult.rowCount > 0)) {
    throw new ApiError(401, "Invalid Access Token.");
  }

  interface customRequest extends Request {
    user: string // or any other type
  }

  if(searchQueryResult.rows[0].status === "blocked" ){
    throw new ApiError(400, "User has been blocked by the admin.");
  }

  (req as customRequest).user  = searchQueryResult.rows[0];
  next()

})

export { verifyJWT }