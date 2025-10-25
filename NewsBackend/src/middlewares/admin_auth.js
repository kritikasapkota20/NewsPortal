import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

export const protectAdmin = async (req, res, next) => {
  try {
const token = req.cookies?.adminToken;
    // 🔒 Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Please login first." });
    }

    // 🧾 Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.adminId) {
      return res.status(401).json({ message: "Invalid token. Please login again." });
    }

    // 🔍 Find the admin
    const admin = await Admin.findById(decoded.adminId).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Admin not found. Please login again." });
    }

    // ✅ Attach admin to request
    req.admin = admin;
    next();

  } catch (error) {
    console.error("protectAdmin error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }
    return res.status(403).json({ message: "Forbidden access." });
  }
};
