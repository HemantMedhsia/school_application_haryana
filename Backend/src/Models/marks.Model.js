import mongoose from "mongoose";

const MarksSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        examType: {
            type: String,
            required: true,
            enum: [
                "Chapter Wise Weekly Test",
                "Monthly Test",
                "Monthly Exam Practice",
                "Internal Assessments Test",
            ],
        },
        subjectMarks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SingleSubjectMark",
            },
        ],
        percentage: {
            type: Number,
            required: true,
            default: 0,
        },
        rank: {
            type: Number,
            required: true,
            default: 0,
        },
        division: {
            type: String,
            enum: ["First", "Second", "Third", "Fail"],
            required: true,
            default: "Fail",
        },
        grandTotal: {
            type: Number,
            required: true,
            default: 0,
        },
        totalObtainedMarks: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Marks = mongoose.model("Marks", MarksSchema);

export default Marks;
