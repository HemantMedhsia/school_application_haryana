import { FeesMaster } from "../Models/feesMaster.Model.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";

export const createFeesMaster = wrapAsync(async (req, res, next) => {
    const { error } = feesMasterValidationSchema.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, error.details[0].message));
    }

    const newFeesMaster = new FeesMaster(req.body);
    await newFeesMaster.save();
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newFeesMaster,
                "FeesMaster record created successfully"
            )
        );
});

export const getAllFeesMasters = wrapAsync(async (req, res, next) => {
    const feesMasters = await FeesMaster.find().populate(
        "feesGroup feesDetails.feesType"
    );
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                feesMasters,
                "FeesMaster records fetched successfully"
            )
        );
});

export const getFeesMasterById = wrapAsync(async (req, res, next) => {
    const feesMaster = await FeesMaster.findById(req.params.id).populate(
        "feesGroup feesDetails.feesType"
    );
    if (!feesMaster) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "FeesMaster record not found"));
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                feesMaster,
                "FeesMaster record fetched successfully"
            )
        );
});

export const updateFeesMaster = wrapAsync(async (req, res, next) => {
    const { error } = feesMasterValidationSchema.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, error.details[0].message));
    }

    const updatedFeesMaster = await FeesMaster.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).populate("feesGroup feesDetails.feesType");
    if (!updatedFeesMaster) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "FeesMaster record not found"));
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedFeesMaster,
                "FeesMaster record updated successfully"
            )
        );
});

export const deleteFeesMaster = wrapAsync(async (req, res, next) => {
    const deletedFeesMaster = await FeesMaster.findByIdAndDelete(req.params.id);
    if (!deletedFeesMaster) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "FeesMaster record not found"));
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, null, "FeesMaster record deleted successfully")
        );
});
