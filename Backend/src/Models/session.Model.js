import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    sessionYear: {
        type: String,
        required: true
    },
    sessionStartDate: {
        type: Date,
        required: true
    },
    sessionEndDate: {
        type: Date,
        required: true
    },
});

export const Session = mongoose.model('Session', sessionSchema);