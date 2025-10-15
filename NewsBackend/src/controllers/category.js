import Category from "../models/categorymodel.js";
import slugify from "slugify";
const createCategory=async(req,res)=>{
    try{
        const {name,description}=req.body;
        if(!name){
            return res.status(400).json({message:"Category name is required"});
        }
        const slug=slugify(name,{lower:true,strict:true});
        const existingCategory=await Category.findOne({slug});
        if(existingCategory){
            return res.status(400).json({message:"Category with this name already exists"});
        }
        const newCategory=new Category({name,slug,description});
        await newCategory.save();
        res.status(201).json({message:"Category created successfully",category:newCategory});

    }catch(error){
        res.status(500).json({message:"Internal server error",error:error.message});
    }
};
const getCategories=async(req,res)=>{
    try{
        const categories=await Category.find().sort({createdAt:1});
        res.status(200).json({success:true,count:categories.length,categories});
    }catch(error){
        res.status(500).json({message:"Internal server error",error:error.message});

    };
}
const getCategory=async(req,res)=>{
try{
    const {slug}=req.params;
    const category=await Category.findOne({slug});
    if(!category){
        return res.status(404).json({message:'Category not found'});
    }
    res.status(200).json({success:true,category});
}catch(error){
    res.status(500).json({message:"Intern server error",error:error.message});
}
}
const editCategory=async(req,res)=>{
    try{
        const {id}=req.params;
        const {name,description}=req.body;
        const category=await Category.findById(id);
        if(!category){
            return res.status(404).json({message:"Category not found"});
        }
        if(name){
            category.name=name;
            category.slug=slugify(name,{lower:true,strict:true});
        }
        if(description){
            category.description=description;
        }
        const updatedCategory=await category.save();
        res.status(200).json({message:"Category updated successfully",category:updatedCategory});
    }catch(error){
        res.status(200).json({message:"Internal server error",error:error.message});
        
    }
}
const deleteCategory=async(req,res)=>{
    try{
        const {id}=req.params;
        const deletedCategory=await Category.findByIdAndDelete(id);
        if(!deletedCategory){
            return res.status(404).json({message:"Category not found"});
        }
        res.status(200).json({message:"Category deleted succcessfully"});

    }catch(error){
        res.status(500).json({message:"Internal server error",error:error.message});
    }
}
export { createCategory, getCategories, getCategory, editCategory, deleteCategory };
