import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    sessionYear: {
        type: String,
        required: true
    },
    sessionStartDate: {
        type: String,
        required: true,
        default: "April"

    },
    sessionEndDate: {
        type: String,
        required: true,
        default: "March"
    },
});

export const Session = mongoose.model('Session', sessionSchema);