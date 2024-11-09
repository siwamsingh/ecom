import { client } from "../db/db.connect";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { createOrderPromise } from "../utils/razorpay";
import { verifyRazorpayPayment } from "../utils/razorpay";

const validateInput = (field: string, fieldName: string) => {
  if (!field) {
    throw new ApiError(400, `${fieldName} is required.`);
  }
  if (typeof field === 'string' && field.trim() === "") {
    throw new ApiError(400, `${fieldName} cannot be empty.`);
  }
  return field;
};


const createOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  const { order_items, shipping_address_id, coupon_code } = req.body;

  validateInput(shipping_address_id, "Shipping Address");
  if(coupon_code) validateInput(coupon_code, "Coupon Code");

  if (!Array.isArray(order_items) || order_items.length === 0) {
    throw new ApiError(400, "Order items should be a non-empty array of valid product IDs.");
  }


  order_items.forEach((item, index) => {
    validateInput(item, `Order item[${index}]`);
  });

  const productIds = order_items.map(item => Number(item.product_id));
  const checkProductsExistQuery = `
    SELECT _id, price
    FROM products
    WHERE _id = ANY($1::int[]) AND status = 'active';
  `;

  const result = await client.query(checkProductsExistQuery, [productIds]);
  
  const existingProducts = new Map(result.rows.map(row => [row._id, row.price]));
  const missingProducts = productIds.filter(id => !existingProducts.has(id));
  
  if (missingProducts.length > 0) {
    throw new ApiError(400, `The following product IDs are invalid or inactive: ${missingProducts.join(', ')}`);
  }

  let grossAmount = 0;
  const orderItemsData = order_items.map(item => {
    const productPrice = existingProducts.get(item.product_id);
    const totalItemPrice = productPrice * item.quantity;
    grossAmount += totalItemPrice;
    return { ...item, price: productPrice, total_amount: totalItemPrice };
  });

  const checkAddressQuery = `
    SELECT address._id
    FROM address
    JOIN user_address ON address._id = user_address.address_id
    WHERE address._id = $1 AND user_address.user_id = $2;
  `;
  const addressResult = await client.query(checkAddressQuery, [shipping_address_id, user._id]);
  if (addressResult.rowCount === 0) {
    throw new ApiError(400, "Invalid shipping address. Ensure the address belongs to the user.");
  }

  let discountValue = 0;
  if (coupon_code) {
    const checkCouponQuery = `
      SELECT discount_value, start_date, end_date, status
      FROM discounts
      WHERE coupon_code = $1;
    `;
    const couponResult = await client.query(checkCouponQuery, [coupon_code]);
    if (couponResult.rowCount === 0) {
      throw new ApiError(400, "Invalid coupon code.");
    }

    const coupon = couponResult.rows[0];
    const currentDate = new Date();
    if (coupon.status !== 'active' || currentDate < new Date(coupon.start_date) || currentDate > new Date(coupon.end_date)) {
      throw new ApiError(400, "The coupon code is not active or is outside the valid date range.");
    }
    discountValue = parseFloat(coupon.discount_value);
  }

  const discountAmount = (grossAmount * discountValue) / 100;
  const netAmount = grossAmount - discountAmount;

  const orderPromise = createOrderPromise({ amount: netAmount, currency: "INR" });
  let order;
  try {
    order = await orderPromise;

    const orderNumber = order.id; // Use order.id as the order_number

    const createOrderQuery = `
    INSERT INTO orders (order_number, user_id, total_amount, discount_amount, gross_amount, net_amount, status, payment_status, shipping_address_id)
    VALUES ($1, $2, $3, $4, $5, $6, 'placed', 'unpaid', $7)
    RETURNING _id;
  `;
    const orderResult = await client.query(createOrderQuery, [
      orderNumber,
      user._id,
      netAmount,
      discountAmount,
      grossAmount,
      netAmount,
      shipping_address_id,
    ]);

    const orderId = orderResult.rows[0]._id;

    const insertOrderItemsQuery = `
    INSERT INTO order_items (order_id, product_id, quantity, price, total_amount , shipping_address_id)
    VALUES ($1, $2, $3, $4, $5, $6);
  `;
    const orderItemsPromises = orderItemsData.map(item =>
      client.query(insertOrderItemsQuery, [orderId, item.product_id, item.quantity, item.price, item.total_amount, shipping_address_id])
    );
    await Promise.all(orderItemsPromises);

  } catch (error) {
    throw new ApiError(500, "Something went wrong while creating order.");
  }

  res.status(200).json(new ApiResponse(200, {
    order_id: order.id,
    currency: "INR",
    amount: order.amount,
  }));
});


const verifyPayment = asyncHandler(async (req, res) => {
  console.log(req);

  const {  razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
console.log(req.body);

  // Validate inputs
  validateInput(razorpay_payment_id, "Razorpay Payment ID");
  validateInput(razorpay_order_id, "Razorpay Order ID");
  validateInput(razorpay_signature, "Razorpay Signature");

  // Check if the order exists and belongs to the user
  const checkOrderQuery = `
    SELECT _id, payment_status
    FROM orders
    WHERE order_number = $1;
  `;
  const orderResult = await client.query(checkOrderQuery, [razorpay_order_id]);

  if (orderResult.rowCount === 0) {
    throw new ApiError(400, "Order not found or does not belong to the user.");
  }

  const order = orderResult.rows[0];

  // Check if payment is already marked as paid
  if (order.payment_status === "paid") {
    throw new ApiError(400, "The order has already been paid.");
  }

  // Use the verifyRazorpayPayment function
  try {
    verifyRazorpayPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });
  } catch (error) {
    throw new ApiError(400, "Payment verification failed. Invalid signature.");
  }

  // Update the order status to 'paid' after successful verification
  const updateOrderStatusQuery = `
    UPDATE orders
    SET payment_status = 'paid', payment_transaction_id = $1
    WHERE _id = $2;
  `;
  await client.query(updateOrderStatusQuery, [razorpay_payment_id, order._id]);


  // send a static page of Payment Successfull
  res.status(200).json(new ApiResponse(200,null,"Payment verified and order status updated to paid."));
});


export { createOrder , verifyPayment};