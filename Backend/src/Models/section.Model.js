import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            enum: ["A", "B", "C", "D"],
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);


export const Section = mongoose.model("Section", sectionSchema);
