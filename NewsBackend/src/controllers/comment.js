import Comment from "../models/comment.js";

// ✅ Create new comment
const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const newComment = await Comment.create({
      articleId: postId, // still store under `articleId` in DB if that's your schema
      userId: req.user.id, // from JWT
      text,
    });

    res.status(201).json(
      await newComment.populate("userId", "name") // return with user name for frontend display
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all comments for an article
const getCommentsByArticle = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ articleId: postId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      comment.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createComment, getCommentsByArticle, deleteComment };
