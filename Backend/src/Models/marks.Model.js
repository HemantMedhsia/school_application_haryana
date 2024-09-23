import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    term: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Term",
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
            teacher: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Teacher",
                // required: true,
            },
            exams: [
                {
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
    ],
});

export const Marks = mongoose.model("Marks", marksSchema);
