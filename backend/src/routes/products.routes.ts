import { Router } from "express";
import { addNewProduct, updateProduct } from "../controllers/products.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const router = Router()

router.route('/add-new-product').post(verifyJWT,upload.single('image'),addNewProduct)
router.route('/update-product').post(verifyJWT,updateProduct)

export default router;