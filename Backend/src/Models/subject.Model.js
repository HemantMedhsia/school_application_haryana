import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // Ensures no two subjects have the same name
        },
        code: {
            type: String,
            required: true,
            unique: true, // Unique identifier for the subject
        },
        description: {
            type: String,
            default: "", // Optional description of the subject
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin", // Reference to the Teacher model
            required: true, // Indicates which teacher created the subject
        },

        syllabus: {
            type: String,
            default: "", // Optional syllabus details
        },
        credits: {
            type: Number,
            default: 0, // Number of credits assigned to the subject
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"], // Indicates if the subject is currently active
            default: "Active",
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Middleware to update the updatedAt field before saving
SubjectSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Subject = mongoose.model("Subject", SubjectSchema);
