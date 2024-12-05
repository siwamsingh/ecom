import { Router } from "express";
import { editUserConfig, getUser, getUsers, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/get-user").post(verifyJWT,getUser)
router.route("/get-users").post(verifyJWT,getUsers)
router.route("/edit-user").post(verifyJWT,editUserConfig)

export default router;