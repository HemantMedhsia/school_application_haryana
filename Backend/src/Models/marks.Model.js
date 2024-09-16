import mongoose from "mongoose";

const marksSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        term: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Term",
            required: true,
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        marks: [
            {
                subject: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Subject",
                    required: true,
                },
                examType: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "ExamType",
                    required: true,
                },
                marksObtained: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

export const Marks = mongoose.model("Marks", marksSchema);
