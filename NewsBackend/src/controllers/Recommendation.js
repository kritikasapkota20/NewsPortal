// controllers/recommendationController.js
import Post from "../models/post.js";

export const getCategoryBasedRecommendations = async (req, res) => {
  try {
    const { viewedCategories } = req.body;

    if (!viewedCategories || typeof viewedCategories !== "object") {
      return res.status(400).json({ message: "Invalid viewed category data" });
    }

    const sortedCategories = Object.entries(viewedCategories)
      .sort((a, b) => b[1] - a[1])
      .map(([categoryId]) => categoryId);

    let recommendedPosts = [];

    for (const categoryId of sortedCategories) {
      const posts = await Post.find({ category: mongoose.Types.ObjectId(categoryId) }).limit(5);
      recommendedPosts.push(...posts);
      if (recommendedPosts.length >= 10) break;
    }

    res.status(200).json({ recommendations: recommendedPosts.slice(0, 10) });
  } catch (error) {
    console.error("Recommendation error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
