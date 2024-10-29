import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { FeeGroup } from "../Models/feeGroup.Model.js";
import { Class } from "../Models/class.Model.js";
import { feeGroupValidationSchema } from "../Validation/feeGroup.Validation.js";
import { Student } from "../Models/student.model.js";
import { StudentFee } from "../Models/studentFees.Model.js";

// export const addFeeGroup = wrapAsync(async (req, res, next) => {
//     const { feeData } = req.body;

//     if (!feeData || !Array.isArray(feeData)) {
//         return res
//             .status(400)
//             .json(
//                 new ApiResponse(
//                     400,
//                     "Fee data is required and must be an array."
//                 )
//             );
//     }

//     for (let fee of feeData) {
//         const { error } = feeGroupValidationSchema.validate(fee);
//         if (error) {
//             return res
//                 .status(400)
//                 .json(
//                     new ApiResponse(
//                         400,
//                         `Validation error for fee group: ${error.details[0].message}`
//                     )
//                 );
//         }
//     }

//     const existingClasses = await FeeGroup.find({
//         class: { $in: feeData.map((fee) => fee.class) },
//     });

//     if (existingClasses.length > 0) {
//         const existingClassNames = existingClasses
//             .map((group) => group.class)
//             .join(", ");
//         return res
//             .status(400)
//             .json(
//                 new ApiResponse(
//                     400,
//                     `Fee group already exists for the following class(es): ${existingClassNames}`
//                 )
//             );
//     }

//     const feeGroupData = feeData.map((fee) => ({
//         class: fee.class,
//         fees: {
//             tuitionFee: fee.fees.tuitionFee || 0,
//             admissionFee: fee.fees.admissionFee || 0,
//             annualFee: fee.fees.annualFee || 0,
//             otherFee: fee.fees.otherFee || 0,
//         },
//     }));

//     const createdFeeGroups = await FeeGroup.insertMany(feeGroupData);
//     for (let fee of feeData) {
//         await Class.findByIdAndUpdate(
//             fee.class,
//             {
//                 feeGroup: createdFeeGroups.find((group) =>
//                     group.class.equals(fee.class)
//                 )._id,
//             },
//             { new: true }
//         );
//     }

//     return res
//         .status(201)
//         .json(new ApiResponse(201, "Fee groups created.", createdFeeGroups));
// });

export const addFeeGroup = wrapAsync(async (req, res, next) => {
    const { feeData } = req.body;

    if (!feeData || !Array.isArray(feeData)) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    "Fee data is required and must be an array."
                )
            );
    }

    // Validate Fee Data
    for (let fee of feeData) {
        const { error } = feeGroupValidationSchema.validate(fee);
        if (error) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        `Validation error for fee group: ${error.details[0].message}`
                    )
                );
        }
    }

    // Check for Existing Classes
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
                    `Fee group already exists for the following class(es): ${existingClassNames}`
                )
            );
    }

    // Create Fee Groups
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

    // Assign Fees to Students in Each Class
    for (let feeGroup of createdFeeGroups) {
        // Find All Students in the Class
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

            // Insert Student Fees
            const insertedStudentFees = await StudentFee.insertMany(
                studentFees
            );

            // Update Student Documents with the Newly Created Fee References
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

        // Assign Fee Group to Class (Optional)
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
                "Fee groups created and assigned to students successfully.",
                createdFeeGroups
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
                        "Fee group ID is required for updating."
                    )
                );
        }

        const updateData = {
            class: fee.class,
            fees: {
                tuitionFee:
                    fee.fees && fee.fees.tuitionFee !== undefined
                        ? fee.fees.tuitionFee
                        : 0,
                admissionFee:
                    fee.fees && fee.fees.admissionFee !== undefined
                        ? fee.fees.admissionFee
                        : 0,
                annualFee:
                    fee.fees && fee.fees.annualFee !== undefined
                        ? fee.fees.annualFee
                        : 0,
                otherFee:
                    fee.fees && fee.fees.otherFee !== undefined
                        ? fee.fees.otherFee
                        : 0,
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
                .json(new ApiResponse(404, "Fee group not found."));
        }

        await Class.findByIdAndUpdate(
            updatedFeeGroup.class,
            { feeGroup: updatedFeeGroup._id },
            { new: true }
        );

        updatedFeeGroups.push(updatedFeeGroup);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Fee groups updated.", updatedFeeGroups));
});

export const deleteFeeGroup = wrapAsync(async (req, res, next) => {
    const { feeGroupIds } = req.body;

    if (!feeGroupIds || !Array.isArray(feeGroupIds)) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
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
            .json(new ApiResponse(404, "Fee groups not found."));
    }

    return res.status(200).json(new ApiResponse(200, "Fee groups deleted."));
});

export const getFeeGroups = wrapAsync(async (req, res, next) => {
    const feeGroups = await FeeGroup.find().populate("class");

    return res
        .status(200)
        .json(new ApiResponse(200, "Fee groups fetched.", feeGroups));
});

export const getFeeGroupById = wrapAsync(async (req, res, next) => {
    const { feeGroupId } = req.params;

    const feeGroup = await FeeGroup.findById(feeGroupId).populate("class");

    if (!feeGroup) {
        return res
            .status(404)
            .json(new ApiResponse(404, "Fee group not found."));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Fee group fetched.", feeGroup));
});

const manageInstallmentForClass = async (classId, installment, dueDate) => {
    let feeGroup = await FeeGroup.findOne({ class: classId });
    if (!feeGroup) {
        throw new ApiError(404, "No fee group found for the specified class.");
    }

    const existingInstallment = feeGroup.installmentDates.find(
        (inst) => inst.month === installment
    );

    if (existingInstallment) {
        throw new ApiError(400, "Installment already exists for this class.");
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
                        "Installment managed for the specified class.",
                        result
                    )
                );
        } else {
            result = await addInstallmentToAllClasses(installment, dueDate);
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "Installment added to all classes successfully.",
                        result
                    )
                );
        }
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse(
                    500,
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
                        "Installment deleted for the specified class.",
                        result
                    )
                );
        } else {
            result = await deleteInstallmentFromAllClasses(month, dueDate);
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "Installment deleted from all classes successfully.",
                        result
                    )
                );
        }
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse(
                    500,
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
            .json(new ApiResponse(400, "Month and due date are required."));
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
                        "Installment updated for the specified class.",
                        result
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
                        "Installment updated for all classes successfully.",
                        result
                    )
                );
        } else {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
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

    // Fetch all fee groups and populate the class
    const feeGroups = await FeeGroup.find().populate("class");

    let foundInstallment = null;

    // Iterate through each fee group to find the installment
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
            .json(new ApiResponse(404, "Installment not found."));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Installment fetched.", foundInstallment));
});
