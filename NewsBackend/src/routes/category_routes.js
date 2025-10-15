import express from 'express';
import { createCategory, getCategories, getCategory, editCategory, deleteCategory } from '../controllers/category.js';     
const router=express.Router();
router.post("/",createCategory);
router.get("/",getCategories);
router.get("/:id",getCategory); 
router.put("/:id",editCategory);
router.delete("/:id",deleteCategory);
export default router;