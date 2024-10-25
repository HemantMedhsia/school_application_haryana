import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { FeesGroup } from "../Models/feesGroup.Model.js";

export const createFeesGroup = wrapAsync(async (req, res, next) => {
    const { name, description } = req.body;
    const feesGroup = new FeesGroup({
        name,
        description,
    });
    await feesGroup.save();
    return res
        .status(201)
        .json(
            new ApiResponse(201, feesGroup, "Fees Group created successfully")
        );
});

export const getAllFeesGroups = wrapAsync(async (req, res, next) => {
    const feesGroups = await FeesGroup.find();

    if (!feesGroups.length) {
        return next(new ApiError(404, "No Fees groups found"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                feesGroups,
                "Fees groups retrieved successfully"
            )
        );
});

export const getFeesGroupById = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const feesGroup = await FeesGroup.findById(id);

    if (!feesGroup) {
        return next(new ApiError(404, "Fees group not found"));
    }
    a;
    return res
        .status(200)
        .json(
            new ApiResponse(200, feesGroup, "Fees group retrieved successfully")
        );
});

export const updateFeesGroup = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const feesGroup = await FeesGroup.findByIdAndUpdate(id, req.body, {
        new: true,
    });

    if (!feesGroup) {
        return next(new ApiError(404, "Fees group not found"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, feesGroup, "Fees group updated successfully")
        );
});

export const deleteFeesGroup = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const feesGroup = await FeesGroup.findByIdAndDelete(id);
    if (!feesGroup) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Fees group not found"));
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, feesGroup, "Fees group deleted successfully")
        );
});
