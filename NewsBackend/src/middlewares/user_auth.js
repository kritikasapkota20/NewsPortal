import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded data (user info) to req for later use
    req.user = decoded;

    next(); // move to the actual controller
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
