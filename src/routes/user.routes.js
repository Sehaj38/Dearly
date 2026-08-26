import { Router } from "express";
import { 
    registerUser,
    logginUser
 } from "../controllers/user.controllers.js";
const router = Router()


router.route("/register").post(registerUser);
router.route("/login").post(logginUser);

export default router