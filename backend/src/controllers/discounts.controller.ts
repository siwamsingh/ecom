import { client } from "../db/db.connect";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const addNewDiscount = asyncHandler(async (req, res) => {
  let { coupon_code, product_id, discount_value, start_date, end_date, description, status } = req.body;
  
  const user = req.user;

  try {
    // Check if the user has admin permissions
    if (user.role !== "admin") {
      throw new ApiError(401, "Permission Denied.");
    }

    // Validate required fields
    if (!coupon_code || !product_id || !discount_value || !start_date || !end_date || !status) {
      throw new ApiError(401, "Missing required fields.");
    }

    // Trim inputs
    coupon_code = coupon_code.trim();
    description = description?.trim() || "";

    // Check status value
    if (status !== "active" && status !== "inactive") {
      throw new ApiError(401, "Incorrect value for status.");
    }

    // Validate discount value is between 0 and 100
    if (discount_value < 0 || discount_value > 100) {
      throw new ApiError(401, "Discount value must be between 0 and 100.");
    }

    // Validate start and end dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (endDate <= startDate) {
      throw new ApiError(401, "End date must be after start date.");
    }

    // Check if a discount with the same coupon_code already exists
    const codeCheckQuery = `
      SELECT 1 FROM discounts WHERE coupon_code = $1;
    `;
    const codeCheckResult = await client.query(codeCheckQuery, [coupon_code]);

    if (codeCheckResult.rowCount && codeCheckResult.rowCount > 0) {
      throw new ApiError(401, "Discount with this coupon code already exists.");
    }

    // Insert the new discount into the database
    const insertQuery = `
      INSERT INTO discounts (coupon_code, product_id, discount_value, start_date, end_date, description, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const result = await client.query(insertQuery, [coupon_code, product_id, discount_value, start_date, end_date, description, status]);

    res.status(200).json(new ApiResponse(
      200,
      { discount: result.rows[0] },
      "Discount created successfully"
    ));
  } catch (error) {
    throw new ApiError((error as ApiError)?.statusCode || 501, (error as ApiError)?.message || "Something went wrong while adding new discount.");
  }
});

const updateDiscount = asyncHandler(async (req, res) => {
  const { _id, discount_value, start_date, end_date, status } = req.body;
  const user = req.user;

  try {
    if (user.role !== "admin") {
      throw new ApiError(401, "Permission Denied.");
    }

    if (!_id) {
      throw new ApiError(401, "Discount ID is required.");
    }

    if (discount_value == null && !start_date && !end_date && !status) {
      throw new ApiError(401, "At least one field is required to update.");
    }

    // Validate fields
    if (discount_value != null && (discount_value < 0 || discount_value > 100)) {
      throw new ApiError(401, "Discount value must be between 0 and 100.");
    }

    const startDate = start_date ? new Date(start_date) : null;
    const endDate = end_date ? new Date(end_date) : null;

    if (startDate && endDate && endDate <= startDate) {
      throw new ApiError(401, "End date must be after start date.");
    }

    if (status && status !== "active" && status !== "inactive") {
      throw new ApiError(401, "Invalid value for status.");
    }

    // Check if the discount exists
    const checkQuery = `SELECT * FROM discounts WHERE _id = $1`;
    const checkResult = await client.query(checkQuery, [_id]);

    if (checkResult.rowCount === 0) {
      throw new ApiError(401, "Discount not found.");
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (discount_value != null) {
      updateFields.push("discount_value = $" + (updateValues.length + 1));
      updateValues.push(discount_value);
    }
    if (start_date) {
      updateFields.push("start_date = $" + (updateValues.length + 1));
      updateValues.push(start_date);
    }
    if (end_date) {
      updateFields.push("end_date = $" + (updateValues.length + 1));
      updateValues.push(end_date);
    }
    if (status) {
      updateFields.push("status = $" + (updateValues.length + 1));
      updateValues.push(status);
    }

    updateValues.push(_id);

    const updateQuery = `
      UPDATE discounts
      SET ${updateFields.join(", ")}
      WHERE _id = $${updateValues.length}
      RETURNING *;
    `;

    const result = await client.query(updateQuery, updateValues);

    res.status(200).json(
      new ApiResponse(200, { discount: result.rows[0] }, "Discount updated successfully")
    );
  } catch (error) {
    interface pgError extends Error {
      code: string;
    }
    throw new ApiError((error as pgError).code === "23505" ? 409 : 501, "Failed to update discount.");
  }
});

const validateDiscountFilters = (status?: string, expired?: boolean) => {
  const validStatuses = ['active', 'inactive'];

  if (status && !validStatuses.includes(status)) {
    throw new ApiError(401, `Invalid status. Allowed values are: ${validStatuses.join(', ')}`);
  }

  if (expired !== undefined && typeof expired !== 'boolean') {
    throw new ApiError(401, "Invalid value for expired. It must be a boolean (true or false).");
  }
};

const getDiscount = asyncHandler(async (req, res) => {
  const { product_id, status, expired } = req.body;

  // Validate inputs
  validateDiscountFilters(status, expired);

  const queryParams: any[] = [];
  let baseQuery = `SELECT * FROM discounts WHERE 1=1`;

  if (product_id) {
    baseQuery += ` AND product_id = $${queryParams.length + 1}`;
    queryParams.push(product_id);
  }

  if (status) {
    baseQuery += ` AND status = $${queryParams.length + 1}`;
    queryParams.push(status);
  }

  if (expired === true) {
    baseQuery += ` AND end_date < NOW()`;
  } else if (expired === false) {
    baseQuery += ` AND end_date >= NOW()`;
  }

  const result = await client.query(baseQuery, queryParams);

  if (result.rowCount === 0) {
    res.status(200).json(new ApiResponse(200,
      {
        discount: [],
      },
      "Discounts fetched successfully."
    ));
  }

  res.status(200).json(new ApiResponse(200,
    {
      discount: result.rows,
    },
    "Discounts fetched successfully."
  ));
});

const getDiscounts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, expired } = req.body;

  // Validate inputs
  validateDiscountFilters(status, expired);

  const offset = (Number(page) - 1) * Number(limit);
  let baseQuery = `FROM discounts WHERE 1=1`;
  const queryParams: any[] = [];

  if (status) {
    baseQuery += ` AND status = $${queryParams.length + 1}`;
    queryParams.push(status);
  }

  if (expired === true) {
    baseQuery += ` AND end_date < NOW()`;
  } else if (expired === false) {
    baseQuery += ` AND end_date >= NOW()`;
  }

  const countQuery = `SELECT COUNT(*) ${baseQuery}`;
  const countResult = await client.query(countQuery, queryParams);
  const totalCount = parseInt(countResult.rows[0].count, 10);
  const maxPages = Math.ceil(totalCount / Number(limit));

  const dataQuery = `SELECT * ${baseQuery} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(limit, offset);

  const result = await client.query(dataQuery, queryParams);

  res.status(200).json(new ApiResponse(200,{
    page,
    limit,
    maxPages,
    totalCount,
    discounts: result.rows,
  },"Discounts fetched successfully."));
});

const deleteDiscount = asyncHandler(async (req, res) => {
  const { discount_id } = req.body;
  const user = req.user;

  // Check if user has admin privileges
  if (user.role !== "admin") {
    throw new ApiError(401, "Permission Denied.");
  }

  // Check if discount ID is provided
  if (!discount_id) {
    throw new ApiError(401, "Discount ID is required.");
  }

  try {
    // Check if the discount exists
    const checkQuery = `SELECT * FROM discounts WHERE _id = $1`;
    const checkResult = await client.query(checkQuery, [discount_id]);

    if (checkResult.rowCount === 0) {
      throw new ApiError(401, "Discount not found.");
    }

    // Delete the discount
    const deleteQuery = `DELETE FROM discounts WHERE _id = $1 RETURNING *`;
    const deleteResult = await client.query(deleteQuery, [discount_id]);

    res.status(200).json(
      new ApiResponse(200, { discount: deleteResult.rows[0] }, "Discount deleted successfully")
    );
  } catch (error) {
    throw new ApiError(501, "Failed to delete discount.");
  }
});


export {
  addNewDiscount,
  updateDiscount,
  getDiscount,
  getDiscounts,
  deleteDiscount
}