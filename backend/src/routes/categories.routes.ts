import { Router } from "express";
import { addNewCategory } from "../controllers/categories.controller";
import { verifyJWT } from "../middlewares/auth.middleware";


const router = Router()

router.route('/add-new-category').post(verifyJWT,addNewCategory)

export default router;