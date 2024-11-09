import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createOrder, verifyPayment } from "../controllers/orders.controller";


const router = Router()

router.route('/create-order').post(verifyJWT,createOrder);
router.route('/verify-order').post(verifyPayment);

export default router; 
