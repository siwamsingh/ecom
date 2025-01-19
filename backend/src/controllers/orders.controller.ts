import { query } from "express";
import { client } from "../db/db.connect";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { createOrderPromise } from "../utils/razorpay";
import { verifyRazorpayPayment } from "../utils/razorpay";
import fs from "fs";
import path from "path";

import { createHmac } from 'crypto';


const validateInput = (field: string, fieldName: string) => {
  if (!field) {
    throw new ApiError(401, `${fieldName} is required.`);
  }
  if (typeof field === 'string' && field.trim() === "") {
    throw new ApiError(401, `${fieldName} cannot be empty.`);
  }
  return field;
};


const createOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  const { order_items, shipping_address_id, coupon_code } = req.body;

  validateInput(shipping_address_id, "Shipping Address");
  if (coupon_code) validateInput(coupon_code, "Coupon Code");

  if (!Array.isArray(order_items) || order_items.length === 0 || order_items.length > 5) {
    throw new ApiError(401, "Order items should be a non-empty array of valid product IDs with length 0 < len < 5.");
  }


  const uniqueProductIds = new Set();

order_items.forEach((item, index) => {
  validateInput(item, `Order item[${index}]`);

  if (uniqueProductIds.has(item.product_id)) {
    throw new ApiError(401, "Duplicate product detected. Product id - " + item.product_id);
  }

  uniqueProductIds.add(item.product_id);

  if (item.quantity <= 0 || item.quantity > 5) {
    throw new ApiError(401, "Quantity should be between 1 and 5. Product id - " + item.product_id);
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
      throw new ApiError(401, "Invalid coupon code.");
    }

    const coupon = couponResult.rows[0];

    if(!uniqueProductIds.has(coupon.product_id)){
      throw new ApiError(401,"Given coupoun is not valid for any the products.")
    }

    const currentDate = new Date();
    if (coupon.status !== 'active' || currentDate < new Date(coupon.start_date) || currentDate > new Date(coupon.end_date)) {
      throw new ApiError(401, "The coupon code is not active or is outside the valid date range.");
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
    throw new ApiError(401, `The following product IDs are invalid or inactive: ${missingProducts.join(', ')}`);
  }

  let grossAmount = 0;
  let discountAmount = 0;
  const orderItemsData = order_items.map(item => {

    const productPrice = existingProducts.get(item.product_id);
    const productStock = stockProductMap.get(item.product_id);

    if(productStock === 0){
      throw new ApiError(401,`Item with product id ${item.product_id} is out of stock.`)
    }

    if(productStock < item.quantity){
      throw new ApiError(401,`Quantity of product with id ${item.product_id} exeeds stock quantity.`)
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
    SELECT address.*
    FROM address
    JOIN user_address ON address._id = user_address.address_id
    WHERE address._id = $1 AND user_address.user_id = $2;
  `;
  const addressResult = await client.query(checkAddressQuery, [shipping_address_id, user._id]);
  if (addressResult.rowCount === 0) {
    throw new ApiError(401, "Invalid shipping address. Ensure the address belongs to the user.");
  }
  

  const shipping_address = JSON.stringify(addressResult.rows[0])

  const netAmount = parseFloat(grossAmount.toFixed(2)) ;

  const orderPromise = createOrderPromise({ amount: netAmount, currency: "INR" });
  let order;
  try {
    order = await orderPromise;

    const orderNumber = order.id; // Use order.id as the order_number

    const createOrderQuery = `
    INSERT INTO orders (order_number, user_id, total_amount, discount_amount, gross_amount, net_amount, status, payment_status, shipping_address)
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
      shipping_address,
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
    throw new ApiError(501, "Something went wrong while creating order." + error.stack);
  }

  res.status(200).json(new ApiResponse(200, {
    order_id: order.id,
    currency: "INR",
    amount: order.amount,
  }));
});

// on verification stock decreasing not implemented
const verifyPayment = asyncHandler(async (req, res) => {
  const secret = ''; 
  // Use raw payload for HMAC calculation
  const payloadString = JSON.stringify(req.body);
  const signature = req.headers['x-razorpay-signature'] as string;

  try {
    // Verify the signature
    const expectedSignature = createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }

    console.log('Webhook verified successfully:', req.body);
  } catch (error) {
    console.error('Error verifying webhook:', error);
    throw new ApiError(401, "Webhook not verified");
  }

  // Extract necessary data from payload
  const { payload } = req.body;
  if (!payload || !payload.payment || !payload.payment.entity) {
    throw new ApiError(400, "Invalid webhook payload structure");
  }

  const razorpay_payment_id = payload.payment.entity.id; // Payment ID
  const razorpay_order_id = payload.payment.entity.order_id; // Order ID

  // Validate inputs
  validateInput(razorpay_payment_id, "Razorpay Payment ID");
  validateInput(razorpay_order_id, "Razorpay Order ID");

  // Check if the order exists and belongs to the user
  const checkOrderQuery = `
    SELECT _id, payment_status, net_amount
    FROM orders
    WHERE order_number = $1;
  `;
  const orderResult = await client.query(checkOrderQuery, [razorpay_order_id]);

  if (orderResult.rowCount === 0) {
    throw new ApiError(401, "Order not found or does not belong to the user.");
  }

  const order = orderResult.rows[0];

  if (order.payment_status === "paid") {
    throw new ApiError(401, "The order has already been paid.");
  }

  // Update the order status to 'paid'
  const updateOrderStatusQuery = `
    UPDATE orders
    SET payment_status = 'paid', payment_transaction_id = $1
    WHERE _id = $2;
  `;
  await client.query(updateOrderStatusQuery, [razorpay_payment_id, order._id]);

  try {
    // Serve the confirmation page
    const filePath = path.join(__dirname, '../../public/paymentSuccessfullPage/paymentSuccess.html');
    const htmlData = fs.readFileSync(filePath, 'utf8');
    const html = htmlData
      .replace('{{ORDER_ID}}', razorpay_order_id)
      .replace('{{AMOUNT}}', order.net_amount)
      .replace('{{REDIRECT_LINK}}', `/orders/${order._id}`);

    res.status(200).send({ status: "ok" });
  } catch (error) {
    res.status(501).send("Could not load confirmation page");
  }
});


const getOrdersOfUser= asyncHandler(async (req,res)=>{
  const {user_id} = req.body;

  const user = req.user;

  if(!user_id){
    throw new ApiError(401,"user_id is required");
  }

  if (user.role && user.role !== "admin" && user._id !== Number(user_id)) {
    throw new ApiError(401, "Permisson Denied.")
  }

  const getOrdersQuery = `
  SELECT
    o.*,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'order_item_id', oi._id,
                'product_id', oi.product_id,
                'quantity', oi.quantity,
                'price', oi.price,
                'total_amount', oi.total_amount,
                'shipping_address_id', oi.shipping_address_id,
                'created_at', oi.created_at,
                'product_details', JSON_BUILD_OBJECT(
                    'product_id', p._id,
                    'product_name', p.product_name,
                    'url_slug', p.url_slug,
                    'categorie_id', p.categorie_id,
                    'description', p.description,
                    'price', p.price,
                    'stock_quantity', p.stock_quantity,
                    'status', p.status,
                    'image_url', p.image_url
                )
            )
        ) FILTER (WHERE oi._id IS NOT NULL),
        '[]'
    ) AS order_items
FROM
    orders o
LEFT JOIN
    order_items oi ON o._id = oi.order_id
LEFT JOIN
    products p ON oi.product_id = p._id
WHERE
    o.user_id = $1
GROUP BY
    o._id
ORDER BY
    o.created_at DESC;

  `

  try {
    const queryResult  = await client.query(getOrdersQuery,[user_id]);
    
    res.status(200).json(new ApiResponse(200,queryResult.rows,"Orders fetched successfully"))
      
  } catch (error: any) {
    throw new ApiError(
      error?.statusCode || 501,
      error?.message || "Something went wrong while fetching orders."
    );
  }
})

// admin routes
const getAllOrders = asyncHandler(async (req, res) => {

  const user = req.user;

  if (user.role && user.role !== "admin") {
    throw new ApiError(401, "Permisson Denied.")
  }

  const { payment_status, status, start_time, end_time, page = 1, limit = 10 } = req.body;

  // Pagination calculation
  const offset = (Number(page) - 1) * Number(limit);

  // Base query
  let baseQuery = `
    FROM orders o
    LEFT JOIN order_items oi ON o._id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p._id
    WHERE 1=1
  `;
  const queryParams: any[] = [];

  // Filtering by payment_status
  if (payment_status) {
    baseQuery += ` AND o.payment_status = $${queryParams.length + 1}`;
    queryParams.push(payment_status);
  }

  // Filtering by status
  if (status) {
    baseQuery += ` AND o.status = $${queryParams.length + 1}`;
    queryParams.push(status);
  }

  // Filtering by time range
  if (start_time) {
    baseQuery += ` AND o.created_at >= $${queryParams.length + 1}`;
    queryParams.push(start_time);
  }
  if (end_time) {
    baseQuery += ` AND o.created_at <= $${queryParams.length + 1}`;
    queryParams.push(end_time);
  }

  // Query to get the total count of orders
  const countQuery = `SELECT COUNT(DISTINCT o._id) ${baseQuery}`;
  const countResult = await client.query(countQuery, queryParams);
  const totalCount = parseInt(countResult.rows[0].count, 10);
  const maxPages = Math.ceil(totalCount / Number(limit));

  // Query to fetch paginated orders with aggregated order_items
  const dataQuery = `
    SELECT
      o.*,
      COALESCE(
          JSON_AGG(
              DISTINCT JSONB_BUILD_OBJECT(
                  'order_item_id', oi._id,
                  'product_id', oi.product_id,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'total_amount', oi.total_amount,
                  'shipping_address_id', oi.shipping_address_id,
                  'created_at', oi.created_at,
                  'product_details', JSONB_BUILD_OBJECT(
                      'product_id', p._id,
                      'product_name', p.product_name,
                      'url_slug', p.url_slug,
                      'categorie_id', p.categorie_id,
                      'description', p.description,
                      'price', p.price,
                      'stock_quantity', p.stock_quantity,
                      'status', p.status,
                      'image_url', p.image_url
                  )
              )
          ) FILTER (WHERE oi._id IS NOT NULL),
          '[]'
      ) AS order_items
    ${baseQuery}
    GROUP BY o._id
    ORDER BY o.created_at DESC
    LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};
  `;

  queryParams.push(limit, offset);

  try {
    const dataResult = await client.query(dataQuery, queryParams);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          page,
          limit,
          maxPages,
          totalCount,
          orders: dataResult.rows,
        },
        "Orders fetched successfully."
      )
    );
  } catch (error: any) {
    throw new ApiError(
      error?.statusCode || 501,
      error?.message || "Something went wrong while fetching orders."
    );
  }
});

