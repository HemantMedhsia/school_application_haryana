import { FessDiscount } from "../Models/fessDiscount.Model.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { validateFeesDiscount } from "../Validation/fees.Validation.js";
import { Student } from "../Models/student.model.js";

export const createFeesDiscount = wrapAsync(async (req, res, next) => {
    const {
        name,
        discountCode,
        description,
        discountType,
        percentageValue,
        fixAmountValue,
    } = req.body;

    const { error } = validateFeesDiscount(req.body);
    if (error) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, error.details[0].message));
    }

    const existingFeesDiscount = await FessDiscount.findOne({ discountCode });
    if (existingFeesDiscount) {
        return res
            .status(409)
            .json(new ApiResponse(409, null, "Fees Discount already exists."));
    }

    const newFeesDiscount = new FessDiscount({
        name,
        discountCode,
        description,
        discountType,
        percentageValue,
        fixAmountValue,
    });

    await newFeesDiscount.save();

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newFeesDiscount,
                "Fees Discount added successfully"
            )
        );
});

export const getFeesDiscount = wrapAsync(async (req, res, next) => {
    const feesDiscount = await FessDiscount.find();

    if (!feesDiscount) {
        return next(new ApiError(404, "No Fees Discount found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, feesDiscount, "Fees Discount found"));
});

export const getFeesDiscountById = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const feesDiscount = await FessDiscount.findById(id);

    if (!feesDiscount) {
        return next(new ApiError(404, "Fees Discount not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, feesDiscount, "Fees Discount found"));
});

export const updateFeesDiscount = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const {
        name,
        discountCode,
        description,
        discountType,
        percentageValue,
        fixAmountValue,
    } = req.body;

    const { error } = validateFeesDiscount(req.body);
    if (error) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, error.details[0].message));
    }

    const existingFeesDiscount = await FessDiscount.findById(id);
    if (!existingFeesDiscount) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Fees Discount not found"));
    }

    existingFeesDiscount.name = name;
    existingFeesDiscount.discountCode = discountCode;
    existingFeesDiscount.description = description;
    existingFeesDiscount.discountType = discountType;
    existingFeesDiscount.percentageValue = percentageValue;
    existingFeesDiscount.fixAmountValue = fixAmountValue;

    await existingFeesDiscount.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                existingFeesDiscount,
                "Fees Discount updated successfully"
            )
        );
});

export const deleteFeesDiscount = wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const feesDiscount = await FessDiscount.findByIdAndDelete(id);

    if (!feesDiscount) {
        return next(new ApiError(404, "Fees Discount not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Fees Discount deleted successfully"));
});

export const assignDiscountToStudent = wrapAsync(async (req, res) => {
    const { classId, sectionId, discountId, category, gender } = req.body;

    const discount = await FessDiscount.findById(discountId);
    if (!discount) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Fees Discount not found"));
    }

    const students = await Student.find({
        currentClass: classId,
        currentSection: sectionId,
        category: category,
        gender: gender,
    });

    if (Student.length === 0) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "No student found"));
    }

    for (let student of students) {
        student.discount = discountId;
        await student.save();
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                `Fees Discount assigned to ${students.length} students successfully`
            )
        );
});

export const getDiscountedStudentsByDiscountId = wrapAsync(
    async (req, res, next) => {
        const { id } = req.params;
        const students = await Student.find({ discount: id })
            .select("firstName lastName _id currentClass currentSection")
            .populate("currentClass", "name")
            .populate("currentSection", "name");

        if (students.length === 0) {
            return next(new ApiError(404, "No student found"));
        }

        const formattedStudents = students.map((student) => ({
            _id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            Class: student.currentClass.name,
            Section: student.currentSection.name,
        }));

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    formattedStudents,
                    `${students.length} students found with discount`
                )
            );
    }
);
