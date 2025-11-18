import Post from "../models/post.js";
import AuditLog from "../models/audit_log.js";
import slugify from "slugify"; 
import Category from "../models/categorymodel.js"; 
import mongoose from "mongoose";


const normalizeSubCategorySlug = (value) => {
  if (!value) return null;
  return slugify(value, { lower: true, strict: true });
};

const createPost = async (req, res) => {
  try {
    const { title, category, subCategory, content, isHeadNews,isMainNews, status, tags } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    if (!title || !category || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Parse tags if provided as string (comma-separated) or array
    let tagsArray = [];
    if (tags) {
      if (typeof tags === 'string') {
        tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      } else if (Array.isArray(tags)) {
        tagsArray = tags.map(tag => typeof tag === 'string' ? tag.trim() : String(tag).trim()).filter(tag => tag.length > 0);
      }
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
      subCategorySlug: normalizeSubCategorySlug(subCategory),
      content,
      image,
      tags: tagsArray,
      isHeadNews: req.body.isHeadNews === "true" || req.body.isHeadNews === true,
      isMainNews: req.body.isMainNews === "true" || req.body.isMainNews === true,
      assignedEditor: req.user?.userId || null,
      status: typeof status === 'string' ? status : 'draft',
    });

    await newPost.save();
    // Audit log
    try { await AuditLog.create({ action: 'create', post: newPost._id, user: req.user?.userId, role: req.user?.role, details: { title } }); } catch {}
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
   const headingPosts = await Post.find({ isHeadNews: true, status: 'published' })
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
   const MainPosts = await Post.find({ isMainNews: true, status: 'published' })
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
    const posts = await Post.find({ status: 'published' })
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
      .select('title slug subCategory category isHeadNews isMainNews content image createdAt status');

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
        // Only owner (assignedEditor) or admin can delete; if req.user exists and role editor, enforce
        const post = await Post.findById(id)
        if (!post) return res.status(404).json({ message: "Post not found" })

        if (req.user?.role && String(req.user.role).toLowerCase() === 'editor') {
          if (!post.assignedEditor || String(post.assignedEditor) !== String(req.user.userId)) {
            return res.status(403).json({ message: "Not allowed" })
          }
          if (post.status === 'published') {
            return res.status(403).json({ message: "Editors cannot delete published posts" })
          }
        }

        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Audit log
        try { await AuditLog.create({ action: 'delete', post: id, user: req.user?.userId, role: req.user?.role }); } catch {}
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

    // Ownership and published enforcement for editor
    if (req.user?.role && String(req.user.role).toLowerCase() === 'editor') {
      if (!existingPost.assignedEditor || String(existingPost.assignedEditor) !== String(req.user.userId)) {
        return res.status(403).json({ message: "Not allowed" })
      }
      if (existingPost.status === 'published') {
        return res.status(403).json({ message: "Editors cannot edit published posts" })
      }
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
    // Allow changing category
    existingPost.category = categoryData._id;
    if (subCategory !== undefined) {
      existingPost.subCategory = subCategory;
      existingPost.subCategorySlug = normalizeSubCategorySlug(subCategory);
    } else if (existingPost.subCategory && !existingPost.subCategorySlug) {
      existingPost.subCategorySlug = normalizeSubCategorySlug(existingPost.subCategory);
    }
    if (image) existingPost.image = image;
    
    // Handle boolean fields - they can be false, so we need to check if they exist in req.body
    if (isHeadNews !== undefined) existingPost.isHeadNews = isHeadNews === 'true' || isHeadNews === true;
    if (isMainNews !== undefined) existingPost.isMainNews = isMainNews === 'true' || isMainNews === true;

    const updatedPost = await existingPost.save();
    // Audit log
    try { await AuditLog.create({ action: 'update', post: updatedPost._id, user: req.user?.userId, role: req.user?.role, details: { title: updatedPost.title } }); } catch {}

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
      .populate('category', 'name slug')
      .populate('assignedEditor', 'username');

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

    const filter = { category: category._id, status: { $in: ['pending_review', 'published'] } };
    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('title slug subCategory category isHeadNews isMainNews content image createdAt description status');

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

const buildSubCategoryRegex = (slug) => {
  if (!slug) return null;
  const decoded = slug.replace(/-/g, ' ').trim();
  if (!decoded) return null;
  const escaped = decoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = escaped.replace(/\\\s+/g, '[\\s\\-/]+');
  return new RegExp(`^${pattern}$`, 'i');
};

const getPostsBySubCategory = async (req, res) => {
  try {
    const { categorySlug, subSlug } = req.params;
    if (!categorySlug || !subSlug) {
      return res.status(400).json({ success: false, message: 'Category and subcategory are required' });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const category = await Category.findOne({ slug: categorySlug }).select('_id name slug');
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const filter = {
      category: category._id,
      status: { $in: ['pending_review', 'published'] },
    };

    const conditions = [{ subCategorySlug: subSlug }];
    const subRegex = buildSubCategoryRegex(subSlug);
    if (subRegex) {
      conditions.push({ subCategory: { $regex: subRegex } });
    }
    filter.$or = conditions;

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('title slug subCategory subCategorySlug category content image createdAt status');

    const subCategoryName = posts[0]?.subCategory || subSlug.replace(/-/g, ' ');

    res.status(200).json({
      success: true,
      category,
      subCategorySlug: subSlug,
      subCategoryName,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
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

    // Fetch posts per category (only pending or published)
    for (const category of categories) {
      const filter = { category: category._id, status: { $in: ['pending_review', 'published'] } };
      const total = await Post.countDocuments(filter);
      const posts = await Post.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title slug subCategory category isHeadNews isMainNews content image createdAt status');

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

// Search posts by title, content, category, or date
const searchPosts = async (req, res) => {
  try {
    const { q, date } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    
    const query = { status: { $in: ['pending_review', 'published'] } };

    // Date filter
    if (date) {
      const searchDate = new Date(date);
      if (!isNaN(searchDate.getTime())) {
        const startOfDay = new Date(searchDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(searchDate);
        endOfDay.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: startOfDay, $lte: endOfDay };
      }
    }

    // Text search
    if (q && q.trim().length > 0) {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { content: { $regex: searchRegex } },
        { subCategory: searchRegex }
      ];
    }
    
    const posts = await Post.find(query)
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

// Get most read posts per category (highest views)
const getMostReadPosts = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const limit = parseInt(req.query.limit) || 5;

    let query = { status: 'published' };

    // If category is provided, filter by category
    if (categorySlug && categorySlug !== 'all') {
      const category = await Category.findOne({ slug: categorySlug }).select('_id');
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      query.category = category._id;
    }

    const posts = await Post.find(query)
      .populate('category', 'name slug')
      .populate('assignedEditor', 'username')
      .sort({ viewCount: -1, createdAt: -1 })
      .limit(limit)
      .select('title slug content image createdAt category subCategory viewCount assignedEditor');

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Content-based recommendation system
// Get recommended articles based on same category or overlapping tags
const getContentBasedRecommendations = async (req, res) => {
  try {
    const { articleId } = req.params;
    
    // Find the current article
    const currentArticle = await Post.findById(articleId)
      .populate('category', 'name slug')
      .select('category tags _id');
    
    if (!currentArticle) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Build query for recommendations
    const query = {
      _id: { $ne: currentArticle._id }, // Exclude current article
      status: { $in: ['pending_review', 'published'] } // Only published or pending articles
    };

    // Build conditions for category or tag matching
    const conditions = [];

    // Same category condition
    if (currentArticle.category) {
      conditions.push({ category: currentArticle.category._id });
    }

    // Overlapping tags condition
    if (currentArticle.tags && currentArticle.tags.length > 0) {
      conditions.push({ tags: { $in: currentArticle.tags } });
    }

    // If we have conditions, add them to query
    if (conditions.length > 0) {
      query.$or = conditions;
    } else {
      // If no category or tags, return trending articles
      // This handles edge cases
    }

    // Find recommended articles
    // Sort by: views (descending) first, then by recent publish date (descending)
    const recommendations = await Post.find(query)
      .populate('category', 'name slug')
      .select('title slug category tags viewCount createdAt image')
      .sort({ viewCount: -1, createdAt: -1 })
      .limit(5);

    // If we don't have enough recommendations, fill with trending articles
    if (recommendations.length < 5) {
      const excludeIds = [currentArticle._id, ...recommendations.map(r => r._id)];
      
      const trendingQuery = {
        _id: { $nin: excludeIds },
        status: { $in: ['pending_review', 'published'] }
      };
      
      const trendingArticles = await Post.find(trendingQuery)
        .populate('category', 'name slug')
        .select('title slug category tags viewCount createdAt image')
        .sort({ viewCount: -1, createdAt: -1 })
        .limit(5 - recommendations.length);
      
      recommendations.push(...trendingArticles);
    }

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations: recommendations.map(article => ({
        _id: article._id,
        title: article.title,
        slug: article.slug,
        category: article.category,
        tags: article.tags || [],
        viewCount: article.viewCount || 0,
        createdAt: article.createdAt,
        image: article.image
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get trending articles for homepage (no articleId needed)
const getTrendingArticles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const trendingArticles = await Post.find({
      status: { $in: ['pending_review', 'published'] }
    })
      .populate('category', 'name slug')
      .select('title slug category tags viewCount createdAt image')
      .sort({ viewCount: -1, createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: trendingArticles.length,
      recommendations: trendingArticles.map(article => ({
        _id: article._id,
        title: article.title,
        slug: article.slug,
        category: article.category,
        tags: article.tags || [],
        viewCount: article.viewCount || 0,
        createdAt: article.createdAt,
        image: article.image
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export {createPost,getPosts,deletePost,editPost, 
  getHeadNews,getMainNews,getPostsByCategory,getPost,getPostsBySubCategory,
  incrementPostView, getRecommendedPosts, getPersonalizedRecommendations,
  getPostsPaginated, getGroupedPostsForAdmin, searchPosts, getMostReadPosts,
  getContentBasedRecommendations, getTrendingArticles
};
