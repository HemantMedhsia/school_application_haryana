import mongoose from 'mongoose';

const staffAttendanceSchema = new mongoose.Schema({
    workingStaffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkingStaff',
        required: true
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
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: false,
    },
},
{
    timestamps:true,
});

export const StaffAttendance = mongoose.model('StaffAttendance', staffAttendanceSchema);