const getAllOrdersNoPagination = asyncHandler(async (req, res) => {
  const { payment_status, status, start_time, end_time } = req.body;

  // Base query
  let baseQuery = `
    FROM orders o
    LEFT JOIN order_items oi ON o._id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p._id
    WHERE 1=1
  `;
  const queryParams: any[] = [];

  // Filtering by payment_status
  if (payment_status) {
    baseQuery += ` AND o.payment_status = $${queryParams.length + 1}`;
    queryParams.push(payment_status);
  }

  // Filtering by status
  if (status) {
    baseQuery += ` AND o.status = $${queryParams.length + 1}`;
    queryParams.push(status);
  }

  // Filtering by time range
  if (start_time) {
    baseQuery += ` AND o.created_at >= $${queryParams.length + 1}`;
    queryParams.push(start_time);
  }
  if (end_time) {
    baseQuery += ` AND o.created_at <= $${queryParams.length + 1}`;
    queryParams.push(end_time);
  }

  // Query to fetch orders with aggregated order_items
  const dataQuery = `
    SELECT
      o.*,
      COALESCE(
          JSON_AGG(
              DISTINCT JSONB_BUILD_OBJECT(
                  'order_item_id', oi._id,
                  'product_id', oi.product_id,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'total_amount', oi.total_amount,
                  'shipping_address_id', oi.shipping_address_id,
                  'created_at', oi.created_at,
                  'product_details', JSONB_BUILD_OBJECT(
                      'product_id', p._id,
                      'product_name', p.product_name,
                      'url_slug', p.url_slug,
                      'categorie_id', p.categorie_id,
                      'description', p.description,
                      'price', p.price,
                      'stock_quantity', p.stock_quantity,
                      'status', p.status,
                      'image_url', p.image_url
                  )
              )
          ) FILTER (WHERE oi._id IS NOT NULL),
          '[]'
      ) AS order_items
    ${baseQuery}
    GROUP BY o._id
    ORDER BY o.created_at DESC;
  `;

  try {
    const dataResult = await client.query(dataQuery, queryParams);

    res.status(200).json(
      new ApiResponse(
        200,
        { orders: dataResult.rows },
        "Orders fetched successfully."
      )
    );
  } catch (error: any) {
    throw new ApiError(
      error?.statusCode || 501,
      error?.message || "Something went wrong while fetching orders."
    );
  }
});

