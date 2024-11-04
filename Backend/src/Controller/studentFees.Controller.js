import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import { StudentFee } from "../Models/studentFees.Model.js";
import { Student } from "../Models/student.model.js";
import { FeeGroup } from "../Models/feeGroup.Model.js";
import { Class } from "../Models/class.Model.js";
import QRCode from "qrcode";
import path from "path";
import { SiblingGroup } from "../Models/SiblingGroup.Model.js";

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
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuOUJHCmNi_yfKjQhv0ZE5K8tCFuKuo-NS-A&s";

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

    const fiscalYearStartMonth = 3;

    let fiscalYear;
    if (providedDate.getMonth() >= fiscalYearStartMonth) {
        fiscalYear = providedDate.getFullYear();
    } else {
        fiscalYear = providedDate.getFullYear() - 1;
    }

    const adjustedMonth = getAdjustedMonth(providedDate.getMonth());

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

    const feeGroupIds = students
        .map((student) => student.feeGroup)
        .filter((id) => id);
    const uniqueFeeGroupIds = [
        ...new Set(feeGroupIds.map((id) => id.toString())),
    ];
    const feeGroups = await FeeGroup.find({ _id: { $in: uniqueFeeGroupIds } });
    const feeGroupMap = feeGroups.reduce((map, fg) => {
        map[fg._id.toString()] = fg;
        return map;
    }, {});

    const responseData = [];

    for (const student of students) {
        const feeRecord = await StudentFee.findOne({ student: student._id });

        let totalDiscountAmount = 0;
        let totalFees = 0;
        let totalPaidAmount = 0;
        let advancePayment = 0;
        let dueAmount = 0;

        const feeGroupId = feeRecord ? feeRecord.feeGroup : student.feeGroup;
        const feeGroup = feeGroupId ? feeGroupMap[feeGroupId.toString()] : null;

        if (feeGroup) {
            const fees = feeGroup.fees || {};

            const tuitionFeeAmount = fees.tuitionFee || 0;
            const admissionFeeAmount = fees.admissionFee || 0;
            const annualFeeAmount = fees.annualFee || 0;
            const otherFeeAmount = fees.otherFee || 0;

            const totalOtherFeesAmount =
                admissionFeeAmount + annualFeeAmount + otherFeeAmount;

            const monthsPassed = adjustedMonth;
            const tuitionFeeDueAmount = (tuitionFeeAmount / 12) * monthsPassed;

            const isFirstMonth = monthsPassed === 1;
            const nonRecurringFeesDue = isFirstMonth ? totalOtherFeesAmount : 0;
            const totalFeesDueUpToDate =
                tuitionFeeDueAmount + nonRecurringFeesDue - totalDiscountAmount;

            totalFees = tuitionFeeAmount + totalOtherFeesAmount;

            if (feeRecord) {
                const discountsUpToDate = feeRecord.discountHistory.filter(
                    (discount) => {
                        const discountDate = new Date(discount.date);
                        return discountDate.getTime() <= providedDate.getTime();
                    }
                );

                totalDiscountAmount = discountsUpToDate.reduce(
                    (sum, discount) => sum + discount.discountAmount,
                    0
                );

                const paymentsUpToDate = feeRecord.paymentHistory.filter(
                    (payment) => {
                        const paymentDate = new Date(payment.paymentDate);
                        return paymentDate.getTime() <= providedDate.getTime();
                    }
                );

                paymentsUpToDate.sort(
                    (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate)
                );

                totalPaidAmount = 0;
                let remainingTuitionFee = tuitionFeeDueAmount;
                let remainingOtherFees = nonRecurringFeesDue;

                for (const payment of paymentsUpToDate) {
                    let paymentAmount = payment.amount;

                    if (remainingTuitionFee > 0) {
                        const allocatedTuition = Math.min(
                            paymentAmount,
                            remainingTuitionFee
                        );
                        remainingTuitionFee -= allocatedTuition;
                        paymentAmount -= allocatedTuition;
                        totalPaidAmount += allocatedTuition;
                    }

                    if (paymentAmount > 0 && remainingOtherFees > 0) {
                        const allocatedOther = Math.min(
                            paymentAmount,
                            remainingOtherFees
                        );
                        remainingOtherFees -= allocatedOther;
                        paymentAmount -= allocatedOther;
                        totalPaidAmount += allocatedOther;
                    }

                    if (paymentAmount > 0) {
                        advancePayment += paymentAmount;
                        totalPaidAmount += paymentAmount;
                    }
                }

                const netBalance = totalPaidAmount - totalFeesDueUpToDate;

                if (netBalance < 0) {
                    dueAmount = (-netBalance).toFixed(2);
                } else if (netBalance > 0) {
                    advancePayment = netBalance.toFixed(2);
                }
            } else {
                dueAmount = totalFeesDueUpToDate.toFixed(2);
            }

            const qrCodeContent = {
                studentName: student.firstName,
                amount: dueAmount > 0 ? dueAmount : advancePayment,
                type: dueAmount > 0 ? "Due Amount" : "Advance Payment",
            };
            let qrCode = "";
            try {
                qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeContent));
            } catch (error) {
                console.error("QR Code Generation Error: ", error);
                qrCode = "Error generating QR code";
            }

            const studentBill = {
                schoolLogo: logoUrl,
                schoolName: "Vardhan International School",
                contactNumber: "+1-234-567-890",
                month: monthName,
                studentName: student.firstName,
                fatherName: student.parent ? student.parent.fatherName : "N/A",
                phoneNumber: student.mobileNumber || "N/A",
                className: classDetails.name,
                admissionNumber: student.admissionNo,
                totalFees: totalFees.toFixed(2),
                totalPaidAmount: totalPaidAmount.toFixed(2),
                totalDiscountAmount: totalDiscountAmount.toFixed(2),
            };

            if (dueAmount > 0) {
                studentBill.dueAmount = dueAmount;
            } else if (advancePayment > 0) {
                studentBill.advancePayment = advancePayment;
            }

            studentBill.qrCode = qrCode;

            responseData.push(studentBill);
        } else {
            console.log(`Fee group not found for student: ${student._id}`);
            responseData.push({
                schoolLogo: logoUrl,
                schoolName: "Vardhan International School",
                contactNumber: "+1-234-567-890",
                month: monthName,
                studentName: student.firstName,
                fatherName: student.parent ? student.parent.fatherName : "N/A",
                phoneNumber: student.mobileNumber || "N/A",
                className: classDetails.name,
                admissionNumber: student.admissionNo,
                message: "Fee group not found for this student",
            });
        }
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                responseData,
                "Student bill per month retrieved successfully."
            )
        );
});

