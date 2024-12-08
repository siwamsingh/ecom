import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createOrder, getOrdersOfUser, verifyPayment } from "../controllers/orders.controller";


const router = Router()

router.route('/create-order').post(verifyJWT,createOrder);
router.route('/verify-order').post(verifyPayment);

router.route('/get-user-orders').post(verifyJWT,getOrdersOfUser);

export default router; 
