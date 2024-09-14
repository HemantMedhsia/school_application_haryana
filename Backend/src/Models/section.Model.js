import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    description: {
        type: String,
    },
    subjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
        },
    ],
});

export const Section = mongoose.model("Section", sectionSchema);
