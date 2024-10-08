import mongoose from "mongoose";

const examScheduleSchema = new mongoose.Schema({
    term: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Term",
        required: true,
        index: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
        index: true,
    },
    examType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExamType",
        required: true,
        index: true,
    },
    subjectGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubjectGroup",
        required: true,
        index: true,
    },
    examDetails: [
        {
            subject: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
                required: true,
            },
            examDate: {
                type: Date,
                required: true,
            },
            startTime: {
                type: String,
                required: true,
            },
            endTime: {
                type: String,
                required: true,
            },
        },
    ],
});

export const ExamSchedule = mongoose.model("ExamSchedule", examScheduleSchema);
