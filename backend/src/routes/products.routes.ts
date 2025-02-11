import { Router } from "express";
import { addNewProduct, getProducts, masterSwitch, updateProduct } from "../controllers/products.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const router = Router()

router.route('/add-new-product').post(verifyJWT,upload.single('product_image'),addNewProduct)
router.route('/update-product').post(verifyJWT,upload.single('product_image'),updateProduct)
router.route('/get-product').post(getProducts);
router.route('/master-switch').post(verifyJWT,masterSwitch);

export default router;