import mongoose from "mongoose";

const calculateGrade = (marks) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    return "F";
};

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

            // subjectTotalMarks: {
            //     type: Number,
            // },
            // subjectGrade: {
            //     type: String,
            // },
        },
    ],
    // totalMarkObtained: {
    //     type: Number,
    //     default: 0,
    // },
    // totalMarkPossible: {
    //     type: Number,
    //     default: 0,
    // },
    // percentage: {
    //     type: Number,
    //     default: 0,
    // },
    // finalGrade: {
    //     type: String,
    //     default: "F",
    // },
    // rank: {
    //     type: Number,
    // },
});

export const Marks = mongoose.model("Marks", marksSchema);
