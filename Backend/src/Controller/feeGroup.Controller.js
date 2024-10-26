import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { FeeGroup } from "../Models/feeGroup.Model.js";
import { feeGroupValidationSchema } from "../Validation/feeGroup.Validation.js";

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

    const existingClasses = await FeeGroup.find({
        class: { $in: feeData.map((fee) => fee.class) },
    });

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

    return res
        .status(201)
        .json(new ApiResponse(201, "Fee groups created.", createdFeeGroups));
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


