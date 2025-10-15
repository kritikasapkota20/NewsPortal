import mongoose from "mongoose";
const categorySchema=new mongoose.Schema({
    name:{type:String,
        required:true,
        unique:true,
    trim:true,},
    slug:{type:String,
        required:true,
        unique:true,
        trim:true,
    },  
    subCategories: {
    type: [String], // array of strings for subcategory names
    default: [],
  },    
    description:{type:String,
        required:false,
        trim:true,
    },  
    createdAt:{type:Date,
        default:Date.now,
    }
    
});
const Category=mongoose.model("Category",categorySchema);
export default Category;