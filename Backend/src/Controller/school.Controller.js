import { School } from "../Models/school.model.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { schoolValidationSchema } from "../Validation/school.Validation.js";

export const createSchool = wrapAsync(async (req, res) => {
    await schoolValidationSchema.validateAsync(req.body);
    try {
        const school = new School(req.body);
        await school.save();
        res.status(201).json({
            success: true,
            data: school,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const getSchools = wrapAsync(async (req, res) => {
    try {
        const schools = await School.find().populate(
            "students teachers subjects workingStaffs notices"
        );
        res.status(200).json({
            success: true,
            data: schools,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const getSchool = wrapAsync(async (req, res) => {
    try {
        const school = await School.findById(req.params.id).populate(
            "students teachers subjects workingStaffs notices"
        );
        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found",
            });
        }
        res.status(200).json({
            success: true,
            data: school,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const deleteSchool = wrapAsync(async (req, res) => {
    try {
        const school = await School.findByIdAndDelete(req.params.id);
        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "School deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
