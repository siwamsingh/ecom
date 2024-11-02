import { Router } from "express";
import { addNewCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/categories.controller";
import { verifyJWT } from "../middlewares/auth.middleware";


const router = Router()

router.route('/add-new-category').post(verifyJWT,addNewCategory);
router.route('/get-categories').post(verifyJWT,getAllCategories); 
router.route('/update-categories').post(verifyJWT,updateCategory);
router.route('/delete-category').post(verifyJWT,deleteCategory);

export default router;