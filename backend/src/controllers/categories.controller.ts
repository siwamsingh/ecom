import { client } from "../db/db.connect";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const getAllCategories = asyncHandler(async (req, res) => {

})

const addNewCategory = asyncHandler(async (req, res) => {

  let { category_name, url_slug, parent_categorie_id, status } = req.body;

  const user = req.body.user;

  if(user.role !== "admin"){
    throw new ApiError(402,"Permission Denied.")
  }

  if (!category_name || !url_slug || !status) {
    throw new ApiError(400, "Missing required fields.");
  }

  category_name = category_name.trim();
  url_slug = url_slug.trim();
  
  if(status !== "active" && status !== "inactive"){
    throw new ApiError(401,"Incorrect value of status.")
  }

  if(!parent_categorie_id){
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

    interface pgError extends Error{
      code: string
    }

    if ((error as pgError).code === '23505') {
      throw new ApiError(409, "Category already exists.");
    }
    throw new ApiError(500, "Failed to create category.");
  }
})

const updateCategory = asyncHandler(async (req, res) => {

})

const deleteCategory = asyncHandler(async (req, res) => {

})

export { addNewCategory ,}