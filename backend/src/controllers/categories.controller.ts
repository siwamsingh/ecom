import { client } from "../db/db.connect";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const getAllCategories = asyncHandler(async (req, res) => {
  const user = req.user;

  try {
    const query = `
      SELECT _id, category_name, url_slug, parent_categorie_id, status
      FROM categories
      ORDER BY category_name;
    `;

    const result = await client.query(query);

    res.status(200).json(
      new ApiResponse(200, { categories: result.rows }, "Categories fetched successfully")
    );
  } catch (error) {
    throw new ApiError(505, "Failed to fetch categories.");
  }
});

const addNewCategory = asyncHandler(async (req, res) => {

  let { category_name, url_slug, parent_categorie_id, status } = req.body;

  const user = req.user;

  if (user.role !== "admin") {
    throw new ApiError(402, "Permission Denied.")
  }

  if (!category_name || !url_slug || !status) {
    throw new ApiError(400, "Missing required fields.");
  }

  category_name = category_name.trim();
  url_slug = url_slug.trim();

  if (status !== "active" && status !== "inactive") {
    throw new ApiError(401, "Incorrect value of status.")
  }

  if (!parent_categorie_id) {
    parent_categorie_id = null;
  }

  if (category_name === "" || url_slug === "") {
    throw new ApiError(400, "Missing required fields.");
  }

  try {
    const insertQuery = `
      INSERT INTO categories (category_name, url_slug, parent_categorie_id, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await client.query(insertQuery, [category_name, url_slug, parent_categorie_id, status]);
    res.status(201).json(new ApiResponse(
      200,
      {
        category: result.rows[0]
      },
      "Category created successfully"
    ));
  } catch (error) {

    interface pgError extends Error {
      code: string
    }

    if ((error as pgError).code === '23505') {
      throw new ApiError(409, "Category already exists.");
    }
    throw new ApiError(500, "Failed to create category.");
  }
})

const updateCategory = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  let { category_name, url_slug, status } = req.body;
  const user = req.user;

  if (user.role !== "admin") {
    throw new ApiError(403, "Permission Denied.");
  }

  if (!_id) {
    throw new ApiError(403, "Category ID is required.");
  }

  // Validate required fields
  if (!category_name && !url_slug && !status) {
    throw new ApiError(403, "At least one field is required to update.");
  }

  if (category_name) category_name = category_name.trim();
  if (url_slug) url_slug = url_slug.trim();

  if (category_name === "" || url_slug === "") {
    throw new ApiError(403, "Category name cannot be empty.");
  }

  if (status && status !== "active" && status !== "inactive") {
    throw new ApiError(403, "Invalid value for status.");
  }

  try {
    // Check if the category exists
    const checkQuery = `SELECT * FROM categories WHERE _id = $1`;
    const checkResult = await client.query(checkQuery, [_id]);

    if (checkResult.rowCount === 0) {
      throw new ApiError(403, "Category not found.");
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (category_name) {
      updateFields.push("category_name = $1");
      updateValues.push(category_name);
    }
    if (url_slug) {
      updateFields.push("url_slug = $" + (updateValues.length + 1));
      updateValues.push(url_slug);
    }
    if (status) {
      updateFields.push("status = $" + (updateValues.length + 1));
      updateValues.push(status);
    }

    updateValues.push(_id);

    const updateQuery = `
      UPDATE categories
      SET ${updateFields.join(", ")}
      WHERE _id = $${updateValues.length}
      RETURNING *;
    `;

    const result = await client.query(updateQuery, updateValues);

    res.status(200).json(
      new ApiResponse(200, { category: result.rows[0] }, "Category updated successfully")
    );
  } catch (error) {
    if ((error as any).code && (error as any).code === "23505") {
      throw new ApiError(403, "Category with the same name or URL slug already exists.");
    }

    throw new ApiError(403, "Failed to update category.");
  }
});

// NOTE: deal with child category when parent category is destroyed
const deleteCategory = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  const user = req.user;

  if (user.role !== "admin") {
    throw new ApiError(403, "Permission Denied.");
  }

  if (!_id) {
    throw new ApiError(403, "Category ID is required.");
  }

  try {
    const checkQuery = `SELECT * FROM categories WHERE _id = $1`;
    const checkResult = await client.query(checkQuery, [_id]);

    if (checkResult.rowCount === 0) {
      throw new ApiError(403, "Category not found.");
    }

    const deleteQuery = `DELETE FROM categories WHERE _id = $1 RETURNING *;`;
    const result = await client.query(deleteQuery, [_id]);

    res.status(200).json(
      new ApiResponse(200, { category: result.rows[0] }, "Category deleted successfully")
    );
  } catch (error) {
    throw new ApiError(403, (error as ApiError).message || "Failed to delete category.");
  }
});

export {
  addNewCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
}