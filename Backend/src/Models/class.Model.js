import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    subjectGroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubjectGroup", 
        },
    ],
});

export const Class = mongoose.model("Class", classSchema);
