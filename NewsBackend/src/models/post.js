import mongoose from "mongoose";
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subCategory: {
  type: String,
  required: false,
  trim: true,
},

 
   isHeadNews: { type: Boolean, default: false },
   isMainNews: { type: Boolean, default: false }, 

    content:{
        type:String,
        required:true,
        trim:true,
    },
    image:{
        type:String,
        required:true,
    },
  assignedEditor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'published', 'rejected'],
    default: 'draft',
  },
  viewCount: { type: Number, default: 0 },
  tags: {
    type: [String],
    default: [],
    trim: true,
  },
 createdAt:{
    type:Date,
    default:Date.now,
 }

})
const Post = mongoose.model("Post", postSchema);
export default Post;
