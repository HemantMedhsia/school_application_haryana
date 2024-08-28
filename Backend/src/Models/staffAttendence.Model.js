import mongoose from 'mongoose';

const { Schema } = mongoose;

const staffAttendanceSchema = new Schema({
    staffId: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    isPresent: {
        type: Boolean,
        default: false
    }
});

export const StaffAttendance =  mongoose.model('StaffAttendance', staffAttendanceSchema);