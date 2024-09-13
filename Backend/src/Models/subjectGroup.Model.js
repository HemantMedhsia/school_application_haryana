import mongoose from "mongoose";

const subjectGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    subjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
        },
    ],
    classes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
        },
    ],
    sections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
        },
    ],
});

export const SubjectGroup = mongoose.model("SubjectGroup", subjectGroupSchema);
