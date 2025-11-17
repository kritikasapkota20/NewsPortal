import express from "express";
import {createPost,deletePost,getPosts,editPost,getHeadNews,getMainNews,getPostsByCategory,getPost,incrementPostView,getRecommendedPosts,getPersonalizedRecommendations, searchPosts, getMostReadPosts, getContentBasedRecommendations, getTrendingArticles} from "../controllers/post.js";
import { getPostsPaginated, getGroupedPostsForAdmin } from "../controllers/post.js";

import upload from "../helper/filehelper.js";

const router=express.Router();
router.post("/createPost",upload.single("file"),createPost);
router.get("/getPosts",getPosts);
router.get("/getPostsPaginated", getPostsPaginated);
router.get("/admin/groupedPosts", getGroupedPostsForAdmin);
router.get("/getPost/:id",getPost);
router.get("/getPostsByCategory/:categorySlug",getPostsByCategory);
router.delete("/deletePost/:category/:id",deletePost);
router.get("/headNews", getHeadNews);
router.get("/mainNews", getMainNews);
router.patch("/editPost/:category/:id",upload.single("file"),editPost);
router.patch("/incrementView/:id", incrementPostView);
router.get("/recommendedPosts", getRecommendedPosts);
router.post("/recommendations", getPersonalizedRecommendations);
router.get("/search", searchPosts);
router.get("/most-read/:categorySlug?", getMostReadPosts);
// Content-based recommendation endpoints
router.get("/recommendations/:articleId", getContentBasedRecommendations);
router.get("/trending", getTrendingArticles);

export default router;
