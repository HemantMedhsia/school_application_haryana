import mongoose from "mongoose";

const studentFeeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    feeGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FeeGroup",
        required: true,
    },
    // installments: [
    //     {
    //         month: {
    //             type: String,
    //             required: true,
    //         },
    //         dueDate: {
    //             type: Date,
    //             required: true,
    //         },
    //         amount: {
    //             type: Number,
    //             required: true,
    //         },
    //         discount: {
    //             type: Number,
    //             default: 0,
    //         },
    //         discountBy: {
    //             type: String,
    //             enum: ["Principal", "Management", "Other"],
    //         },
    //         penaltyAmount: {
    //             type: Number,
    //             default: 0,
    //         },
    //         status: {
    //             type: String,
    //             enum: ["Paid", "Unpaid","Partially Paid"],
    //             default: "Unpaid",
    //         },
    //         paymentDate: {
    //             type: Date,
    //         },
    //         paymentMode: {
    //             type: String,
    //             enum: ["Cash", "Bank Transfer", "Cheque", "Online"],
    //         },
    //         remarks: {
    //             type: String,
    //         },
    //     },
    // ],
    dueAmount: {
        type: Number,
        required: true,
    },
    totalPaidAmount: {
        type: Number,
        required: false,
        default: 0,
    },

    remarks: {
        type: String,
    },

    paymentHistory: [
        {
            paymentDate: {
                type: Date,
                required: true,
            },
            feeHeader: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            receiptNumber: {
                type: String,
                required: true,
            },
            paymentMode: {
                type: String,
                enum: ["Cash", "Bank Transfer", "Cheque", "Online"],
            },
        },
    ],
    discountHistory: [
        {
            discountHeader: {
                type: String,
                required: true,
            },
            discountAmount: {
                type: Number,
                required: true,
            },
            discountGivenBy: {
                type: String,
                enum: ["Principal", "Management", "Other"],
            },
            date: {
                type: Date,
                required: true,
            },
        },
    ],
});

export const StudentFee = mongoose.model("StudentFee", studentFeeSchema);
