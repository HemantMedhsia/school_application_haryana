import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: "",
    },

    syllabus: {
        type: String,
        default: "",
    },
    credits: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher" 
    },
});

SubjectSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Subject = mongoose.model("Subject", SubjectSchema);
