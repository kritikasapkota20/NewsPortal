import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_CONN=process.env.MONGO_CONN;
const connectDB=async()=>{
    try{
        await mongoose.connect(`${MONGO_CONN}`)
        console.log("Connected to Database")
    }catch(error){
        console.log("Error connecting to Database",error);
        
    }
}
export default connectDB;

