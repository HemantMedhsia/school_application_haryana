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

// Export the Section model
export const Section = mongoose.model("Section", sectionSchema);
