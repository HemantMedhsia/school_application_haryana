import mongoose from "mongoose";

const termSchema = new mongoose.Schema({
    name: {
        //term 1 term 2
        type: String,
        required: true,
        unique: true,
    },
    startDate: {
        type: Date,
        default: Date.now(),
    },
    endDate: {
        type: Date,
        default: Date.now(),
    },
});

export const Term = mongoose.model("Term", termSchema);