function getAdjustedMonth(month) {
    const adjusted = month - 3 + 1;
    return adjusted > 0 ? adjusted : adjusted + 12;
}

export const getStudentAndSiblingFeeSummary = wrapAsync(async (req, res) => {
    const { studentId } = req.params;

    const siblingGroup = await SiblingGroup.findOne({
        students: studentId,
    }).populate("students");

    let studentIds = [studentId];

    if (siblingGroup) {
        studentIds = siblingGroup.students.map((student) => student._id);
    }

    const fees = await StudentFee.find({
        student: { $in: studentIds },
    }).populate({
        path: "student",
        select: "firstName lastName mobileNumber currentClass parent",
        populate: [
            {
                path: "currentClass",
                select: "name",
            },
            {
                path: "parent",
                select: "fatherName",
            },
        ],
    });

    let totalFees = 0;
    let totalPaid = 0;
    let totalDue = 0;
    let totalDiscount = 0;
    let totalAdvance = 0;

    const studentFeesDetails = await Promise.all(
        fees.map(async (fee) => {
            const student = fee.student;

            const feeGroup = await FeeGroup.findById(fee.feeGroup);

            const actualFees =
                (feeGroup.fees.tuitionFee || 0) +
                (feeGroup.fees.admissionFee || 0) +
                (feeGroup.fees.annualFee || 0) +
                (feeGroup.fees.otherFee || 0);

            const totalPaidAmount = fee.paymentHistory.reduce(
                (sum, payment) => sum + payment.amount,
                0
            );

            const studentTotalDiscount = fee.discountHistory.reduce(
                (sum, discount) => sum + discount.discountAmount,
                0
            );

            let dueAmount = actualFees - totalPaidAmount - studentTotalDiscount;

            let advanceAmount = 0;
            if (dueAmount < 0) {
                advanceAmount = Math.abs(dueAmount);
                dueAmount = 0;
            }

            totalFees += actualFees;
            totalPaid += totalPaidAmount;
            totalDiscount += studentTotalDiscount;
            totalDue += dueAmount;
            totalAdvance += advanceAmount;

            return {
                studentId: student._id,
                studentName: `${student.firstName} ${
                    student.lastName || ""
                }`.trim(),
                class: student.currentClass?.name || "N/A",
                fatherName: student.parent?.fatherName || "N/A",
                mobileNumber: student.mobileNumber || "N/A",
                totalFees: actualFees,
                dueAmount,
                discount: studentTotalDiscount,
                ...(advanceAmount > 0 && { advanceAmount }),
            };
        })
    );

    let dueFeesTillToday = totalDue - totalAdvance;
    if (dueFeesTillToday < 0) {
        dueFeesTillToday = 0;
    }

    const feeAfterDiscount = totalFees - totalDiscount;

    const combinedSummary = {
        siblingGroupId: siblingGroup ? siblingGroup._id : null,
        totalFees,
        totalPaid,
        dueFeesTillToday,
        totalDiscount,
        feeAfterDiscount,
        totalDue: dueFeesTillToday,
    };

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                studentFeesDetails,
                combinedSummary,
            },
            "Student and sibling fee summary retrieved successfully."
        )
    );
});

