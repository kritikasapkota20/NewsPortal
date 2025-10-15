import express from "express";
import passport from "passport";
import { registerUser,loginUser,logoutUser,verifyEmail, getMe } from "../controllers/user_auth.js";
import { protectAdmin } from "../middlewares/admin_auth.js";
// import {protectAdmin} from "../middlewares/admin_auth.js";
const router=express.Router();
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/verify/:token", verifyEmail);
router.post("/logout",logoutUser);
router.get("/me", getMe);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback after Google login
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Set your httpOnly JWT cookie here
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/'); // redirect to your frontend
  }
);

export default router;
