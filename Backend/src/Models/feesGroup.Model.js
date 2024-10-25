import mongoose from "mongoose";

const feesGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
});

export const FeesGroup = mongoose.model("FeesGroup", feesGroupSchema);
