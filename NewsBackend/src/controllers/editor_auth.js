import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js"

export const loginEditor = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: "Email and password required" })

    const user = await User.findOne({ email })
    const isEditor = user && typeof user.role === "string" && user.role.toLowerCase() === "editor"
    if (!isEditor) return res.status(401).json({ message: "Invalid credentials or not an Editor" })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: "Invalid credentials" })

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" })
    return res.json({ success: true, user: { id: user._id, username: user.username, role: user.role } })
  } catch (e) {
    return res.status(500).json({ message: "Server error" })
  }
}

// Change password for Editor
export const changeEditorPassword = async (req, res) => {
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

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "Editor not found" });
    }

    if (user.role.toLowerCase() !== "editor") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Current password is incorrect!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout Editor
export const logoutEditor = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
  res.status(200).json({
    success: true,
    message: "Editor Logged Out Successfully"
  });
};


