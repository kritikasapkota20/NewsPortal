import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const verifyToken = (req, res, next) => {
  console.log("Cookies received:", req.cookies);
  console.log("Authorization header:", req.headers.authorization);

  try {
    let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    console.log("Token found:", token);

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
