import express from "express";
import passport from "passport";
import { registerEditor } from "../controllers/Editor.js";
// ,loginUser,logoutUser,verifyEmail, getMe
import { protectAdmin } from "../middlewares/admin_auth.js";
// import {protectAdmin} from "../middlewares/admin_auth.js";
const router=express.Router();
router.post("/register",registerEditor);
// router.post("/login",loginUser);
router.get("/verify/:token", verifyEmail);
// router.post("/logout",logoutUser);
// router.get("/me", getMe);


// Callback after Google login



export default router;
