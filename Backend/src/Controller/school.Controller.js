import { School } from "../Models/school.model.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { schoolValidationSchema } from "../Validation/school.Validation.js";

export const createSchool = wrapAsync(async (req, res) => {
    await schoolValidationSchema.validateAsync(req.body);
    const school = new School(req.body);
    await school.save();
    return res
        .status(201)
        .json(new ApiResponse(201, school, "School Created Successfully"));
});

export const getSchools = wrapAsync(async (req, res) => {
    const schools = await School.find().populate(
        "students teachers subjects workingStaffs notices"
    );
    return res.status(200).json(new ApiResponse(200, schools));
});

export const getSchool = wrapAsync(async (req, res) => {
    const school = await School.findById(req.params.id).populate(
        "students teachers subjects workingStaffs notices"
    );
    if (!school) {
        return res.status(404).json({
            success: false,
            message: "School not found",
        });
    }
    return res.status(200).json(new ApiResponse(200, school));
});

export const deleteSchool = wrapAsync(async (req, res) => {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
        return res.status(404).json({
            success: false,
            message: "School not found",
        });
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "School deleted successfully"));
});

export const updateSchool = wrapAsync(async (req, res) => {
    await schoolValidationSchema.validateAsync(req.body);
    const school = await School.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).populate("students teachers subjects workingStaffs notices");

    if (!school) {
        return res.status(404).json({
            success: false,
            message: "School not found",
        });
    }

    return res.status(200).json(new ApiResponse(200, school));
});
