import { Router } from "express";
import { gernerateRegisterOtp , verifyRegisterOtp} from "../controllers/otp.controller";

const router = Router()

router.route('/generate_register_otp').post(gernerateRegisterOtp)
router.route('/verify_register_otp').post(verifyRegisterOtp)

export default router;