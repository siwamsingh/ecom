import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { client } from "../db/db.connect";

const verifyJWT = asyncHandler(async (req, res, next) => {

  try {
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

    const decodedToken = jwt.verify(token, jwt_secret) as JwtPayload;

    const _id = decodedToken?._id

    const searchUserQuery = 'SELECT _id, username, phone_number, status, role FROM "user" WHERE _id = $1;';

    const searchQueryResult = await client.query(searchUserQuery, [_id]);

    if (!(searchQueryResult.rowCount && searchQueryResult.rowCount > 0)) {
      throw new ApiError(401, "Invalid Access Token.");
    }

    req.body.user = searchQueryResult.rows[0];
    next()
    
  } catch (error: any) {
    throw new ApiError(error)
  }
})

export { verifyJWT }