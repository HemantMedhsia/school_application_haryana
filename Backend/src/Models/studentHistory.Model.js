import mongoose from "mongoose";

const studentHistorySchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        default: "60d21b4667d0d8992e610c88",
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    classSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true,
    },
});

export const StudentHistory = mongoose.model(
    "StudentHistory",
    studentHistorySchema
);
