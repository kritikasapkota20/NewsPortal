import express from "express";
import { verifyToken } from "../middlewares/user_auth.js";
import {
  createComment,
  getCommentsByArticle,
  deleteComment,
} from "../controllers/comment.js";

const router = express.Router();

// Public route — view comments on post
router.get("/:postId", getCommentsByArticle);

// Protected route — add comment
router.post("/:postId", verifyToken, createComment);

// Protected route — delete comment
router.delete("/:id", verifyToken, deleteComment);

export default router;
