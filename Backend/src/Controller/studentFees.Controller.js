import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import { StudentFee } from "../Models/studentFees.Model.js";
import { Student } from "../Models/student.model.js";
import { FeeGroup } from "../Models/feeGroup.Model.js";
import { Class } from "../Models/class.Model.js";
import QRCode from "qrcode";
import path from "path";

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
                studentFee,
                "Payment and discounts updated successfully"
            )
        );
});

export const getStudentFeeDetails = wrapAsync(async (req, res, next) => {
    const { studentId } = req.params;

    if (!studentId) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Student ID is required."));
    }

    const student = await Student.findById(studentId).populate(
        "currentClass feeGroup"
    );

    if (!student) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Student not found."));
    }

    const studentFee = await StudentFee.findOne({
        student: studentId,
    });
    if (!studentFee) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Student fee record not found."));
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
        new ApiResponse(
            200,
            {
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
            },
            "Student fees retrieved successfully."
        )
    );
});

const generateReceiptNumber = () => {
    return `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const getDueFeeListPerClassMonth = wrapAsync(async (req, res) => {
    const { date, class: classId } = req.body;

    if (!date || !classId) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Date and class are required."));
    }

    const providedDate = new Date(date);
    if (isNaN(providedDate)) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Invalid date format."));
    }

    const month = providedDate.getMonth();
    const year = providedDate.getFullYear();

    const classDetails = await Class.findById(classId);
    if (!classDetails) {
        return res.status(404).json(new ApiResponse(404, "Class not found."));
    }

    const studentFees = await StudentFee.find({ class: classId }).populate({
        path: "student",
        populate: { path: "parent" },
    });

    if (!studentFees.length) {
        return res
            .status(404)
            .json(
                new ApiResponse(
                    404,
                    null,
                    "No fee records found for this class."
                )
            );
    }

    const dueFeesList = studentFees.filter((feeRecord) => {
        const lastPaymentDate =
            feeRecord.paymentHistory.length > 0
                ? new Date(
                      Math.max(
                          ...feeRecord.paymentHistory.map((p) =>
                              new Date(p.paymentDate).getTime()
                          )
                      )
                  )
                : null;

        if (lastPaymentDate) {
            return (
                lastPaymentDate.getMonth() === month &&
                lastPaymentDate.getFullYear() === year
            );
        } else {
            return true;
        }
    });

    if (dueFeesList.length === 0) {
        return res
            .status(404)
            .json(
                new ApiResponse(
                    404,
                    null,
                    "No due fees found for this class in the given month."
                )
            );
    }

    const responseData = dueFeesList.map((feeRecord) => {
        const student = feeRecord.student;
        const parent = student && student.parent ? student.parent : null;
        const totalDiscountAmount = feeRecord.discountHistory.reduce(
            (sum, discount) => sum + discount.discountAmount,
            0
        );
        const totalFees =
            feeRecord.totalPaidAmount +
            feeRecord.dueAmount +
            totalDiscountAmount;
        return {
            studentName: student ? student.firstName : "N/A",
            fatherName: parent ? parent.fatherName : "N/A",
            admissionNumber: student ? student.admissionNo : "N/A",
            contact: student ? student.mobileNumber : "N/A",
            currentYearFees: totalFees,
            totalFees: totalFees,
            totalPaidAmount: feeRecord.totalPaidAmount,
            totalDiscountAmount: totalDiscountAmount,
        };
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                responseData,
                "Due fees list retrieved successfully."
            )
        );
});

export const getAllStudentFeeDetails = wrapAsync(async (req, res) => {
    const studentFees = await StudentFee.find().populate({
        path: "student",
        populate: { path: "parent" },
    });

    if (!studentFees.length) {
        return res
            .status(404)
            .json(
                new ApiResponse(
                    404,
                    null,
                    "No fee records found for any class."
                )
            );
    }

    let totalFees = 0;
    let totalReceivedFee = 0;
    let totalDiscount = 0;
    let totalDue = 0;

    studentFees.forEach((feeRecord) => {
        const totalDiscountAmount = feeRecord.discountHistory.reduce(
            (sum, discount) => sum + discount.discountAmount,
            0
        );
        totalFees +=
            feeRecord.totalPaidAmount +
            feeRecord.dueAmount +
            totalDiscountAmount;
        totalReceivedFee += feeRecord.totalPaidAmount;
        totalDiscount += totalDiscountAmount;
        totalDue += feeRecord.dueAmount;
    });

    const responseData = {
        totalFees,
        totalReceivedFee,
        totalDiscount,
        totalDue,
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                responseData,
                "All student fee details retrieved successfully."
            )
        );
});

export const getStudentBillPerMonth = wrapAsync(async (req, res) => {
    const { date, class: classId } = req.body;

    const logoUrl =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMzmcQPKs-mQ9YsDLBGutKI2ZmFaMqpiNidw&s";

    if (!date || !classId) {
        return res
            .status(400)
            .json(new ApiResponse(400, "Date and class are required."));
    }

    const providedDate = new Date(date);
    if (isNaN(providedDate)) {
        return res
            .status(400)
            .json(new ApiResponse(400, "Invalid date format."));
    }

    const month = providedDate.getMonth();
    const year = providedDate.getFullYear();
    const monthName = providedDate.toLocaleString("default", { month: "long" });

    const classDetails = await Class.findById(classId);
    if (!classDetails) {
        return res.status(404).json(new ApiResponse(404, "Class not found."));
    }

    const students = await Student.find({ currentClass: classId }).populate(
        "parent"
    );
    if (!students.length) {
        return res
            .status(404)
            .json(new ApiResponse(404, "No students found for this class."));
    }

    const responseData = [];

    for (const student of students) {
        const feeRecord = await StudentFee.findOne({
            student: student._id,
        });

        let totalDiscountAmount = 0;
        let totalFees = 0;
        let dueAmount = 0;

        if (feeRecord) {
            totalDiscountAmount = feeRecord.discountHistory.reduce(
                (sum, discount) => sum + discount.discountAmount,
                0
            );

            const unpaidFees = feeRecord.paymentHistory
                .filter((payment) => {
                    const paymentDate = new Date(payment.paymentDate);
                    return paymentDate < new Date(year, month, 1);
                })
                .reduce((sum, payment) => sum + payment.amount, 0);

            const installmentFraction = (month + 1) / 12;
            const installmentAmount = feeRecord.dueAmount * installmentFraction;

            dueAmount = installmentAmount - unpaidFees;

            const monthlyPayment = feeRecord.paymentHistory
                .filter((payment) => {
                    const paymentDate = new Date(payment.paymentDate);
                    return (
                        paymentDate.getMonth() === month &&
                        paymentDate.getFullYear() === year
                    );
                })
                .reduce((sum, payment) => sum + payment.amount, 0);

            totalFees =
                feeRecord.totalPaidAmount +
                dueAmount +
                totalDiscountAmount -
                monthlyPayment;
        } else {
            const feeGroup = await FeeGroup.findById(student.feeGroup);
            if (feeGroup) {
                const installmentFraction = (month + 1) / 12;
                dueAmount = feeGroup.totalFeeAmount * installmentFraction;
                totalFees = dueAmount;
            }
        }

        // Generate QR code with student information
        const qrCodeContent = {
            studentName: student.firstName,
            dueAmount: dueAmount,
        };
        let qrCode = "";
        try {
            qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeContent));
        } catch (error) {
            console.error("QR Code Generation Error: ", error);
            qrCode = "Error generating QR code";
        }

        responseData.push({
            schoolName: "Vardhan International School",
            contactNumber: "+1-234-567-890",
            logoUrl: logoUrl, // Use backend-provided logo URL
            month: monthName,
            studentName: student.firstName,
            fatherName: student.parent ? student.parent.fatherName : "N/A",
            phoneNumber: student.mobileNumber || "N/A",
            className: classDetails.name,
            admissionNumber: student.admissionNo,
            dueAmount: dueAmount,
            totalFees: totalFees,
            qrCode: qrCode, // Generated QR code or error message
        });
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Student bill per month retrieved successfully.",
                responseData
            )
        );
});
