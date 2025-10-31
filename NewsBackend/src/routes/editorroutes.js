import express from "express";
import { loginEditor } from "../controllers/editor_auth.js";
import { verifyToken } from "../middlewares/user_auth.js";
import { getPosts, editPost, deletePost, createPost } from "../controllers/post.js";
import upload from "../helper/filehelper.js";
import User from "../models/user.js";
import Post from "../models/post.js";
import AuditLog from "../models/audit_log.js";
import mongoose from "mongoose";

const router = express.Router();

// Editor login
router.post("/login", loginEditor);

// Current user info (role check convenience)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email role")
    if (!user) return res.status(404).json({ message: "User not found" })
    return res.json({ id: user._id, role: user.role, username: user.username, email: user.email })
  } catch (e) {
    return res.status(500).json({ message: "Server error" })
  }
});

// Editor posts APIs (ownership enforced inside controllers)
router.get("/posts", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ assignedEditor: req.user.userId })
      .populate('category', 'name slug')
      .sort({ updatedAt: -1 })
    return res.json({ posts })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
});

// Get a single assigned post by id
router.get("/posts/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('category', 'name slug')
    if (!post) return res.status(404).json({ message: 'Not found' })
    if (String(post.assignedEditor) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    return res.json({ post })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
});

// Create a post as editor (auto-assigns to current editor)
router.post("/posts", verifyToken, upload.single("file"), createPost);

// Note: Place specific routes (submit/draft) BEFORE the generic :category/:id route

// Submit post for review
router.patch("/posts/:id/submit", verifyToken, async (req, res) => {
  try {
    if (!req?.user?.userId) {
      return res.status(401).json({ message: 'Unauthenticated' })
    }
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    if (String(post.assignedEditor) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (post.status === 'published') {
      return res.status(403).json({ message: 'Already published' });
    }
    if (post.status === 'pending_review') {
      return res.json({ success: true, message: 'Already pending review', post });
    }
    
    post.status = 'pending_review';
    await post.save();
    try { await AuditLog.create({ action: 'submit', post: post._id, user: req.user?.userId, role: 'editor' }); } catch {}
    return res.json({ success: true, message: 'Post submitted for review', post });
  } catch (e) {
    console.error('submit error', e)
    return res.status(500).json({ message: e?.message || 'Server error' });
  }
});

// Save as draft (owner only, not for published)
router.patch("/posts/:id/draft", verifyToken, async (req, res) => {
  try {
    if (!req?.user?.userId) {
      return res.status(401).json({ message: 'Unauthenticated' })
    }
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (String(post.assignedEditor) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (post.status === 'published') {
      return res.status(403).json({ message: 'Cannot change published post to draft' });
    }
    post.status = 'draft';
    await post.save();
    try { await AuditLog.create({ action: 'update', post: post._id, user: req.user?.userId, role: 'editor', details: { status: 'draft' } }); } catch {}
    return res.json({ success: true, message: 'Saved as draft', post });
  } catch (e) {
    console.error('draft error', e)
    return res.status(500).json({ message: e?.message || 'Server error' });
  }
});

// Update an assigned post (generic)
router.patch("/posts/:category/:id", verifyToken, upload.single("file"), editPost);

// Delete an assigned post
router.delete("/posts/:category/:id", verifyToken, deletePost);

export default router;
