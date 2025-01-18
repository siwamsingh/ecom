import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createOrder, getAllOrders, getAllOrdersNoPagination, getOrdersOfUser, getOrdersStatistics, verifyPayment } from "../controllers/orders.controller";


const router = Router()

router.route('/create-order').post(verifyJWT,createOrder);
router.route('/verify-order').post(verifyPayment);

router.route('/get-user-orders').post(verifyJWT,getOrdersOfUser);
router.route('/get-all-orders').post(verifyJWT,getAllOrders);
router.route('/get-all-orders-np').post(verifyJWT,getAllOrdersNoPagination);
router.route('/get-orders-stats').post(verifyJWT,getOrdersStatistics);


export default router; 
