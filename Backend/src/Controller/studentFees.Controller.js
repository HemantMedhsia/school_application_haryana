import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import { StudentFee } from "../Models/studentFees.Model.js";
import { Student } from "../Models/student.model.js";
import { FeeGroup } from "../Models/feeGroup.Model.js";

export const addPaymentsAndDiscounts = wrapAsync(async (req, res) => {
    const {
        studentId,
        feeDetails,
        paymentDate,
        paymentMode,
        remarks,
        totalPayingAmount,
    } = req.body;

    // Find the student's fee record
    let studentFee = await StudentFee.findOne({ student: studentId });

    // If the student fee record does not exist, create a new one
    if (!studentFee) {
        // Find the student's class information
        const student = await Student.findById(studentId).populate(
            "currentClass"
        );
        if (!student) {
            return res.status(404).json({ error: "Student record not found" });
        }

        // Find the fee group related to the student's class
        const feeGroup = await FeeGroup.findOne({
            class: student.currentClass,
        });
        if (!feeGroup) {
            return res.status(404).json({
                error: "FeeGroup record not found for the student's class",
            });
        }

        // Create a new StudentFee record with data from FeeGroup
        studentFee = new StudentFee({
            student: studentId,
            class: feeGroup.class,
            feeGroup: feeGroup._id,
            dueAmount: Object.values(feeGroup.fees).reduce(
                (acc, fee) => acc + fee,
                0
            ),
            totalPaidAmount: 0,
            paymentHistory: [],
            discountHistory: [],
        });
    }

    let totalDiscountAmount = 0;

    // Iterate through fee headers to manage payments and discounts
    feeDetails.forEach((fee) => {
        const { feeHeader, discountAmount, discountGivenBy, amountPaying } =
            fee;

        // Apply discount if provided
        if (discountAmount) {
            totalDiscountAmount += discountAmount;

            studentFee.discountHistory.push({
                discountHeader: feeHeader,
                discountAmount,
                discountGivenBy,
                date: new Date(),
            });
        }

        // Apply payment if provided
        if (amountPaying) {
            studentFee.paymentHistory.push({
                paymentDate,
                feeHeader,
                amount: amountPaying,
                receiptNumber: generateReceiptNumber(),
                paymentMode,
            });
        }
    });

    // Update due amount based on discount and payment

    studentFee.dueAmount -= totalDiscountAmount;
    studentFee.dueAmount -= totalPayingAmount;
    studentFee.totalPaidAmount += totalPayingAmount;

    // Handle the case where no payment is made
    if (totalPayingAmount === 0 && totalDiscountAmount === 0) {
        return res
            .status(400)
            .json({ error: "No payment or discount provided." });
    }

    // Optional: Add remarks if provided
    if (remarks) {
        studentFee.remarks = remarks;
    }

    await studentFee.save();
    return res
        .status(200)
        .json(
            new ApiResponse(
                studentFee,
                "Payment and discounts updated successfully"
            )
        );
});

export const getStudentFeeDetails = wrapAsync(async (req, res) => {
    const { studentId } = req.params;

    // Find the student's fee record and populate the required fields
    const studentFee = await StudentFee.findOne({ student: studentId })
        .populate("student", "firstName lastName")
        .populate("class", "name")
        .populate("feeGroup");

    if (!studentFee) {
        return res
            .status(404)
            .json({ error: "Student Fee record not found", success: false });
    }

    const feeGroup = studentFee.feeGroup;
    if (!feeGroup || !feeGroup.fees) {
        return res.status(404).json({
            error: "Fee group details are missing for this student",
            success: false,
        });
    }

    // Prepare fee details by calculating paid amounts and due amounts
    const feeDetails = Object.entries(feeGroup.fees).reduce(
        (acc, [key, feeAmount]) => {
            // Calculate total paid amount for the current fee header
            const totalPaidForFee = studentFee.paymentHistory
                .filter((p) => p.feeHeader.toLowerCase() === key.toLowerCase())
                .reduce((acc, p) => acc + p.amount, 0);

            // Calculate the due amount by subtracting the total paid amount from the fee amount
            const dueAmount = feeAmount - totalPaidForFee;

            // Add the fee details to the accumulator object
            acc[key] = {
                totalAmount: feeAmount,
                dueAmount: Math.max(dueAmount, 0), // Ensure due amount is not negative
                paidAmount: totalPaidForFee,
            };
            return acc;
        },
        {}
    );

    // Calculate total fee amount and total due amount across all fee types
    const totalFeeAmount = Object.values(feeDetails).reduce(
        (acc, fee) => acc + fee.totalAmount,
        0
    );
    const totalDueAmount = Object.values(feeDetails).reduce(
        (acc, fee) => acc + fee.dueAmount,
        0
    );

    // Prepare the response with student details, fee details, and payment history
    const response = {
        student: {
            id: studentFee.student._id,
            name: `${studentFee.student.firstName} ${studentFee.student.lastName}`,
            className: studentFee.class.name,
        },
        feeDetails,
        totalFeeAmount,
        totalDueAmount,
        paymentHistory: studentFee.paymentHistory.map((payment) => ({
            paymentDate: payment.paymentDate,
            feeHeader: payment.feeHeader,
            amount: payment.amount,
            receiptNumber: payment.receiptNumber,
            _id: payment._id,
        })),
    };

    return res.status(200).json({
        statusCode: response,
        data: "Student fee details retrieved successfully",
        message: "Success",
        success: true,
    });
});

const generateReceiptNumber = () => {
    return `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};
