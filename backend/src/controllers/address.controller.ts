import { client } from "../db/db.connect";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const addNewAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  const { specific_location, area, landmark, pincode, town_or_city, state } = req.body;

  if (!specific_location || !area || !landmark || !pincode || !town_or_city || !state) {
    throw new ApiError(400, "All address fields are required.");
  }

  if (
    !specific_location || specific_location.trim() === "" ||
    !area || area.trim() === "" ||
    !landmark || landmark.trim() === "" ||
    !pincode || pincode.trim() === "" ||
    !town_or_city || town_or_city.trim() === "" ||
    !state || state.trim() === ""
  ) {
    throw new ApiError(400, "All address fields are required and cannot be empty.");
  }

  // Validate pincode (assuming a standard 6-digit Indian pincode)
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  if (!pincodeRegex.test(pincode)) {
    throw new ApiError(400, "Invalid pincode format. Must be a 6-digit number.");
  }

  // Validate state (assuming an array of valid Indian states and union territories)
  const validStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"
  ];

  if (!validStates.includes(state)) {
    throw new ApiError(400, "Invalid state. Only Indian states and union territories are allowed.");
  }



  // Check if the user has reached the maximum number of addresses
  const addressCountQuery = `SELECT COUNT(*) FROM user_address WHERE user_id = $1;`;
  const addressCountResult = await client.query(addressCountQuery, [user._id]);
  const addressCount = parseInt(addressCountResult.rows[0].count, 10);

  if (addressCount >= 3) {
    throw new ApiError(400, "You can only have a maximum of 3 addresses.");
  }

  // Insert the new address
  const insertAddressQuery = `
      INSERT INTO address (specific_location, area, landmark, pincode, town_or_city, state)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
  `;
  const addressResult = await client.query(insertAddressQuery, [
    specific_location, area, landmark, pincode, town_or_city, state
  ]);

  // Link address to user in user_address table
  const linkAddressQuery = `
      INSERT INTO user_address (user_id, address_id, is_default)
      VALUES ($1, $2, $3)
      RETURNING *;
  `;
  const userAddressResult = await client.query(linkAddressQuery, [
    user._id, addressResult.rows[0]._id, addressCount === 0
  ]);

  res.status(201).json(new ApiResponse(
    201,
    { address: userAddressResult.rows[0] },
    "Address added successfully."
  ));
});

const updateAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  const { address_id, specific_location, area, landmark, pincode, town_or_city, state } = req.body;

  if (!address_id || !specific_location || !area || !landmark || !pincode || !town_or_city || !state) {
    throw new ApiError(400, "All address fields are required.");
  }

  if (
    !address_id ||
    !specific_location || specific_location.trim() === "" ||
    !area || area.trim() === "" ||
    !landmark || landmark.trim() === "" ||
    !pincode || pincode.trim() === "" ||
    !town_or_city || town_or_city.trim() === "" ||
    !state || state.trim() === ""
  ) {
    throw new ApiError(400, "All address fields are required and cannot be empty.");
  }

  // Validate pincode (assuming a standard 6-digit Indian pincode)
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  if (!pincodeRegex.test(pincode)) {
    throw new ApiError(400, "Invalid pincode format. Must be a 6-digit number.");
  }

  // Validate state (assuming an array of valid Indian states and union territories)
  const validStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"
  ];

  if (!validStates.includes(state)) {
    throw new ApiError(400, "Invalid state. Only Indian states and union territories are allowed.");
  }



  // Verify that the address belongs to the user
  const addressOwnerCheckQuery = `
      SELECT * FROM user_address WHERE user_id = $1 AND address_id = $2;`;

  const addressOwnerResult = await client.query(addressOwnerCheckQuery, [user._id, address_id]);

  if (addressOwnerResult.rowCount === 0) {
    throw new ApiError(403, "Address not found or not accessible.");
  }

  // Update the address
  const updateQuery = `
      UPDATE address
      SET specific_location = $1, area = $2, landmark = $3, pincode = $4, town_or_city = $5, state = $6
      WHERE _id = $7
      RETURNING *;
  `;

  const result = await client.query(updateQuery, [
    specific_location, area, landmark, pincode, town_or_city, state, address_id
  ]);

  res.status(200).json(new ApiResponse(200, { address: result.rows[0] }, "Address updated successfully."));
});

const getAddresses = asyncHandler(async (req, res) => {
  const user = req.user;

  try {
    const getAddressesQuery = `
      SELECT address.*, user_address.is_default
      FROM address
      JOIN user_address ON address._id = user_address.address_id
      WHERE user_address.user_id = $1;
    `;
    
    const result = await client.query(getAddressesQuery, [user._id]);

    // Check if the user has no addresses
    if (result.rowCount === 0) {
      return res.status(200).json(new ApiResponse(200, { addresses: [] }, "No address found."));
    }

    // If addresses are found, return them
    res.status(200).json(new ApiResponse(200, { addresses: result.rows }, "Addresses retrieved successfully."));
    
  } catch (error) {
    // Handle any unexpected errors
    throw new ApiError(
      (error as ApiError)?.statusCode || 500,
      (error as ApiError)?.message || "Failed to retrieve addresses."
    );
  }
});

const deleteAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  const { address_id } = req.body;

  // Verify ownership of the address
  const addressOwnerCheckQuery = `
      SELECT * FROM user_address WHERE user_id = $1 AND address_id = $2;
  `;
  const addressOwnerResult = await client.query(addressOwnerCheckQuery, [user._id, address_id]);

  if (addressOwnerResult.rowCount === 0) {
      throw new ApiError(403, "Address not found or not accessible.");
  }

  // Delete the address and the link
  const deleteLinkQuery = `DELETE FROM user_address WHERE user_id = $1 AND address_id = $2;`;
  await client.query(deleteLinkQuery, [user._id, address_id]);

  const deleteAddressQuery = `DELETE FROM address WHERE _id = $1;`;
  await client.query(deleteAddressQuery, [address_id]);

  res.status(200).json(new ApiResponse(200, {}, "Address deleted successfully."));
});

const changeDefaultAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  const { address_id } = req.body;

  try {
      // Validate that the address exists and belongs to the user
      const addressCheckQuery = `
          SELECT * FROM user_address
          WHERE user_id = $1 AND address_id = $2;
      `;
      const addressCheckResult = await client.query(addressCheckQuery, [user._id, address_id]);

      if (addressCheckResult.rowCount === 0) {
          throw new ApiError(404, "Address not found for this user.");
      }

      // Begin transaction to ensure atomicity
      await client.query('BEGIN');

      // Set all other addresses for this user to `is_default = false`
      const unsetDefaultQuery = `
          UPDATE user_address
          SET is_default = false
          WHERE user_id = $1;
      `;
      await client.query(unsetDefaultQuery, [user._id]);

      // Set the selected address to `is_default = true`
      const setDefaultQuery = `
          UPDATE user_address
          SET is_default = true
          WHERE user_id = $1 AND address_id = $2;
      `;
      await client.query(setDefaultQuery, [user._id, address_id]);

      // Commit transaction
      await client.query('COMMIT');

      res.status(200).json(new ApiResponse(
          200,
          { address_id },
          "Default address updated successfully."
      ));
  } catch (error) {
      // Rollback transaction in case of an error
      await client.query('ROLLBACK');
      throw new ApiError(
          (error as ApiError)?.statusCode || 500,
          (error as ApiError)?.message || "Failed to update default address."
      );
  }
});


export {
  addNewAddress,
  updateAddress,
  getAddresses,
  deleteAddress,
  changeDefaultAddress
}