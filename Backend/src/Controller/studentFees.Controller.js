import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import { StudentFee } from "../Models/studentFees.Model.js";
import { Student } from "../Models/student.model.js";
import { FeeGroup } from "../Models/feeGroup.Model.js";

export const addPaymentsAndDiscounts = wrapAsync(async (req, res) => {
    const { studentId, feeDetails, paymentDate, paymentMode, remarks } =
        req.body;

    let studentFee = await StudentFee.findOne({ student: studentId });

    if (!studentFee) {
        const student = await Student.findById(studentId).populate(
            "currentClass feeGroup"
        );
        if (!student) {
            return res.status(404).json({ error: "Student record not found" });
        }

        const feeGroup = student.feeGroup;
        if (!feeGroup) {
            return res.status(404).json({
                error: "FeeGroup record not found for the student",
            });
        }

        const totalFees = Object.values(feeGroup.fees).reduce(
            (acc, fee) => acc + Number(fee),
            0
        );

        studentFee = new StudentFee({
            student: studentId,
            class: student.currentClass._id,
            feeGroup: feeGroup._id,
            originalDueAmount: totalFees,
            dueAmount: totalFees,
            totalPaidAmount: 0,
            balance: totalFees,
            paymentStatus: "Unpaid",
            paymentHistory: [],
            discountHistory: [],
        });
    } else if (
        studentFee &&
        (studentFee.originalDueAmount === undefined ||
            studentFee.originalDueAmount === null)
    ) {
        const student = await Student.findById(studentId).populate("feeGroup");
        if (!student) {
            return res.status(404).json({ error: "Student record not found" });
        }
        const feeGroup = student.feeGroup;
        if (!feeGroup) {
            return res.status(404).json({
                error: "FeeGroup record not found for the student",
            });
        }
        const totalFees = Object.values(feeGroup.fees).reduce(
            (acc, fee) => acc + Number(fee),
            0
        );
        studentFee.originalDueAmount = totalFees;
    }

    let totalDiscountAmount = 0;
    let totalPaymentAmount = 0;

    const receiptNumber = generateReceiptNumber();

    for (const fee of feeDetails) {
        const { feeHeader, discountAmount, discountGivenBy, amountPaying } =
            fee;

        const discountAmt = Number(discountAmount) || 0;
        const amountPayingNum = Number(amountPaying) || 0;

        if (discountAmt > 0) {
            totalDiscountAmount += discountAmt;

            studentFee.discountHistory.push({
                discountHeader: feeHeader,
                discountAmount: discountAmt,
                discountGivenBy,
                date: new Date(),
            });
        }

        if (amountPayingNum > 0) {
            totalPaymentAmount += amountPayingNum;

            studentFee.paymentHistory.push({
                paymentDate,
                feeHeader,
                amount: amountPayingNum,
                receiptNumber,
                paymentMode,
            });
        }
    }

    if (totalPaymentAmount === 0 && totalDiscountAmount === 0) {
        return res
            .status(400)
            .json({ error: "No payment or discount provided." });
    }

    const totalDiscounts = studentFee.discountHistory.reduce(
        (sum, discount) => sum + Number(discount.discountAmount),
        0
    );

    const totalPaidAmount = studentFee.paymentHistory.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
    );

    const dueAmount =
        Number(studentFee.originalDueAmount) - totalDiscounts - totalPaidAmount;

    const adjustedDueAmount = dueAmount < 0 ? 0 : dueAmount;

    studentFee.dueAmount = adjustedDueAmount;
    studentFee.totalPaidAmount = totalPaidAmount;
    studentFee.balance = adjustedDueAmount;

    if (adjustedDueAmount <= 0) {
        studentFee.paymentStatus = "Paid";
    } else if (totalPaidAmount > 0) {
        studentFee.paymentStatus = "Partially Paid";
    } else {
        studentFee.paymentStatus = "Unpaid";
    }

    if (remarks) {
        studentFee.remarks = remarks;
    }

    await studentFee.save();

    const responseData = {
        _id: studentFee._id,
        student: studentFee.student,
        class: studentFee.class,
        feeGroup: studentFee.feeGroup,
        originalDueAmount: studentFee.originalDueAmount,
        totalDiscountAmount: totalDiscounts,
        dueAmount: adjustedDueAmount,
        totalPaidAmount: totalPaidAmount,
        balance: adjustedDueAmount,
        paymentStatus: studentFee.paymentStatus,
        remarks: studentFee.remarks,
        paymentHistory: studentFee.paymentHistory,
        discountHistory: studentFee.discountHistory,
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Payment and discounts updated successfully",
                responseData,
                true
            )
        );
});

