import mongoose from "mongoose";

const MarksSchema = new mongoose.Schema(
    {
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
        subjects: [
            {
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
            },
        ],
        percentage: {
            type: Number,
            required: true,
        },
        rank: {
            type: Number,
            required: true,
        },
        division: {
            type: String,
            enum: ["First", "Second", "Third", "Fail"],
            required: true,
        },
        grandTotal: {
            type: Number,
            required: true,
        },
        totalObtainedMarks: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Marks = mongoose.model("Marks", MarksSchema);

export default Marks;
