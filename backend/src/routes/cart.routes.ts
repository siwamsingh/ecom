import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addToCart, deleteFromCart, getCart, updateCart } from "../controllers/cart.controllers";


const router = Router()

router.route('/add-to-cart').post(verifyJWT,addToCart);
router.route('/update-cart').post(verifyJWT,updateCart);
router.route('/delete-from-cart').post(verifyJWT,deleteFromCart);
router.route('/get-cart').post(verifyJWT,getCart); 

export default router;