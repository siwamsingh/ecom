import { client } from "../db/db.connect";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const addToCart = asyncHandler(async (req, res) => {
  const { product_id, quantity } = req.body;
  const user = req.user;

  try {
    // Validate input
    if (!product_id || !quantity || quantity <= 0) {
      throw new ApiError(401, "Product ID and a positive quantity are required.");
    }

    if (quantity > 5) {
      throw new ApiError(401, "Quantity should be between 1 and 5.");
    }

    // Check if the product exists and is active
    const productCheckQuery = `SELECT 1 FROM products WHERE _id = $1 AND status = 'active';`;
    const productResult = await client.query(productCheckQuery, [product_id]);
    if (productResult.rowCount === 0) {
      throw new ApiError(404, "Product not found.");
    }

    // Check the number of items in the cart for this user
    const cartCountQuery = `SELECT COUNT(*) FROM cart WHERE user_id = $1;`;
    const cartCountResult = await client.query(cartCountQuery, [user._id]);
    const cartItemCount = parseInt(cartCountResult.rows[0].count, 10);

    if (cartItemCount >= 5) {
      throw new ApiError(401, "Cart limit reached. Only 5 items allowed in the cart at a time.");
    }

    // Check if the product is already in the cart
    const cartCheckQuery = `SELECT * FROM cart WHERE user_id = $1 AND product_id = $2;`;
    const cartCheckResult = await client.query(cartCheckQuery, [user._id, product_id]);

    if (cartCheckResult.rowCount && cartCheckResult.rowCount > 0) {
      throw new ApiError(401, "Product already in cart.");
    }

    // Insert into cart
    const insertQuery = `
      INSERT INTO cart (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [user._id, product_id, quantity]);

    res.status(200).json(new ApiResponse(200, { cart: result.rows[0] }, "Product added to cart successfully."));
  } catch (error) {
    throw new ApiError((error as ApiError)?.statusCode || 500, (error as ApiError)?.message || "Failed to add product to cart.");
  }
});

const updateCart = asyncHandler(async (req, res) => {
  const { product_id, quantity } = req.body;
  const user = req.user;

  try {
    // Validate input
    if (!product_id || !quantity || quantity <= 0) {
      throw new ApiError(401, "Product ID and a positive quantity are required.");
    }

    if(quantity > 5){
      throw new ApiError(401,"Quantity should be between 1 and 5.")
    }

    // Validate product exists in cart
    const cartCheckQuery = `SELECT * FROM cart WHERE user_id = $1 AND product_id = $2;`;
    const cartCheckResult = await client.query(cartCheckQuery, [user._id, product_id]);

    if (cartCheckResult.rowCount === 0) {
      throw new ApiError(401, "Product not found in cart.");
    }

    // Update quantity in cart
    const updateQuery = `
      UPDATE cart
      SET quantity = $1
      WHERE user_id = $2 AND product_id = $3
      RETURNING *;
    `;
    const result = await client.query(updateQuery, [quantity, user._id, product_id]);

    res.status(200).json(new ApiResponse(200, { cart: result.rows[0] }, "Cart updated successfully."));
  } catch (error) {
    throw new ApiError((error as ApiError)?.statusCode || 500, (error as ApiError)?.message || "Failed to update cart.");
  }
});

const deleteFromCart = asyncHandler(async (req, res) => {
  const { product_id } = req.body;
  const user = req.user;

  try {
    // Validate input
    if (!product_id) {
      throw new ApiError(401, "Product ID is required.");
    }

    // Validate product exists in cart
    const cartCheckQuery = `SELECT * FROM cart WHERE user_id = $1 AND product_id = $2;`;
    const cartCheckResult = await client.query(cartCheckQuery, [user._id, product_id]);

    if (cartCheckResult.rowCount === 0) {
      throw new ApiError(401, "Product not found in cart.");
    }

    // Delete from cart
    const deleteQuery = `DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *;`;
    const result = await client.query(deleteQuery, [user._id, product_id]);

    res.status(200).json(new ApiResponse(200, { cart: result.rows[0] }, "Product removed from cart successfully."));
  } catch (error) {
    throw new ApiError((error as ApiError)?.statusCode || 500, (error as ApiError)?.message || "Failed to remove product from cart.");
  }
});

const getCart = asyncHandler(async (req, res) => {
  const user = req.user; // Assuming user is attached to req object after authentication

  try {
    // Validate that the user is logged in
    if (!user) {
      throw new ApiError(401, "Unauthorized. Please log in.");
    }

    // SQL query to retrieve active cart items for the user along with product details
    const cartQuery = `
      SELECT 
        cart._id AS cart_id,
        cart.quantity,
        products._id AS product_id,
        products.product_name,
        products.price,
        products.status,
        products.image_url
      FROM cart
      JOIN products ON cart.product_id = products._id
      WHERE cart.user_id = $1 ;
    `;

    const cartResult = await client.query(cartQuery, [user._id]);

    // Check if the cart is empty
    if (cartResult.rowCount === 0) {
      return res.status(200).json(new ApiResponse(
        200,
        { cart: [] },
        "Your cart is empty."
      ));
    }

    // Respond with the user's cart items
    res.status(200).json(new ApiResponse(
      200,
      { cart: cartResult.rows },
      "Cart retrieved successfully."
    ));
  } catch (error) {
    // Catch any unexpected errors
    throw new ApiError(
      (error as ApiError)?.statusCode || 500,
      (error as ApiError)?.message || "Failed to retrieve cart items."
    );
  }
});

export {
  addToCart,
  updateCart,
  deleteFromCart,
  getCart
}
