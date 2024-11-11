import { client } from "../db/db.connect";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { createOrderPromise } from "../utils/razorpay";
import { verifyRazorpayPayment } from "../utils/razorpay";
import fs from "fs";
import path from "path";

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
  if (coupon_code) validateInput(coupon_code, "Coupon Code");

  if (!Array.isArray(order_items) || order_items.length === 0 || order_items.length > 5) {
    throw new ApiError(400, "Order items should be a non-empty array of valid product IDs with length 0 < len < 5.");
  }


  const uniqueProductIds = new Set();

order_items.forEach((item, index) => {
  validateInput(item, `Order item[${index}]`);

  if (uniqueProductIds.has(item.product_id)) {
    throw new ApiError(400, "Duplicate product detected. Product id - " + item.product_id);
  }

  uniqueProductIds.add(item.product_id);

  if (item.quantity <= 0 || item.quantity > 5) {
    throw new ApiError(400, "Quantity should be between 1 and 5. Product id - " + item.product_id);
  }
});


  let discountValue = 0;
  let discountedProductId = -1;
  if (coupon_code) {
    const checkCouponQuery = `
      SELECT product_id, discount_value, start_date, end_date, status
      FROM discounts
      WHERE coupon_code = $1;
    `;
    const couponResult = await client.query(checkCouponQuery, [coupon_code]);
    if (couponResult.rowCount === 0) {
      throw new ApiError(400, "Invalid coupon code.");
    }

    const coupon = couponResult.rows[0];

    if(!uniqueProductIds.has(coupon.product_id)){
      throw new ApiError(400,"Given coupoun is not valid for any the products.")
    }

    const currentDate = new Date();
    if (coupon.status !== 'active' || currentDate < new Date(coupon.start_date) || currentDate > new Date(coupon.end_date)) {
      throw new ApiError(400, "The coupon code is not active or is outside the valid date range.");
    }
    discountedProductId = coupon.product_id;
    discountValue = parseFloat(coupon.discount_value);
  }

  const productIds = order_items.map(item => Number(item.product_id));
  const checkProductsExistQuery = `
    SELECT _id, price, stock_quantity
    FROM products
    WHERE _id = ANY($1::int[]) AND status = 'active';
  `;

  const result = await client.query(checkProductsExistQuery, [productIds]);

  const stockProductMap = new Map(result.rows.map(row => [row._id,row.stock_quantity]))

  const existingProducts = new Map(result.rows.map(row => [row._id, row.price]));
  const missingProducts = productIds.filter(id => !existingProducts.has(id));


  if (missingProducts.length > 0) {
    throw new ApiError(400, `The following product IDs are invalid or inactive: ${missingProducts.join(', ')}`);
  }

  let grossAmount = 0;
  let discountAmount = 0;
  const orderItemsData = order_items.map(item => {

    const productPrice = existingProducts.get(item.product_id);
    const productStock = stockProductMap.get(item.product_id);

    if(productStock === 0){
      throw new ApiError(400,`Item with product id ${item.product_id} is out of stock.`)
    }

    if(productStock < item.quantity){
      throw new ApiError(400,`Quantity of product with id ${item.product_id} exeeds stock quantity.`)
    }


    const totalItemPrice = productPrice * item.quantity;
    if(item.product_id === discountedProductId){
      discountAmount = parseFloat(((totalItemPrice * discountValue) / 100).toFixed(2));
      grossAmount += totalItemPrice - discountAmount
    }else{
      grossAmount += totalItemPrice;
    }

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

  const netAmount = parseFloat(grossAmount.toFixed(2)) ;

  const orderPromise = createOrderPromise({ amount: netAmount, currency: "INR" });
  let order;
  try {
    order = await orderPromise;
    console.log(order);
    

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

  } catch (error : any) {
    throw new ApiError(500, "Something went wrong while creating order." + error.stack);
  }

  res.status(200).json(new ApiResponse(200, {
    order_id: order.id,
    currency: "INR",
    amount: order.amount,
  }));
});

// on verification stock decreasing not implemented
const verifyPayment = asyncHandler(async (req, res) => {
  console.log(req);

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  console.log(req.body);

  // Validate inputs
  validateInput(razorpay_payment_id, "Razorpay Payment ID");
  validateInput(razorpay_order_id, "Razorpay Order ID");
  validateInput(razorpay_signature, "Razorpay Signature");

  // Check if the order exists and belongs to the user
  const checkOrderQuery = `
    SELECT _id, payment_status, net_amount
    FROM orders
    WHERE order_number = $1;
  `;
  const orderResult = await client.query(checkOrderQuery, [razorpay_order_id]);

  if (orderResult.rowCount === 0) {
    throw new ApiError(400, "Order not found or does not belong to the user.");
  }

  const order = orderResult.rows[0];

  if (order.payment_status === "paid") {
    throw new ApiError(400, "The order has already been paid.");
  }

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


  try {
    const filePath = path.join(__dirname, '../../public/paymentSuccessfullPage/paymentSuccess.html');

    let htmlData = fs.readFileSync(filePath, 'utf8');

    // Replace placeholders with actual data
    const html = htmlData
      .replace('{{ORDER_ID}}', razorpay_order_id)
      .replace('{{AMOUNT}}', order.net_amount)
      .replace('{{REDIRECT_LINK}}', `/orders/${order._id}`);

    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("Could not load confirmation page");
  }
  // res.status(200).json(new ApiResponse(200,null,"Payment verified and order status updated to paid."));
});


export { createOrder, verifyPayment };