import mongoose from "mongoose";

const examScheduleSchema = new mongoose.Schema(
    {
        term: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExamTerm",
            required: true,
        },
        examType: {
            type: String,
            enum: ["Unit Test", "Internal Test", "Half-Yearly", "Annual"],
            required: true,
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        subjectGroups: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubjectGroup",
            },
        ],
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const ExamSchedule = mongoose.model("ExamSchedule", examScheduleSchema);
