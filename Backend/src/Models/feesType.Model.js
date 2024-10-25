import mongoose from "mongoose";

const feesTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    feesCode: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },
});

export const FeesType = mongoose.model("FeesType", feesTypeSchema);
