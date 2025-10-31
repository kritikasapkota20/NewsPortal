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


