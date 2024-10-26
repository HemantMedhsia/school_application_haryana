import mongoose from "mongoose";
const siblingGroupSchema = new mongoose.Schema({
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },
    ],
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent",
    },
});

export const SiblingGroup = mongoose.model("SiblingGroup", siblingGroupSchema);
