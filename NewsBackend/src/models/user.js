import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
     role: {
    type: String,
    enum: ["User", "Editor",],
    default: "User",
  },
   isVerified: { type: Boolean, default: false },
verificationToken: String,
verificationExpires: Date,
refreshToken: { type: String, default: "" },

    loginAttempts: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;