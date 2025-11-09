import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
dotenv.config();
export const registerUser = async (req, res) => {
    const { username, email, password,confirmPassword } = req.body;
    try {
        // Validate required fields
        // Example: at least 8 chars, one uppercase, one lowercase, one number, one special char
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{8,}$/;

if (!strongPasswordRegex.test(password)) {
  return res.status(400).json({
    message:
      "Password must be at least 8 characters and include upper, lower, number, and special character.",
  });
}

           if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match!" });
}
        if (!username || !email || !password||!confirmPassword) {
            return res.status(400).json({ message: "All fields are required!" });
        }
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }
        const existingUser = await User.findOne({ email });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Prepare verification token without persisting new users yet
        let verifyTokenPayload;
        if (existingUser) {
            if (existingUser.isVerified) {
                return res.status(400).json({ message: "User already exists! Please login instead." });
            }
            // Existing but unverified: verify that account
            verifyTokenPayload = { type: "verify-existing", userId: existingUser._id.toString(), email };
        } else {
            // Brand-new: carry the data needed to create account after verification
            verifyTokenPayload = { type: "verify-new", username, email, password: hashedPassword };
        }

        const emailVerifyToken = jwt.sign(verifyTokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

           // === Send Email ===
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // Default to localhost:5173 (typical Vite frontend port) if FRONTEND_URL not set
    // IMPORTANT: Set FRONTEND_URL in your .env file to match your frontend URL (e.g., http://localhost:5173 or http://localhost:5174)
    const frontendBase = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
    const verifyUrl = `${frontendBase}/verify/${emailVerifyToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your NewsSite account",
      html: `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f8fb;padding:24px;color:#0f172a">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
          <tr>
            <td style="padding:24px 24px 0 24px;background:linear-gradient(135deg,#0066B3,#0ea5e9);color:#fff">
              <h1 style="margin:0;font-size:20px">News Site</h1>
              <p style="margin:8px 0 0 0;font-size:14px;opacity:.95">Email Verification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px">
              <p style="margin:0 0 12px 0;font-size:16px">Hi ${username},</p>
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#334155">
                Thanks for signing up. Please confirm your email address to activate your account.
              </p>
              <div style="text-align:center;margin:24px 0">
                <a href="${verifyUrl}" style="display:inline-block;background:#0066B3;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600">Verify Email</a>
              </div>
              <p style="margin:0 0 8px 0;font-size:12px;color:#64748b">This link will expire in 1 hour.</p>
              <p style="margin:0 0 8px 0;font-size:12px;color:#64748b">If the button doesn't work, copy and paste this URL into your browser:</p>
              <p style="word-break:break-all;font-size:12px;color:#0ea5e9"><a href="${verifyUrl}">${verifyUrl}</a></p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
              <p style="margin:0;font-size:12px;color:#94a3b8">If you didn't create this account, you can ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 24px;background:#f8fafc;color:#94a3b8;font-size:12px;text-align:center">
              © ${new Date().getFullYear()} NewsSite
            </td>
          </tr>
        </table>
      </div>
      `,
    });

    res.status(200).json({ message: "We sent a verification link to your email. Please verify to activate your account." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (payload.type === "verify-existing") {
      const user = await User.findById(payload.userId);
      if (!user) return res.status(400).json({ message: "Account not found" });
      // if (user.isVerified) return res.status(200).json({ message: "Email already verified", email: user.email });
      user.isVerified = true;
      // Clear any legacy verification fields if present
      user.verificationToken = undefined;
      user.verificationExpires = undefined;
      await user.save();
      return res.status(200).json({ message: "Email verified successfully", email: user.email });
    }

    if (payload.type === "verify-new") {
      const { username, email, password } = payload;
      // Guard against race or re-use
      const existing = await User.findOne({ email });
      if (existing) {
        if (!existing.isVerified) {
          existing.isVerified = true;
          // Do not overwrite password if exists; but if missing, keep existing
          if (!existing.password && password) existing.password = password;
          existing.verificationToken = undefined;
          existing.verificationExpires = undefined;
          await existing.save();
          return res.status(200).json({ message: "Email verified successfully", email: existing.email });
        }
        // return res.status(200).json({ message: "Email already verified", email: existing.email });
      }

      const newUser = new User({ username, email, password, isVerified: true });
      await newUser.save();
      return res.status(200).json({ message: "Email verified successfully", email: newUser.email });
    }

    return res.status(400).json({ message: "Invalid token type" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Optional helper to ensure required env vars exist at runtime.
const ensureJwtEnv = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    ensureJwtEnv();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Email or Password" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify your email before logging in." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid Email or Password" });

    const accessTokenExpires = process.env.JWT_EXPIRES || "15m";
    const refreshTokenExpires = process.env.JWT_REFRESH_EXPIRES || "7d";

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: accessTokenExpires });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: refreshTokenExpires });

    // ✅ Update lastLogin here
    user.lastLogin = new Date();

    // Save refresh token and lastLogin
    user.refreshToken = refreshToken;
    await user.save();

    const accessMaxAgeMs = 15 * 60 * 1000;
    const refreshMaxAgeMs = 7 * 24 * 60 * 60 * 1000;

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: accessMaxAgeMs,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: refreshMaxAgeMs,
    });

    res.status(200).json({ message: "User logged in successfully!" });

  } catch (error) {
    console.error("loginUser error:", error);
    if (error.message && error.message.includes("JWT_SECRET")) {
      return res.status(500).json({ message: "Server misconfiguration: token secret missing" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const logoutUser=(req,res)=>{
    res.clearCookie("token",{
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        // sameSite: "Strict",
    });
    res.status(200).json({
        success:true,
        message:"User Logged Out Successfully"
    });
}

export const getUser = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ authenticated: false });
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ authenticated: false });
    }
    const user = await User.findById(payload.userId).select("username email role isVerified");
    if (!user) return res.status(401).json({ authenticated: false });
    return res.status(200).json({ authenticated: true, user });
  } catch (e) {
    return res.status(500).json({ authenticated: false });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("username email role isVerified createdAt lastLogin");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // ✅ Only allow valid roles
    const validRoles = ["User", "Editor",];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Error updating user role" });
  }
};





// Search users by username or email
// const searchUsers = async (req, res) => {
//   try {
//     const { q } = req.query;
//     const limit = parseInt(req.query.limit) || 10;
    
//     if (!q || q.trim().length === 0) {
//       return res.status(200).json({
//         success: true,
//         results: [],
//         total: 0
//       });
//     }

//     const searchRegex = new RegExp(q.trim(), 'i');
    
//     const users = await User.find({
//       $or: [
//         { username: searchRegex },
//         { email: searchRegex }
//       ]
//     })
//     .sort({ createdAt: -1 })
//     .limit(limit)
//     .select('username email role createdAt lastLogin');

//     res.status(200).json({
//       success: true,
//       results: users,
//       total: users.length
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

export default { registerUser, loginUser,logoutUser,getUser,getAllUsers,deleteUser,updateUserRole,verifyEmail };

