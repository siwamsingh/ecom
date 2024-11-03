import { client } from "../db/db.connect";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadToCloudinary } from "../utils/cloudinary";

const addNewProduct = asyncHandler(async (req, res) => {
  let { product_name, url_slug, categorie_id, description, price, stock_quantity, status } = req.body;

  const user = req.user;
  
  const productImagePath = req.file?.path;

  if(!productImagePath){
    throw new ApiError(400,"Product image is required.");
  }

  const {success , imageUrl}= await uploadToCloudinary(productImagePath);

  if(!success){
    throw new ApiError(500,"Failed to upload image.")
  }
  

  if (user.role !== "admin") {
    throw new ApiError(402, "Permission Denied.");
  }

  if (!product_name || !url_slug || !price || !status) {
    throw new ApiError(400, "Missing required fields.");
  }

  product_name = product_name.trim();
  url_slug = url_slug.trim();

  if (status !== "active" && status !== "inactive") {
    throw new ApiError(401, "Incorrect value for status.");
  }

  if (product_name === "" || url_slug === "" || price==="") {
    throw new ApiError(400, "Missing required fields.");
  }

  // Set default values for optional fields
  if (description == null) description = "";
  if (stock_quantity == null) stock_quantity = 0;

  try {
    const insertQuery = `
      INSERT INTO products (product_name, url_slug, categorie_id, description, price, stock_quantity, status, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const result = await client.query(insertQuery, [product_name, url_slug, categorie_id, description, price, stock_quantity, status, imageUrl]);
    res.status(201).json(new ApiResponse(
      200,
      { product: result.rows[0] },
      "Product created successfully"
    ));
  } catch (error) {
    interface pgError extends Error {
      code: string
    }

    // Handle unique constraint violation for url_slug
    if ((error as pgError).code === '23505') {
      throw new ApiError(409, "Product with this URL slug already exists.");
    }
    throw new ApiError(500, "Failed to create product.");
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  let { product_name, url_slug, categorie_id, description, price, stock_quantity, status } = req.body;
  const user = req.user;

  // Check if user has admin privileges
  if (user.role !== "admin") {
    throw new ApiError(403, "Permission Denied.");
  }

  // Check if the product ID is provided
  if (!_id) {
    throw new ApiError(400, "Product ID is required.");
  }

  if (!product_name && !url_slug && !categorie_id && !description && !price && !stock_quantity && !status) {
    throw new ApiError(400, "At least one field is required to update.");
  }

  if (product_name) product_name = product_name.trim();
  if (url_slug) url_slug = url_slug.trim();

  // Validation checks
  if ((product_name === "") || (url_slug === "")) {
    throw new ApiError(400, "Product name and URL slug cannot be empty.");
  }

  if (status && status !== "active" && status !== "inactive") {
    throw new ApiError(400, "Invalid value for status.");
  }

  if (price != null && price < 0) {
    throw new ApiError(400, "Price cannot be negative.");
  }

  if (stock_quantity != null && stock_quantity < 0) {
    throw new ApiError(400, "Stock quantity cannot be negative.");
  }

  try {
    // Check if the product exists
    const checkQuery = `SELECT * FROM products WHERE _id = $1`;
    const checkResult = await client.query(checkQuery, [_id]);

    if (checkResult.rowCount === 0) {
      throw new ApiError(404, "Product not found.");
    }

    // If categorie_id is provided, check if it exists
    if (categorie_id) {
      const categoryCheckQuery = `SELECT _id FROM categories WHERE _id = $1`;
      const categoryResult = await client.query(categoryCheckQuery, [categorie_id]);
      if (categoryResult.rowCount === 0) {
        throw new ApiError(400, "Invalid category ID.");
      }
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (product_name) {
      updateFields.push("product_name = $" + (updateValues.length + 1));
      updateValues.push(product_name);
    }
    if (url_slug) {
      updateFields.push("url_slug = $" + (updateValues.length + 1));
      updateValues.push(url_slug);
    }
    if (categorie_id) {
      updateFields.push("categorie_id = $" + (updateValues.length + 1));
      updateValues.push(categorie_id);
    }
    if (description != null) {
      updateFields.push("description = $" + (updateValues.length + 1));
      updateValues.push(description);
    }
    if (price != null) {
      updateFields.push("price = $" + (updateValues.length + 1));
      updateValues.push(price);
    }
    if (stock_quantity != null) {
      updateFields.push("stock_quantity = $" + (updateValues.length + 1));
      updateValues.push(stock_quantity);
    }
    if (status) {
      updateFields.push("status = $" + (updateValues.length + 1));
      updateValues.push(status);
    }

    updateValues.push(_id);

    const updateQuery = `
      UPDATE products
      SET ${updateFields.join(", ")}
      WHERE _id = $${updateValues.length}
      RETURNING *;
    `;

    const result = await client.query(updateQuery, updateValues);

    res.status(200).json(
      new ApiResponse(200, { product: result.rows[0] }, "Product updated successfully")
    );
  } catch (error) {
    interface pgError extends Error {
      code: string
    }

    // Handle unique constraint violation for url_slug
    if ((error as pgError).code === "23505") {
      throw new ApiError(409, "Product with the same URL slug already exists.");
    }

    throw new ApiError(500, "Failed to update product.");
  }
});




export {
  addNewProduct,
  updateProduct,
}