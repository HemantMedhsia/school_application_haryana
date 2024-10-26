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
    installments: [
        {
            month: {
                type: String,
                required: true,
            },
            dueDate: {
                type: Date,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            discount: {
                type: Number,
                default: 0,
            },
            discountBy: {
                type: String,
                enum: ["Principal", "Management", "Other"],
            },
            penaltyAmount: {
                type: Number,
                default: 0,
            },
            status: {
                type: String,
                enum: ["Paid", "Unpaid"],
                default: "Unpaid",
            },
            paymentDate: {
                type: Date,
            },
            paymentMode: {
                type: String,
                enum: ["Cash", "Bank Transfer", "Cheque", "Online"],
            },
            remarks: {
                type: String,
            },
        },
    ],
});

feeGroupSchema.methods.assignFeesToStudents = async function () {
    const students = await mongoose
        .model("Student")
        .find({ currentClass: this.class });
    const feesData = this.fees;

    for (const student of students) {
        const installments = [];
        for (let i = 0; i < 12; i++) {
            const monthlyTuitionFee = feesData.tuitionFee / 12;
            installments.push({
                month: this.installmentDates[i].month,
                dueDate: this.installmentDates[i].dueDate,
                amount:
                    monthlyTuitionFee +
                    (i === 0 ? feesData.admissionFee + feesData.annualFee : 0),
                status: "Unpaid",
            });
        }

        const newStudentFee = new mongoose.model("StudentFee")({
            student: student._id,
            class: this.class,
            feeGroup: this._id,
            installments: installments,
        });
        await newStudentFee.save();
    }
};

export const StudentFee = mongoose.model("StudentFee", studentFeeSchema);
