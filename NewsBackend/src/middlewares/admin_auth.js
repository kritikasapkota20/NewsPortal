import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
export const protectAdmin=async(req,res,next)=>{
    
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"Unauthorized,Please login"
            })
        }
        try{
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.admin=await Admin.findById(decoded.adminId).select("-password");
            if(!req.admin){
                return res.status(401).json({
                    message:"Unauthorized,Please login"
                })
            }
            next();

        }catch(error){
            return res.status(403).json({
                message:"Forbidden"
            })
        }
}

