import Comment from "../models/comment.js";

// Create new comment or reply
const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, parentCommentId } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // If parentCommentId is provided, it's a reply
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
      
      // Users cannot reply to their own comments
      if (parentComment.userId.toString() === req.user.userId) {
        return res.status(400).json({ message: "You cannot reply to your own comment" });
      }
    }

    const newComment = await Comment.create({
      articleId: postId,
      userId: req.user.userId,
      text,
      parentCommentId: parentCommentId || null,
    });

    const populatedComment = await Comment.findById(newComment._id)
      .populate("userId", "username")
      .populate("parentCommentId", "userId text");

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all comments for an article (with nested replies)
const getCommentsByArticle = async (req, res) => {
  try {
    const { postId } = req.params;

    // Get all top-level comments (no parent)
    const topLevelComments = await Comment.find({ 
      articleId: postId,
      parentCommentId: null 
    })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    // Get all replies
    const replies = await Comment.find({ 
      articleId: postId,
      parentCommentId: { $ne: null }
    })
      .populate("userId", "username")
      .populate("parentCommentId", "userId text")
      .sort({ createdAt: 1 });

    // Attach replies to their parent comments
    const commentsWithReplies = topLevelComments.map(comment => {
      const commentObj = comment.toObject();
      commentObj.replies = replies.filter(
        reply => reply.parentCommentId._id.toString() === comment._id.toString()
      );
      return commentObj;
    });

    res.status(200).json(commentsWithReplies);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: error.message });
  }
};

// Edit comment (only own comments)
const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only the comment owner can edit
    if (comment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.text = text;
    comment.isEdited = true;
    await comment.save();

    const populatedComment = await Comment.findById(id)
      .populate("userId", "username")
      .populate("parentCommentId", "userId text");

    res.status(200).json({ message: "Comment updated successfully", comment: populatedComment });
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete comment (only own comments or admin)
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only comment owner or admin can delete
    if (
      comment.userId.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // If it's a top-level comment, also delete all its replies
    if (!comment.parentCommentId) {
      await Comment.deleteMany({ parentCommentId: comment._id });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: error.message });
  }
};

export { createComment, getCommentsByArticle, editComment, deleteComment };
