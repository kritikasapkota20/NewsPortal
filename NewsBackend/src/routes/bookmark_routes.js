import express from "express";
import { verifyToken } from "../middlewares/user_auth.js";
import {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
  checkBookmark,
} from "../controllers/bookmark.js";

const router = express.Router();

// All routes require authentication
router.post("/:postId", verifyToken, addBookmark);
router.delete("/:postId", verifyToken, removeBookmark);
router.get("/", verifyToken, getUserBookmarks);
router.get("/check/:postId", verifyToken, checkBookmark);

export default router;

