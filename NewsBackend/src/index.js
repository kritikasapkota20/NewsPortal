import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db_connection/db_connection.js";
import adminRoutes from "./routes/adminauth_routes.js"
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/post_routes.js";
import categoryRoutes from "./routes/category_routes.js";
import editorRoutes from "./routes/editorroutes.js";
import commentRoutes from "./routes/comment_routes.js";
import path from 'path';
import passport from "./configs/passport.js";
import { fileURLToPath } from 'url';

import fs from 'fs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const app = express();
const port = process.env.PORT;
// Connect to database
connectDB();

// Middleware configuration
app.use(cors({
    origin:[ "http://localhost:5173","http://localhost:5174"], // Allow frontend origin
    credentials: true ,
      methods: ["GET", "POST", "PUT", "DELETE","PATCH"],// Allow cookies to be sent
}));
// Update CORS configuration

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/user",userRoutes);
app.use("/api/post",postRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/comments",commentRoutes);
app.use("/api/editor", editorRoutes);



app.all("*",(req,res)=>{
    res.status(404).json({
        message:"Route not Found"
    })
})
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
