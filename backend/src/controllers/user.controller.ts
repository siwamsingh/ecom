import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { client } from "../db/db.connect";  // Import your PostgreSQL client

const registerUser = asyncHandler(async (req, res) => {

  const { username, phone_number, password } = req.body;

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
  const values = [username,phone_number];
  

  const userExistsResult = await client.query(userExistsQuery, values);

  if (userExistsResult.rowCount != null && userExistsResult.rowCount > 0) {
    throw new ApiError(409, "Username or phone number already exists");
  }

  // If username doesn't exist, proceed with registration logic
  return res.json({ message: "User registration successful" });
});

export { registerUser };