const getOrdersStatistics = asyncHandler(async (req, res) => {
  const getQueryForDay = (dayIndex: number) => `
    SELECT
      ${dayIndex} AS day,
      COUNT(*) FILTER (
        WHERE created_at >= DATE_TRUNC('day', (CURRENT_DATE + INTERVAL '1 day' - INTERVAL '${dayIndex} days'))
          AND created_at < DATE_TRUNC('day', (CURRENT_DATE + INTERVAL '1 day' - INTERVAL '${dayIndex - 1} days'))
      ) AS placed_orders,
      COUNT(*) FILTER (
        WHERE created_at >= DATE_TRUNC('day', (CURRENT_DATE + INTERVAL '1 day' - INTERVAL '${dayIndex} days'))
          AND created_at < DATE_TRUNC('day', (CURRENT_DATE + INTERVAL '1 day' - INTERVAL '${dayIndex - 1} days'))
          AND payment_status = 'paid'
      ) AS paid_orders,
      COUNT(*) FILTER (
        WHERE created_at >= DATE_TRUNC('day', (CURRENT_DATE + INTERVAL '1 day' - INTERVAL '${dayIndex} days'))
          AND created_at < DATE_TRUNC('day', (CURRENT_DATE + INTERVAL '1 day' - INTERVAL '${dayIndex - 1} days'))
          AND status = 'processing'
      ) AS orders_processed
    FROM orders
  `;

  const query = Array.from({ length: 10 }, (_, i) => getQueryForDay(1 + i)).join(' UNION ALL ');

  try {
    const result = await client.query(query);
    res.status(200).json(new ApiResponse(200, result.rows, "Order statistics fetched successfully"));
  } catch (error: any) {
    throw new ApiError(
      error?.statusCode || 501,
      error?.message || "Something went wrong while fetching order statistics"
    );
  }
});


export { createOrder, verifyPayment, 
  getOrdersOfUser , getAllOrders ,
  getAllOrdersNoPagination,
  getOrdersStatistics
 };