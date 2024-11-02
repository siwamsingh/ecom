import { Router } from "express";
import { gernerateRegisterOtp , verifyRegisterOtp} from "../controllers/otp.controller";

const router = Router()

router.route('/generate-register-otp').post(gernerateRegisterOtp)
router.route('/verify-register-otp').post(verifyRegisterOtp)

export default router;