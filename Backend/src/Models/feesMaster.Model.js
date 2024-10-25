import mongoose from "mongoose";

const feesMasterSchema = new mongoose.Schema({
    feesGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FeesGroup",
        required: true,
    },
    feesDetails: [
        {
            feesType: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "FeesType",
                required: true,
            },

            amount: {
                type: Number,
                required: true,
            },
            dueDate: {
                type: Date,
                required: true,
            },
            fineType: {
                type: String,
                enum: ["none", "percentage", "fixAmount"],
                required: true,
            },
            percentage: {
                type: Number,
                required: function () {
                    return this.fineType === "percentage";
                },
                default: 0,
            },
            fixAmount: {
                type: Number,
                required: function () {
                    return this.fineType === "fixAmount";
                },
                default: 0,
            },
        },
    ],
});

export const FeesMaster = mongoose.model("FeesMaster", feesMasterSchema);
