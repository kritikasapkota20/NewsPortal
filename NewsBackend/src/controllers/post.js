import Post from "../models/post.js";
import slugify from "slugify"; 
import Category from "../models/categorymodel.js"; 
import mongoose from "mongoose";


const createPost = async (req, res) => {
  try {
    const { title, category, subCategory, content, isHeadNews,isMainNews } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    if (!title || !category || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check category existence and validate subCategory
    const categoryData = await Category.findById(category);
    if (!categoryData) {
      return res.status(400).json({ message: "Invalid category" });
    }
    if (subCategory && !categoryData.subCategories.includes(subCategory)) {
      return res.status(400).json({ message: "Invalid subCategory for this category" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ message: "Post with this title already exists" });
    }

    const newPost = new Post({
      title,
      slug,
      category,
      subCategory,
      content,
      image,
      isHeadNews: req.body.isHeadNews === "true" || req.body.isHeadNews === true,
      isMainNews: req.body.isMainNews === "true" || req.body.isMainNews === true,

    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// const getPosts=async(req,res)=>{
//     try{
//         const posts = [];
        
//         const categories = ['News', 'Economy', 'Bichar', 'Health', 'Entertainment', 'Education', 'Sports', 'Feature'];
        
//         // Fetch posts from all categories
//         for(const category of categories){
//           // const Post=getPostModel(category);
//             const categoryPosts=await Post.find().sort({createdAt:-1}).select('title category content image createdAt');
//             posts.push(...categoryPosts);
//         }
//         posts.sort((a,b)=>b.createdAt-a.createdAt);
//         res.status(200).json({
//             success:true,
//             count:posts.length,
//             posts
//         });
//     }catch(error){
//         res.status(500).json({
//             success:false,
//             message:"Internal server error",
//             error:error.message
//         })
//     }
// }
const getHeadNews = async (req, res) => {
  try {
   const headingPosts = await Post.find({ isHeadNews: true })
      .populate('category', 'name slug') // Populate category details
      .sort({ createdAt: -1 }) // Sort latest first
      .limit(2) // Limit number of posts
      .select('title slug category subCategory isHeading content image createdAt');

    res.status(200).json({
      success: true,
      posts: headingPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching heading news",
      error: error.message,
    });
  }
};
const getMainNews = async (req, res) => {
  try {
   const MainPosts = await Post.find({ isMainNews: true })
      .populate('category', 'name slug') // Populate category details
      .sort({ createdAt: -1 }) // Sort latest first
      .limit(5) // Limit number of posts
      .select('title slug category subCategory isHeading content image createdAt');

    res.status(200).json({
      success: true,
      posts: MainPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching heading news",
      error: error.message,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('category', 'name slug') // get category details
      .sort({ createdAt: 1 })
      .select('title slug subCategory category isHeadNews isMainNews content image createdAt');

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Paginated posts for frontend (optional categorySlug)
const getPostsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const categorySlug = req.query.categorySlug;

    const filter = {};
    if (categorySlug) {
      // Find category by slug
      const category = await Category.findOne({ slug: categorySlug }).select('_id');
      if (category) {
        filter.category = category._id;
      } else {
        return res.status(200).json({ success: true, total: 0, totalPages: 0, page, limit, posts: [] });
      }
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('title slug subCategory category isHeadNews isMainNews content image createdAt');

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const deletePost = async (req, res) => {
    try {
        const { id, category } = req.params;
        console.log("Deleting post:", id, category); // Debugging log
        if (!id || !category) {
            return res.status(400).json({ message: "Post ID and category are required" });
        }
        // const Post = getPostModel(category);
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
const editPost = async (req, res) => {
  try {
    const { id, category } = req.params;
    const { title, content, subCategory, isHeadNews, isMainNews } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!id || !category) {
      return res.status(400).json({ message: "Post ID and category are required" });
    }

    // Fetch the existing post
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Fetch the category to validate subCategory if provided
    const categoryData = await Category.findById(category);
    if (!categoryData) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Validate subCategory if provided
    if (subCategory && !categoryData.subCategories.includes(subCategory)) {
      return res.status(400).json({ message: "Invalid subCategory for this category" });
    }

    // Update fields if they exist
    if (title) {
      existingPost.title = title;
      existingPost.slug = slugify(title, { lower: true, strict: true });
    }

    if (content) existingPost.content = content;
    if (subCategory !== undefined) existingPost.subCategory = subCategory;
    if (image) existingPost.image = image;
    
    // Handle boolean fields - they can be false, so we need to check if they exist in req.body
    if (isHeadNews !== undefined) existingPost.isHeadNews = isHeadNews === 'true' || isHeadNews === true;
    if (isMainNews !== undefined) existingPost.isMainNews = isMainNews === 'true' || isMainNews === true;

    const updatedPost = await existingPost.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });

    console.log("Updated post:", updatedPost); // Debugging log
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Post ID is required" 
      });
    }

    const post = await Post.findById(id)
      .populate('category', 'name slug');

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "Post not found" 
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getPostsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const category = await Category.findOne({ slug: categorySlug }).select('_id name slug');
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const filter = { category: category._id };
    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('title slug subCategory category isHeadNews isMainNews content image createdAt description');

    res.status(200).json({
      success: true,
      category,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Grouped posts for admin: 5 per category by default, with totals
const getGroupedPostsForAdmin = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const categories = await Category.find({}).select('name slug');
    const results = [];

    // Fetch posts per category
    for (const category of categories) {
      const filter = { category: category._id };
      const total = await Post.countDocuments(filter);
      const posts = await Post.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title slug subCategory category isHeadNews isMainNews content image createdAt');

      results.push({
        category,
        total,
        limit,
        page: 1,
        posts,
      });
    }

    res.status(200).json({ success: true, groups: results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Increment post view count
const incrementPostView = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Post ID is required" 
      });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('category', 'name slug');

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "Post not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "View count updated",
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get recommended posts based on most viewed categories
const getRecommendedPosts = async (req, res) => {
  try {
    // Get the most viewed categories in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Aggregate to find categories with highest total view counts
    const categoryViewStats = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: '$category',
          totalViews: { $sum: '$viewCount' },
          postCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalViews: -1 }
      },
      {
        $limit: 3 // Get top 3 most viewed categories
      }
    ]);

    // Get posts from the most viewed categories
    const recommendedPosts = [];
    for (const categoryStat of categoryViewStats) {
      const categoryPosts = await Post.find({ 
        category: categoryStat._id,
        createdAt: { $gte: sevenDaysAgo }
      })
      .populate('category', 'name slug')
      .sort({ viewCount: -1, createdAt: -1 })
      .limit(3) // Get top 3 posts from each category
      .select('title slug category content image createdAt viewCount');

      recommendedPosts.push(...categoryPosts);
    }

    // Sort by view count and then by creation date
    recommendedPosts.sort((a, b) => {
      if (b.viewCount !== a.viewCount) {
        return b.viewCount - a.viewCount;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Limit to top 6 posts
    const finalRecommendedPosts = recommendedPosts.slice(0, 6);

    res.status(200).json({
      success: true,
      count: finalRecommendedPosts.length,
      posts: finalRecommendedPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get personalized recommendations based on user's viewed categories
const getPersonalizedRecommendations = async (req, res) => {
  try {
    const { viewedCategories } = req.body;
    
    if (!viewedCategories || typeof viewedCategories !== 'object') {
      return res.status(400).json({
        success: false,
        message: "viewedCategories object is required"
      });
    }

    // Sort categories by view count (highest first)
    const sortedCategories = Object.entries(viewedCategories)
      .sort(([, a], [, b]) => b - a) // Sort by view count descending
      .map(([categoryId]) => categoryId);

    const recommendedPosts = [];
    const usedPostIds = new Set(); // To avoid duplicates

    // Get posts from each category, prioritizing most viewed categories
   for (const categoryId of sortedCategories) {
  if (recommendedPosts.length >= 10) break; // Limit to 10 posts total

  try {
    const validCategoryId = categoryId?._id || categoryId;

    if (!mongoose.Types.ObjectId.isValid(validCategoryId)) {
      console.warn("Skipping invalid category ID:", categoryId);
      continue;
    }

    const categoryPosts = await Post.find({ 
      category: validCategoryId,
      _id: { $nin: Array.from(usedPostIds) }
    })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(10 - recommendedPosts.length)
    .select('title slug category content image createdAt viewCount');

    for (const post of categoryPosts) {
      if (recommendedPosts.length >= 10) break;
      recommendedPosts.push(post);
      usedPostIds.add(post._id.toString());
    }
  } catch (error) {
    console.error(`Error fetching posts for category ${JSON.stringify(categoryId)}:`, error);
  }
}


    // If we don't have enough posts from viewed categories, fill with recent posts
    if (recommendedPosts.length < 10) {
      const remainingPosts = await Post.find({
        _id: { $nin: Array.from(usedPostIds) }
      })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(10 - recommendedPosts.length)
      .select('title slug category content image createdAt viewCount');

      recommendedPosts.push(...remainingPosts);
    }

    res.status(200).json({
      success: true,
      count: recommendedPosts.length,
      posts: recommendedPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Search posts by title, content, or category
const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!q || q.trim().length === 0) {
      return res.status(200).json({
        success: true,
        results: [],
        total: 0
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    
    const posts = await Post.find({
      $or: [
        { title: searchRegex },
        { content: { $regex: searchRegex } },
        { subCategory: searchRegex }
      ]
    })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('title slug content image createdAt category subCategory');

    res.status(200).json({
      success: true,
      results: posts,
      total: posts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export {createPost,getPosts,deletePost,editPost, 
  getHeadNews,getMainNews,getPostsByCategory,getPost,
  incrementPostView, getRecommendedPosts, getPersonalizedRecommendations,
  getPostsPaginated, getGroupedPostsForAdmin, searchPosts
};
