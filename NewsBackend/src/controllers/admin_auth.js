import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
dotenv.config();
export const registerAdmin = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    
    try {
        // Validate required fields first
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ 
                message: "All fields are required!" 
            });
        }

        // Check if an admin already exists (only one admin allowed)
        const existingAdmin = await Admin.findOne({ isVerified: true });
        if (existingAdmin) {
            return res.status(400).json({ 
                message: "An admin account already exists. Only one admin is allowed." 
            });
        }

        // Check if user already exists (most efficient - database call first)
        const existingUser = await Admin.findOne({ email });
        
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ 
                message: "User already exists and is verified!" 
            });
        }

        // Password validation (only if user doesn't exist or is unverified)
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{8,}$/;
        
        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ 
                message: "Passwords do not match!" 
            });
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Please enter a valid email address." 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Prepare verification token
        let verifyTokenPayload;
        if (existingUser && !existingUser.isVerified) {
            // Existing but unverified: verify that account
            verifyTokenPayload = { 
                type: "verify-existing", 
                userId: existingUser._id.toString(), 
                email 
            };
        } else {
            // Brand-new: carry the data needed to create account after verification
            verifyTokenPayload = { 
                type: "verify-new", 
                username, 
                email, 
                password: hashedPassword,
                role: "admin" // Explicitly set admin role
            };
        }

        const emailVerifyToken = jwt.sign(
            verifyTokenPayload, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES || "1h" }
        );

        // Send Email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { 
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS 
            },
        });

        const frontendBase = (process.env.ADMIN_URL ||'http://localhost:5173').replace(/\/+$/, '');
        const verifyUrl = `${frontendBase}/verify/${emailVerifyToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your NewsSite Admin Account",
            html: `
            <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f8fb;padding:24px;color:#0f172a">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
                    <tr>
                        <td style="padding:24px 24px 0 24px;background:linear-gradient(135deg,#0066B3,#0ea5e9);color:#fff">
                            <h1 style="margin:0;font-size:20px">NewsSite Admin</h1>
                            <p style="margin:8px 0 0 0;font-size:14px;opacity:.95">Admin Account Verification</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px">
                            <p style="margin:0 0 12px 0;font-size:16px">Hi ${username || 'Admin'},</p>
                            <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#334155">
                                Thanks for signing up as an administrator. Please confirm your email address to activate your admin account.
                            </p>
                            <div style="text-align:center;margin:24px 0">
                                <a href="${verifyUrl}" style="display:inline-block;background:#0066B3;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600">Verify Admin Account</a>
                            </div>
                            <p style="margin:0 0 8px 0;font-size:12px;color:#64748b">This link will expire in 1 hour.</p>
                            <p style="margin:0 0 8px 0;font-size:12px;color:#64748b">If the button doesn't work, copy and paste this URL into your browser:</p>
                            <p style="word-break:break-all;font-size:12px;color:#0ea5e9"><a href="${verifyUrl}">${verifyUrl}</a></p>
                            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
                            <p style="margin:0;font-size:12px;color:#94a3b8">If you didn't create this admin account, you can safely ignore this email.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:12px 24px;background:#f8fafc;color:#94a3b8;font-size:12px;text-align:center">
                            © ${new Date().getFullYear()} NewsSite - Admin Portal
                        </td>
                    </tr>
                </table>
            </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            message: "We sent a verification link to your email. Please verify to activate your admin account." 
        });

    } catch (err) {
        console.error('Admin registration error:', err);
        
        // Don't expose sensitive error details
        if (err.code === 'EAUTH') {
            return res.status(500).json({ 
                message: "Email service temporarily unavailable. Please try again later." 
            });
        }
        
        res.status(500).json({ 
            message: "Internal Server Error" 
        });
    }
};

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin)
            return res.status(400).json({ message: "Invalid Email or Password" });
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword)
            return res.status(400).json({ message: "Invalid Email or Password" })
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        res.status(200).json({ message: "Admin logged in successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
};

export const logoutAdmin = (req, res) => {
    res.clearCookie("adminToken", {
        httpOnly: true,secure: false, sameSite: "lax"
    });
    res.status(200).json({
        success: true,
        message: "Admin Logged Out Successfully"
    });
};

// Get admin profile
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select("-password");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json({ admin });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
    const { username, email } = req.body;
    try {
        // Validate required fields
        if (!username || !email) {
            return res.status(400).json({ message: "Username and email are required!" });
        }
        // Check if email is already taken by another admin
        const existingAdmin = await Admin.findOne({ email, _id: { $ne: req.admin._id } });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email is already taken!" });
        }

        // Update admin profile
        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.admin._id,
            { username, email },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully!",
            admin: updatedAdmin
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
};

// Change password
export const changeAdminPassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    try {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New passwords do not match!" });
        }

        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{8,}$/;
        if (!strongPasswordRegex.test(newPassword)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
            });
        }

        const admin = await Admin.findById(req.admin._id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const validPassword = await bcrypt.compare(currentPassword, admin.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Current password is incorrect!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({ message: "Password changed successfully!" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default { registerAdmin, loginAdmin, logoutAdmin, getAdminProfile, updateAdminProfile, changeAdminPassword };

