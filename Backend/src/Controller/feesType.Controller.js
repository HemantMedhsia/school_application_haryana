import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { FeesType } from "../Models/feesType.Model.js";
import { validateFeesType } from "../Validation/feesType.Validation.js";

export const createFeesType = wrapAsync(async (req, res, next) => {
    const { error } = validateFeesType(req.body);
    if (error) {
        return next(new ApiError(400, error.details[0].message));
    }

    const feesType = new FeesType(req.body);
    await feesType.save();

    return res
        .status(201)
        .json(new ApiResponse(201, feesType, "Fees type created successfully"));
});

export const getAllFeesTypes = wrapAsync(async (req, res, next) => {
    const feesTypes = await FeesType.find();

    if (!feesTypes.length) {
        return next(new ApiError(404, "No Fees types found"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, feesTypes, "Fees types retrieved successfully")
        );
});

export const getFeesTypeById = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const feesType = await FeesType.findById(id);

    if (!feesType) {
        return next(new ApiError(404, "Fees type not found"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, feesType, "Fees type retrieved successfully")
        );
});

export const updateFeesType = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const { error } = validateFeesType(req.body);
    if (error) {
        return next(new ApiError(400, error.details[0].message));
    }

    const feesType = await FeesType.findByIdAndUpdate(id, req.body, {
        new: true,
    });

    if (!feesType) {
        return next(new ApiError(404, "Fees type not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, feesType, "Fees type updated successfully"));
});

export const deleteFeesType = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const feesType = await FeesType.findByIdAndDelete(id);

    if (!feesType) {
        return next(new ApiError(404, "Fees type not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Fees type deleted successfully"));
});

