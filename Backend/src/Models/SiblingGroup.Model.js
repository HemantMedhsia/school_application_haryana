import mongoose from "mongoose";

const siblingGroupSchema = new mongoose.Schema({
    familyName: {
        type: String,
        required: true,
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
    ],
    notes: {
        type: String,
    },
});

export const SiblingGroup = mongoose.model("SiblingGroup", siblingGroupSchema);
