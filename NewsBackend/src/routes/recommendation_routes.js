// routes/recommendation_routes.js
import express from "express";
import { getCategoryBasedRecommendations } from "../controllers/Recommendation.js";

const router = express.Router();

router.post("/", getCategoryBasedRecommendations);

export default router;