export const getStudentFeeDetails = wrapAsync(async (req, res, next) => {
    const { studentId } = req.params;

    if (!studentId) {
        return res
            .status(400)
            .json(new ApiResponse(400, "Student ID is required."));
    }

    const student = await Student.findById(studentId).populate(
        "currentClass feeGroup"
    );

    if (!student) {
        return res.status(404).json(new ApiResponse(404, "Student not found."));
    }

    const studentFee = await StudentFee.findOne({
        student: studentId,
    });
    if (!studentFee) {
        return res
            .status(404)
            .json(new ApiResponse(404, "Student fee record not found."));
    }

    if (!studentFee.originalDueAmount) {
        const fees = student.feeGroup.fees.toObject();
        const totalFees = Object.values(fees).reduce(
            (sum, fee) => sum + Number(fee),
            0
        );
        studentFee.originalDueAmount = totalFees;
    }

    const feeHeaders = student.feeGroup.fees.toObject();

    const feeDetails = [];

    const discountsByFeeHeader = {};
    const paymentsByFeeHeader = {};

    studentFee.discountHistory.forEach((discount) => {
        const feeHeader = discount.discountHeader;
        const normalizedHeader = feeHeader.toLowerCase().replace(/\s+/g, "");
        if (!discountsByFeeHeader[normalizedHeader]) {
            discountsByFeeHeader[normalizedHeader] = 0;
        }
        discountsByFeeHeader[normalizedHeader] += Number(
            discount.discountAmount
        );
    });

    studentFee.paymentHistory.forEach((payment) => {
        const feeHeader = payment.feeHeader;
        const normalizedHeader = feeHeader.toLowerCase().replace(/\s+/g, "");
        if (!paymentsByFeeHeader[normalizedHeader]) {
            paymentsByFeeHeader[normalizedHeader] = 0;
        }
        paymentsByFeeHeader[normalizedHeader] += Number(payment.amount);
    });

    let totalDiscountAmount = 0;
    let totalPaidAmount = 0;

    for (const feeHeader of Object.keys(feeHeaders)) {
        const originalAmount = Number(feeHeaders[feeHeader]);
        const normalizedHeader = feeHeader.toLowerCase().replace(/\s+/g, "");

        const discountAmount = discountsByFeeHeader[normalizedHeader] || 0;
        const paymentAmount = paymentsByFeeHeader[normalizedHeader] || 0;

        const dueAmount = originalAmount - discountAmount - paymentAmount;
        const adjustedDueAmount = dueAmount < 0 ? 0 : dueAmount;

        totalDiscountAmount += discountAmount;
        totalPaidAmount += paymentAmount;

        feeDetails.push({
            feeHeader,
            originalAmount: originalAmount,
            discountAmount,
            paymentAmount,
            dueAmount: adjustedDueAmount,
        });
    }

    const overallDueAmount = feeDetails.reduce(
        (sum, fee) => sum + fee.dueAmount,
        0
    );

    let paymentStatus = "";
    if (overallDueAmount <= 0) {
        paymentStatus = "Paid";
    } else if (totalPaidAmount > 0) {
        paymentStatus = "Partially Paid";
    } else {
        paymentStatus = "Unpaid";
    }

    return res.status(200).json(
        new ApiResponse(200, "Student fees retrieved successfully.", {
            student: {
                _id: student._id,
                name: student.name,
                rollNumber: student.rollNumber,
                class: {
                    _id: student.currentClass._id,
                    name: student.currentClass.name,
                },
                feeGroup: {
                    _id: student.feeGroup._id,
                    fees: student.feeGroup.fees,
                    installmentDates: student.feeGroup.installmentDates,
                },
            },
            studentFee: {
                _id: studentFee._id,
                originalDueAmount: studentFee.originalDueAmount,
                totalDiscount: totalDiscountAmount,
                totalPaidAmount: totalPaidAmount,
                dueAmount: overallDueAmount,
                paymentStatus: paymentStatus,
                feeDetails: feeDetails,
                paymentHistory: studentFee.paymentHistory || [],
                discountHistory: studentFee.discountHistory || [],
            },
        })
    );
});

const generateReceiptNumber = () => {
    return `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};
