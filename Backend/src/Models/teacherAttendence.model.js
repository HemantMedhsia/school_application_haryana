import mongoose from 'mongoose';

const teacherAttendanceSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true,
    },
    reason: {
        type: String,
        default: "",
    },
    notes: {
        type: String,
        default: "",
    }
},
{
    timestamps:true,
});

export const TeacherAttendance = mongoose.model('TeacherAttendance', teacherAttendanceSchema);
