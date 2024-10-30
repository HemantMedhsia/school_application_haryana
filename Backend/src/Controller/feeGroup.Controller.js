import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { FeeGroup } from "../Models/feeGroup.Model.js";
import { Class } from "../Models/class.Model.js";
import { feeGroupValidationSchema } from "../Validation/feeGroup.Validation.js";
import { Student } from "../Models/student.model.js";
import { StudentFee } from "../Models/studentFees.Model.js";

export const addFeeGroup = wrapAsync(async (req, res, next) => {
    const { feeData } = req.body;

    if (!feeData || !Array.isArray(feeData)) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    "Fee data is required and must be an array."
                )
            );
    }

    for (let fee of feeData) {
        const { error } = feeGroupValidationSchema.validate(fee);
        if (error) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        null,
                        `Validation error for fee group: ${error.details[0].message}`
                    )
                );
        }
    }

    const classIds = feeData.map((fee) => fee.class);
    const existingClasses = await FeeGroup.find({ class: { $in: classIds } });

    if (existingClasses.length > 0) {
        const existingClassNames = existingClasses
            .map((group) => group.class)
            .join(", ");
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    `Fee group already exists for the following class(es): ${existingClassNames}`
                )
            );
    }

    const feeGroupData = feeData.map((fee) => ({
        class: fee.class,
        fees: {
            tuitionFee: fee.fees.tuitionFee || 0,
            admissionFee: fee.fees.admissionFee || 0,
            annualFee: fee.fees.annualFee || 0,
            otherFee: fee.fees.otherFee || 0,
        },
    }));

    const createdFeeGroups = await FeeGroup.insertMany(feeGroupData);

    for (let feeGroup of createdFeeGroups) {
        const students = await Student.find({ currentClass: feeGroup.class });

        if (students && students.length > 0) {
            const studentFees = students.map((student) => ({
                student: student._id,
                class: feeGroup.class,
                feeGroup: feeGroup._id,
                dueAmount:
                    feeGroup.fees.tuitionFee +
                    feeGroup.fees.admissionFee +
                    feeGroup.fees.annualFee +
                    feeGroup.fees.otherFee,
            }));

            const insertedStudentFees = await StudentFee.insertMany(
                studentFees
            );

            for (let studentFee of insertedStudentFees) {
                await Student.findByIdAndUpdate(
                    studentFee.student,
                    {
                        $push: { studentFees: studentFee._id },
                        feeGroup: feeGroup._id,
                    },
                    { new: true }
                );
            }
        }

        await Class.findByIdAndUpdate(
            feeGroup.class,
            { feeGroup: feeGroup._id },
            { new: true }
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdFeeGroups,
                "Fee groups created and assigned to students successfully."
            )
        );
});

export const updateFeeGroup = wrapAsync(async (req, res, next) => {
    const { feeData } = req.body;

    if (!feeData || !Array.isArray(feeData)) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    "Fee data is required and must be an array."
                )
            );
    }

    const updatedFeeGroups = [];

    for (let fee of feeData) {
        const { error } = feeGroupValidationSchema.validate(fee);
        if (error) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        null,
                        `Validation error for fee group: ${error.details[0].message}`
                    )
                );
        }

        if (!fee.feeGroupId) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        null,
                        "Fee group ID is required for updating."
                    )
                );
        }

        const updateData = {
            ...(fee.class && { class: fee.class }),
            fees: {
                ...(fee.fees &&
                    fee.fees.tuitionFee !== undefined && {
                        tuitionFee: fee.fees.tuitionFee,
                    }),
                ...(fee.fees &&
                    fee.fees.admissionFee !== undefined && {
                        admissionFee: fee.fees.admissionFee,
                    }),
                ...(fee.fees &&
                    fee.fees.annualFee !== undefined && {
                        annualFee: fee.fees.annualFee,
                    }),
                ...(fee.fees &&
                    fee.fees.otherFee !== undefined && {
                        otherFee: fee.fees.otherFee,
                    }),
            },
        };

        const updatedFeeGroup = await FeeGroup.findByIdAndUpdate(
            fee.feeGroupId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedFeeGroup) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Fee group not found."));
        }

        await Class.updateMany(
            { _id: updatedFeeGroup.class },
            { feeGroup: updatedFeeGroup._id },
            { new: true }
        );

        updatedFeeGroups.push(updatedFeeGroup);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedFeeGroups, "Fee groups updated."));
});

export const deleteFeeGroup = wrapAsync(async (req, res, next) => {
    const { feeGroupIds } = req.body;

    if (!feeGroupIds || !Array.isArray(feeGroupIds)) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    "Fee group IDs are required and must be an array."
                )
            );
    }

    const deletedFeeGroups = await FeeGroup.deleteMany({
        _id: { $in: feeGroupIds },
    });

    if (!deletedFeeGroups.deletedCount) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Fee groups not found."));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Fee groups deleted."));
});

export const getFeeGroups = wrapAsync(async (req, res, next) => {
    const feeGroups = await FeeGroup.find().populate("class");

    return res
        .status(200)
        .json(new ApiResponse(200, feeGroups, "Fee groups fetched."));
});

export const getFeeGroupById = wrapAsync(async (req, res, next) => {
    const { feeGroupId } = req.params;

    const feeGroup = await FeeGroup.findById(feeGroupId).populate("class");

    if (!feeGroup) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Fee group not found."));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, feeGroup, "Fee group fetched."));
});

