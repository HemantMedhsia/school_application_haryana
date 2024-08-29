import mongoose from "mongoose";

const { Schema } = mongoose;

const staffAttendanceSchema = new Schema({
    staffId: {
        type: Schema.Types.ObjectId,
        ref: "Staff",
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
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
});

export const StaffAttendance = mongoose.model(
    "StaffAttendance",
    staffAttendanceSchema
);
