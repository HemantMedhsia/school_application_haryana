import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import { ExamType } from "../Models/examType.Model.js";

export const createExamType = wrapAsync(async (req, res) => {
    const { name, termId, maxMarks, minMarks } = req.body;
    const existingExamType = await ExamType.findOne({ name });
    if (existingExamType) {
        throw new ApiError(409, "Exam Type already exists");
    }
    const newExamType = new ExamType({
        name,
        term: termId,
        maxMarks,
        minMarks,
    });
    await newExamType.save();
    return res
        .status(201)
        .json(
            new ApiResponse(201, newExamType, "Exam Type added successfully")
        );
});

export const getExamTypes = wrapAsync(async (req, res) => {
    const examTypes = await ExamType.find().populate("term");
    return res
        .status(200)
        .json(
            new ApiResponse(200, examTypes, "Exam Types fetched successfully")
        );
});

export const getExamTypeById = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const examType = await ExamType.findById(id).populate("term");
    if (!examType) {
        throw new ApiError(404, "Exam Type not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, examType, "Exam Type fetched successfully"));
});

export const deleteExamType = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const examType = await ExamType.findByIdAndDelete(id);
    if (!examType) {
        throw new ApiError(404, "Exam Type not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Exam Type deleted successfully"));
});

export const updateExamType = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { name, termId, maxMarks, minMarks } = req.body;
    const examType = await ExamType.findByIdAndUpdate(
        id,
        { name, term: termId, maxMarks, minMarks },
        { new: true }
    );
    if (!examType) {
        throw new ApiError(404, "Exam Type not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, examType, "Exam Type updated successfully"));
});

export const getExamTypesByTerm = wrapAsync(async (req, res) => {
    const { termId } = req.params;
    const examTypes = await ExamType.find({ term: termId }).populate("term");
    if (!examTypes || examTypes.length === 0) {
        throw new ApiError(404, "Exam Types not found");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, examTypes, "Exam Types fetched successfully")
        );
});

export const getMaxMarkByexamType = wrapAsync(async (req, res) => {
    const { examTypeId } = req.params;
    const examType = await ExamType.findById(examTypeId);
    const maxMarks = examType.maxMarks;
    if (!examType) {
        throw new ApiError(404, "Exam Type not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { maxMark: maxMarks }, "Max Marks fetched successfully"));
});
