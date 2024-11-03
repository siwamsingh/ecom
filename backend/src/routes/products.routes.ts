import { Router } from "express";
import { addNewProduct, getProducts, updateProduct } from "../controllers/products.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const router = Router()

router.route('/add-new-product').post(verifyJWT,upload.single('image'),addNewProduct)
router.route('/update-product').post(verifyJWT,upload.single('image'),updateProduct)
router.route('/get-product').post(getProducts);

export default router;