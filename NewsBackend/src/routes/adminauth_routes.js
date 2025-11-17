import express from "express";
import { registerAdmin, loginAdmin, logoutAdmin, getAdminProfile, updateAdminProfile, changeAdminPassword } from "../controllers/admin_auth.js";
import { protectAdmin } from "../middlewares/admin_auth.js";
import Post from "../models/post.js";
import AuditLog from "../models/audit_log.js";
// import {protectAdmin} from "../middlewares/admin_auth.js";
const router=express.Router();
router.post("/register",registerAdmin);
router.post("/login",loginAdmin);
router.post("/logout",logoutAdmin);
router.get("/dashboard",protectAdmin,(req,res)=>{
    res.status(200).json({message:"Welcome to Admin dashboard!"});
});

// Admin post management routes
router.get("/posts/pending", protectAdmin, async (req, res) => {
  try {
    const posts = await Post.find({ status: 'pending_review' })
      .populate('category', 'name slug')
      .populate('assignedEditor', 'username email')
      .sort({ updatedAt: -1 });
    return res.json({ posts });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.patch("/posts/:id/approve", protectAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    post.status = 'published';
    await post.save();
    try { await AuditLog.create({ action: 'approve', post: post._id, user: req.user?._id, role: 'admin' }); } catch {}
    
    return res.json({ message: 'Post approved and published', post });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.patch("/posts/:id/reject", protectAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    post.status = 'rejected';
    await post.save();
    try { await AuditLog.create({ action: 'reject', post: post._id, user: req.user?._id, role: 'admin' }); } catch {}
    
    return res.json({ message: 'Post rejected', post });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Optional: Unpublish a published post
router.patch("/posts/:id/unpublish", protectAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.status = 'draft';
    await post.save();
    try { await AuditLog.create({ action: 'unpublish', post: post._id, user: req.user?._id, role: 'admin' }); } catch {}
    return res.json({ message: 'Post unpublished', post });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Profile routes
router.get("/profile", protectAdmin, getAdminProfile);
router.put("/profile", protectAdmin, updateAdminProfile);
router.patch("/change-password", protectAdmin, changeAdminPassword);

export default router;
