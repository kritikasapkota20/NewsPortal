import Bookmark from "../models/bookmark.js";
import Post from "../models/post.js";

// Add bookmark
export const addBookmark = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingBookmark = await Bookmark.findOne({ userId, postId });
    if (existingBookmark) {
      return res.status(400).json({ message: "Post already bookmarked" });
    }

    const bookmark = await Bookmark.create({ userId, postId });
    res.status(201).json({ message: "Post bookmarked successfully", bookmark });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json({ message: error.message });
  }
};

// Remove bookmark
export const removeBookmark = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const bookmark = await Bookmark.findOneAndDelete({ userId, postId });
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's bookmarks
export const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookmarks = await Bookmark.find({ userId })
      .populate({
        path: 'postId',
        populate: [
          { path: 'category', select: 'name slug' },
          { path: 'assignedEditor', select: 'username' }
        ]
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: error.message });
  }
};

// Check if post is bookmarked
export const checkBookmark = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const bookmark = await Bookmark.findOne({ userId, postId });
    res.status(200).json({ isBookmarked: !!bookmark });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    res.status(500).json({ message: error.message });
  }
};

