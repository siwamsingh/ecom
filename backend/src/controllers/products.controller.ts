import { client } from "../db/db.connect";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary";
import fs from "fs"

const addNewProduct = asyncHandler(async (req, res) => {
  let { product_name, url_slug, categorie_id, description, price, stock_quantity, status } = req.body;
  const user = req.user;
  const productImagePath = req.file?.path;

  try {
    if (!productImagePath) {
      throw new ApiError(401, "Product image is required.");
    }
  
    if (user.role !== "admin") {
      throw new ApiError(401, "Permission Denied.");
    }
  
    if (!product_name || !url_slug || !price || !status) {
      throw new ApiError(401, "Missing required fields.");
    }
  
    product_name = product_name.trim();
    url_slug = url_slug.trim();
  
    if (status !== "active" && status !== "inactive") {
      throw new ApiError(401, "Incorrect value for status.");
    }
  
    if (product_name === "" || url_slug === "" || price === "") {
      throw new ApiError(401, "Missing required fields.");
    }
  
    // Set default values for optional fields
    if (description == null) description = "";
    if (stock_quantity == null) stock_quantity = 0;
  
    // Check if a product with the same url_slug already exists
    const slugCheckQuery = `
      SELECT 1 FROM products WHERE url_slug = $1;
    `;
    const slugCheckResult = await client.query(slugCheckQuery, [url_slug]);
  
    if ( slugCheckResult.rowCount && slugCheckResult.rowCount > 0) {
      throw new ApiError(401, "Product with this URL slug already exists.");
    }
  
    // Proceed with the upload to Cloudinary only if url_slug is unique
    const { success, imageUrl } = await uploadToCloudinary(productImagePath);
  
    if (!success) {
      throw new ApiError(501, "Failed to upload image.");
    }
  
    try {
      const insertQuery = `
        INSERT INTO products (product_name, url_slug, categorie_id, description, price, stock_quantity, status, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
  
      const result = await client.query(insertQuery, [product_name, url_slug, categorie_id, description, price, stock_quantity, status, imageUrl]);
  
      res.status(200).json(new ApiResponse(
        200,
        { product: result.rows[0] },
        "Product created successfully"
      ));
    } catch (error) {
      interface pgError extends Error {
        code: string
      }
  
      // Ensure the uploaded image is deleted if there's an error during insertion
      await deleteFromCloudinary(imageUrl);
  
      // Handle unique constraint violation for url_slug
      if ((error as pgError).code === '23505') {
        throw new ApiError(401, "Product with this URL slug already exists.");
      }
  
      throw new ApiError(501, "Failed to create product.");
    }
  } catch (error: any) {
    if (productImagePath && fs.existsSync(productImagePath)) {
      fs.unlinkSync(productImagePath);
    }
    throw new ApiError((error as ApiError)?.statusCode || 500 , (error as ApiError)?.message || "Something went wrong while adding new product.")
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  let { product_name, url_slug, categorie_id, description, price, stock_quantity, status } = req.body;
  const user = req.user;
  const productImagePath = req.file?.path;

  try {
    // Check if user has admin privileges
    if (user.role !== "admin") {
      throw new ApiError(401, "Permission Denied.");
    }
  
    // Check if the product ID is provided
    if (!_id) {
      throw new ApiError(401, "Product ID is required.");
    }
  
    // Ensure at least one field is being updated
    if (!product_name && !url_slug && !categorie_id && !description && !price && !stock_quantity && !status && !productImagePath) {
      throw new ApiError(401, "At least one field is required to update.");
    }
  
    if (product_name) product_name = product_name.trim();
    if (url_slug) url_slug = url_slug.trim();
  
    // Validation checks
    if ((product_name === "") || (url_slug === "")) {
      throw new ApiError(401, "Product name and URL slug cannot be empty.");
    }
  
    if (status && status !== "active" && status !== "inactive") {
      throw new ApiError(401, "Invalid value for status.");
    }
  
    if (price != null && price < 0) {
      throw new ApiError(401, "Price cannot be negative.");
    }
  
    if (stock_quantity != null && stock_quantity < 0) {
      throw new ApiError(401, "Stock quantity cannot be negative.");
    }
  
  
    let imageUrl;
    try {
      // Check if the product exists
      const checkQuery = `SELECT * FROM products WHERE _id = $1`;
      const checkResult = await client.query(checkQuery, [_id]);
  
      if (checkResult.rowCount === 0) {
        throw new ApiError(401, "Product not found.");
      }
  
      // If categorie_id is provided, check if it exists
      if (categorie_id) {
        const categoryCheckQuery = `SELECT _id FROM categories WHERE _id = $1`;
        const categoryResult = await client.query(categoryCheckQuery, [categorie_id]);
        if (categoryResult.rowCount === 0) {
          throw new ApiError(401, "Invalid category ID.");
        }
      }
  
      // Check if url_slug already exists for a different product
      if (url_slug) {
        const slugCheckQuery = `SELECT * FROM products WHERE url_slug = $1 AND _id <> $2`;
        const slugCheckResult = await client.query(slugCheckQuery, [url_slug, _id]);
  
        if (slugCheckResult.rowCount && slugCheckResult.rowCount > 0) {
          throw new ApiError(401, "Product with the same URL slug already exists.");
        }
      }
  
      const updateFields: string[] = [];
      const updateValues: any[] = [];
  
      // Handle uploaded image
      if (productImagePath) {
        const { success, imageUrl: cloudinaryUrl } = await uploadToCloudinary(productImagePath);
        if (!success) {
          if (fs.existsSync(productImagePath)) {
            fs.unlinkSync(productImagePath);
          }
          throw new ApiError(501, "Failed to upload image.");
        }
        imageUrl = cloudinaryUrl;
        updateFields.push("image_url = $" + (updateValues.length + 1));
        updateValues.push(imageUrl);
      }
  
      // Update other fields if provided
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
  
      if(imageUrl){
        deleteFromCloudinary(imageUrl);
      }
      
  
      // Handle unique constraint violation for url_slug
      if ((error as pgError).code === "23505") {
        throw new ApiError(409, "Product with the same URL slug already exists.");
      }
  
      throw new ApiError(500, "Failed to update product.");
    }
  } catch (error) {
    if (productImagePath && fs.existsSync(productImagePath)) {
      fs.unlinkSync(productImagePath);
    }
    throw new ApiError((error as ApiError)?.statusCode || 500 , (error as ApiError)?.message || "Something went wrong while adding new product.")
  }
});

const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, status, search } = req.body;

  if(status && status!="active" && status!=="inactive"){
    throw new ApiError(401,"Invalid value of status.")
  }

  // Pagination calculation
  const offset = (Number(page) - 1) * Number(limit);

  // Base query
  let baseQuery = `FROM products WHERE 1=1`;
  const queryParams: any[] = [];

  // Filtering by category
  if (category) {
    baseQuery += ` AND categorie_id = $${queryParams.length + 1}`;
    queryParams.push(category);
  }

  // Filtering by status
  if (status) {
    baseQuery += ` AND status = $${queryParams.length + 1}`;
    queryParams.push(status);
  }

  // Search by product name or description
  if (search) {
    baseQuery += ` AND (product_name ILIKE $${queryParams.length + 1} OR description ILIKE $${queryParams.length + 1})`;
    queryParams.push(`%${search}%`);
  }

  // Query to get the total count of products
  const countQuery = `SELECT COUNT(*) ${baseQuery}`;
  const countResult = await client.query(countQuery, queryParams);
  const totalCount = parseInt(countResult.rows[0].count, 10);
  const maxPages = Math.ceil(totalCount / Number(limit));

  // Query to get paginated products
  const dataQuery = `SELECT * ${baseQuery} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(limit, offset);

  const result = await client.query(dataQuery, queryParams);
  res.status(200).json(new ApiResponse(
    200,
    {
      page,
      limit,
      maxPages,
      totalCount,
      products: result.rows,
    },
    "Products fetched successfully."));
});

export {
  addNewProduct,
  updateProduct,
  getProducts
}