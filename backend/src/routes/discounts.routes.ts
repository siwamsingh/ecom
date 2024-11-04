import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addNewDiscount, deleteDiscount, getDiscount, getDiscounts, updateDiscount } from "../controllers/discounts.controller";


const router = Router()

router.route('/add-new-discount').post(verifyJWT,addNewDiscount);
router.route('/update-discount').post(verifyJWT,updateDiscount);
router.route('/delete-discount').post(verifyJWT,deleteDiscount);
router.route('/get-discount').post(getDiscount); 
router.route('/get-discounts').post(getDiscounts); 

export default router; 
