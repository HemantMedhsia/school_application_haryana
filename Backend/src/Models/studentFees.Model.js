import mongoose from "mongoose";

const studentFeesSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    feesMaster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FeesMaster",
        required: true,
    },
    feesType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FeesType",
        required: true,
    },
    amountDue: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number,
        default: function () {
            return this.amountDue;
        },
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid", "partially paid"],
        default: "unpaid",
    },
    discountApplied: {
        type: Number,
        default: 0,
    },
    fineApplied: {
        type: Number,
        default: 0,
    },
    paymentMode: {
        type: String,
        enum: ["cash", "credit", "bank transfer"],
    },
    paymentDate: {
        type: Date,
    },
});

export const StudentFees = mongoose.model("StudentFees", studentFeesSchema);
