import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, 
        }, 

        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class", 
            required: true,
        }, 
    },
    { timestamps: true }
);


export const Section = mongoose.model("Section", sectionSchema);