export const payAllSiblingStudentFees = wrapAsync(async (req, res) => {
    const { siblingId, feeDetails, paymentDate, paymentMode, remarks } =
        req.body;
    let totalPayingAmount = 0;

    const siblingGroup = await SiblingGroup.findById(siblingId)
        .populate({
            path: "students",
            populate: [
                {
                    path: "currentClass",
                    select: "name",
                },
            ],
        })
        .populate({
            path: "parentId",
            select: "fatherName",
        });

    const fatherName = siblingGroup.parentId?.fatherName || "N/A";

    if (!siblingGroup || siblingGroup.students.length === 0) {
        return res
            .status(404)
            .json({ message: "No students found for the given sibling ID" });
    }

    const studentFees = await StudentFee.find({
        student: { $in: siblingGroup.students.map((s) => s._id) },
    });
    if (!studentFees || studentFees.length === 0) {
        return res
            .status(404)
            .json({ message: "No fee records found for the given sibling ID" });
    }

    let totalOutstanding = 0;
    studentFees.forEach((studentFee) => {
        totalOutstanding += studentFee.dueAmount;
    });

    feeDetails.forEach((fee) => {
        totalPayingAmount += fee.amountPaying - fee.discountAmount;
    });

    if (totalPayingAmount >= totalOutstanding) {
        return res.status(400).json({
            message:
                "Paying amount exceeds the total outstanding balance for all siblings",
        });
    }

    let remainingPayment = totalPayingAmount;
    for (const studentFee of studentFees) {
        if (remainingPayment <= 0) break;

        const payableAmount = Math.min(studentFee.dueAmount, remainingPayment);
        studentFee.dueAmount -= payableAmount;
        studentFee.totalPaidAmount += payableAmount;
        remainingPayment -= payableAmount;

        feeDetails.forEach((fee) => {
            if (
                [
                    "Admission Fee",
                    "Tuition Fee",
                    "Other Fee",
                    "Annual Fee",
                ].includes(fee.feeHeader)
            ) {
                studentFee.paymentHistory.push({
                    paymentDate,
                    feeHeader: fee.feeHeader,
                    amount: Math.min(fee.amountPaying, payableAmount),
                    receiptNumber: generateReceiptNumber(),
                    paymentMode,
                });
            }
        });

        await studentFee.save();
    }

    const totalDue = studentFees.reduce((sum, fee) => sum + fee.dueAmount, 0);
    const totalPaidToDate = studentFees.reduce(
        (sum, fee) => sum + fee.totalPaidAmount,
        0
    );
    const studentNames = siblingGroup.students.map((student) => ({
        name: student.firstName || "N/A",
        class: student.currentClass?.name || "N/A",
    }));

    let tuitionFeesToDate = 0;
    let remainingTuitionFees = 0;
    let remainingOtherFees = 0;

    studentFees.forEach((studentFee) => {
        // Calculate tuition fees paid to date
        const tuitionPayments = studentFee.paymentHistory.filter(
            (payment) => payment.feeHeader === "Tuition Fee"
        );
        const totalTuitionPaid = tuitionPayments.reduce(
            (sum, payment) => sum + payment.amount,
            0
        );
        tuitionFeesToDate += totalTuitionPaid;

        const initialTuitionAmount = studentFee.initialTuitionAmount || 0;
        const tuitionDue = initialTuitionAmount - totalTuitionPaid;
        remainingTuitionFees += tuitionDue > 0 ? tuitionDue : 0;
    });

    const updatedTotalPaidToDate = studentFees.reduce(
        (sum, fee) => sum + fee.totalPaidAmount,
        0
    );

    const todayPaid = totalPayingAmount;

    const updatedTotalDue = totalDue;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                schoolDetails: {
                    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuOUJHCmNi_yfKjQhv0ZE5K8tCFuKuo-NS-A&s",
                    name: "Vardhan International School",
                    contact: "123-456-7890",
                    email: "info@vardhanschool.com",
                },
                receiptNumber: generateReceiptNumber(),
                studentNames,
                fatherName,
                totalDue: updatedTotalDue,
                totalPaid: updatedTotalPaidToDate,
                todayPaid: todayPaid,
            },
            "Payment successful"
        )
    );
});
