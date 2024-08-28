import mongoose from "mongoose";

const singleSubjectMarkSchema = new mongoose.Schema({
    subjectName: {
        type: String,
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
    marksObtained: {
        type: Number,
        required: true,
    },
    result: {
        type: String,
        required: true,
        enum: ["Pass", "Fail"],
    },
    grade: {
        type: String,
        enum: ["A++", "A+", "A", "B", "C"],
        default: null,
    },
    note: {
        type: String,
        default: "",
    },
});

export const SingleSubjectMark = mongoose.model("SingleSubjectMark", singleSubjectMarkSchema);
