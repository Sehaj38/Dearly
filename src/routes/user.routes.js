import { Router } from "express";
import { 
    registerUser,
    logginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword
 } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()


router.route("/register").post(registerUser);
router.route("/login").post(logginUser);
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-Password").post(verifyJWT, changeCurrentPassword)

export default router