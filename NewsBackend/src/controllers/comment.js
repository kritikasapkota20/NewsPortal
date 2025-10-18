import Comment from "../models/comment.js";

// ✅ Create new comment
const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // ✅ Fix 1: use `req.user.userId` (correct field from JWT)
    const newComment = await Comment.create({
      articleId: postId,
      userId: req.user.userId,
      text,
    });

    // ✅ Fix 2: populate `username` (not name)
    const populatedComment = await newComment.populate("userId", "username");

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all comments for an article
const getCommentsByArticle = async (req, res) => {
  try {
    const { postId } = req.params;

    // ✅ Fix 3: also populate `username` (not name)
    const comments = await Comment.find({ articleId: postId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // ✅ Fix 4: use `req.user.userId` for consistency
    if (
      comment.userId.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: error.message });
  }
};

export { createComment, getCommentsByArticle, deleteComment };
