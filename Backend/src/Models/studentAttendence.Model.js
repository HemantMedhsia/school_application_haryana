import mongoose from "mongoose";

const studentAttendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Late", "Holiday"],
        required: true,
    },
    reason: {
        type: String,
        default: "",
    },
    notes: {
        type: String,
        default: "",
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: false,
    },
    
},{
    timestamps:true,
});

export const StudentAttendance = mongoose.model("StudentAttendance", studentAttendanceSchema);
