import mongoose from "mongoose";

const examTypeSchema = new mongoose.Schema({
    name: {  // Unit Test, Mid Term, Final Term
        type: String,
        required: true,
    },
    term: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Term",
        required: true,
    },
    maxMarks: {
        type: Number,
        required: true,
    },
    minMarks: {
        type: Number,
        required: true,
    },
});

export const ExamType = mongoose.model("ExamType", examTypeSchema);
