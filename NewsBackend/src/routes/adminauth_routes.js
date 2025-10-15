import express from "express";
import { registerAdmin, loginAdmin, logoutAdmin, getAdminProfile, updateAdminProfile } from "../controllers/admin_auth.js";
import { protectAdmin } from "../middlewares/admin_auth.js";
// import {protectAdmin} from "../middlewares/admin_auth.js";
const router=express.Router();
router.post("/register",registerAdmin);
router.post("/login",loginAdmin);
router.post("/logout",logoutAdmin);
router.get("/dashboard",protectAdmin,(req,res)=>{
    res.status(200).json({message:"Welcome to Admin dashboard!"});
});

// Profile routes
// router.get("/profile", protectAdmin, getAdminProfile);
// router.put("/profile", protectAdmin, updateAdminProfile);

export default router;