const manageInstallmentForClass = async (classId, installment, dueDate) => {
    let feeGroup = await FeeGroup.findOne({ class: classId });
    if (!feeGroup) {
        res.status(404).json(
            new ApiResponse(404, null, "Fee group not found.")
        );
    }

    const existingInstallment = feeGroup.installmentDates.find(
        (inst) => inst.month === installment
    );

    if (existingInstallment) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    "Installment already exists for this class."
                )
            );
    } else {
        feeGroup.installmentDates.push({ month: installment, dueDate });
    }

    feeGroup = await feeGroup.save();
    return feeGroup;
};

export const addInstallmentToAllClasses = async (installment, dueDate) => {
    const feeGroups = await FeeGroup.find();

    const updatedFeeGroups = [];
    for (const feeGroup of feeGroups) {
        const existingInstallment = feeGroup.installmentDates.find(
            (inst) => inst.month === installment
        );

        if (!existingInstallment) {
            feeGroup.installmentDates.push({ month: installment, dueDate });
            await feeGroup.save();
            updatedFeeGroups.push(feeGroup);
        }
    }

    return updatedFeeGroups;
};

export const manageInstallment = wrapAsync(async (req, res, next) => {
    const { classId, installment, dueDate } = req.body;

    if (!installment || !dueDate) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    "Installment name and due date are required."
                )
            );
    }

    try {
        let result;
        if (classId) {
            result = await manageInstallmentForClass(
                classId,
                installment,
                dueDate
            );
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        result,
                        "Installment managed for the specified class."
                    )
                );
        } else {
            result = await addInstallmentToAllClasses(installment, dueDate);
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        result,
                        "Installment added to all classes successfully."
                    )
                );
        }
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse(
                    500,
                    null,
                    error.message || "Failed to manage the installment."
                )
            );
    }
});

export const deleteInstallment = wrapAsync(async (req, res, next) => {
    const { classId, installmentId, month, dueDate } = req.body;

    if (!installmentId && (!month || !dueDate)) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    "Either Installment ID or both month and due date are required."
                )
            );
    }

    try {
        let result;
        if (classId) {
            result = await deleteInstallmentForClass(classId, installmentId);
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        result,
                        "Installment deleted for the specified class."
                    )
                );
        } else {
            result = await deleteInstallmentFromAllClasses(month, dueDate);
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        result,
                        "Installment deleted from all classes successfully."
                    )
                );
        }
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse(
                    500,
                    null,
                    error.message || "Failed to delete the installment."
                )
            );
    }
});

export const deleteInstallmentForClass = async (classId, installmentId) => {
    return await FeeGroup.findOneAndUpdate(
        { class: classId },
        { $pull: { installmentDates: { _id: installmentId } } },
        { new: true }
    );
};

export const deleteInstallmentFromAllClasses = async (month, dueDate) => {
    return await FeeGroup.updateMany(
        {},
        {
            $pull: {
                installmentDates: { month: month, dueDate: new Date(dueDate) },
            },
        },
        { new: true }
    );
};

export const updateInstallment = wrapAsync(async (req, res, next) => {
    const { classId, installmentId, month, dueDate, existingMonth } = req.body;

    if (!month || !dueDate) {
        return res
            .status(400)
            .json(
                new ApiResponse(400, null, "Month and due date are required.")
            );
    }

    try {
        let result;
        if (classId && installmentId) {
            result = await updateInstallmentForClass(
                classId,
                installmentId,
                month,
                dueDate
            );
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        result,
                        "Installment updated for the specified class."
                    )
                );
        } else if (existingMonth) {
            result = await updateInstallmentForAllClasses(
                existingMonth,
                month,
                dueDate
            );
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        result,
                        "Installment updated for all classes successfully."
                    )
                );
        } else {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        null,
                        "Either classId and installmentId, or existingMonth are required."
                    )
                );
        }
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse(
                    500,
                    null,
                    error.message || "Failed to update the installment."
                )
            );
    }
});

const updateInstallmentForClass = async (
    classId,
    installmentId,
    month,
    dueDate
) => {
    return await FeeGroup.findOneAndUpdate(
        { class: classId, "installmentDates._id": installmentId },
        {
            $set: {
                "installmentDates.$.month": month,
                "installmentDates.$.dueDate": new Date(dueDate),
            },
        },
        { new: true }
    );
};

const updateInstallmentForAllClasses = async (
    existingMonth,
    newMonth,
    dueDate
) => {
    return await FeeGroup.updateMany(
        { "installmentDates.month": existingMonth },
        {
            $set: {
                "installmentDates.$.month": newMonth,
                "installmentDates.$.dueDate": new Date(dueDate),
            },
        },
        { new: true }
    );
};

export const getInstallments = wrapAsync(async (req, res, next) => {
    const feeGroups = await FeeGroup.find().populate("class");
    const installments = feeGroups.map((group) => {
        return {
            class: group.class,
            installments: group.installmentDates,
        };
    });

    return res
        .status(200)
        .json(new ApiResponse(200, installments, "Installments fetched."));
});

export const getInstallmentById = wrapAsync(async (req, res, next) => {
    const { installmentId } = req.params;

    const feeGroups = await FeeGroup.find().populate("class");

    let foundInstallment = null;

    for (const group of feeGroups) {
        const installment = group.installmentDates.find(
            (inst) => inst._id.toString() === installmentId
        );

        if (installment) {
            foundInstallment = {
                class: group.class,
                installment,
            };
            break;
        }
    }

    if (!foundInstallment) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Installment not found."));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, foundInstallment, "Installment fetched."));
});
