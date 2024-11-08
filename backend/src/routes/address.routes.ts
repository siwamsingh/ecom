import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addNewAddress, changeDefaultAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/address.controller";


const router = Router()

router.route('/add-new-address').post(verifyJWT,addNewAddress);
router.route('/update-address').post(verifyJWT,updateAddress);
router.route('/delete-address').post(verifyJWT,deleteAddress);
router.route('/change-default-address').post(verifyJWT,changeDefaultAddress); 
router.route('/get-address').post(verifyJWT,getAddresses); 

export default router;