import mongoose from "mongoose";

const editorSchema = new mongoose.Schema({
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
        default: "editor",
        required: true,
        // enum: ["admin", "superadmin"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
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

const Editor = mongoose.model("editor", editorSchema);
export default Editor;