import mongoose from "mongoose";

const feeGroupSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    fees: {
        tuitionFee: {
            type: Number,
            required: true,
        },
        admissionFee: {
            type: Number,
            required: true,
        },
        annualFee: {
            type: Number,
            required: true,
        },
        otherFee: {
            type: Number,
            required: false,
        },
    },
    installmentDates: [
        {
            month: {
                type: String,
            },
            dueDate: {
                type: Date,
            },
        },
    ],
});

export const FeeGroup = mongoose.model("FeeGroup", feeGroupSchema);
