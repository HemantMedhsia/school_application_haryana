import mongoose from "mongoose";

const examScheduleSchema = new mongoose.Schema(
    {
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
        examType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExamType",
            required: true,
        },
        subjectGroup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubjectGroup",
            required: true,
        },
        examDetails: [
            {
                subject: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Subject",
                    required: true,
                },
                startTime: {
                    type: Date,
                    required: true,
                },
                endTime: {
                    type: Date,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const ExamSchedule = mongoose.model("ExamSchedule", examScheduleSchema);
