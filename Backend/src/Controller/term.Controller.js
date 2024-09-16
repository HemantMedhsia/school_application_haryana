import { Term } from "../Models/term.Model.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { validateTerm } from "../Validation/term.Validation.js";
import { ApiError } from "../Utils/errorHandler.js";

export const createTerm = wrapAsync(async (req, res) => {
    const { error } = validateTerm.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, error.details[0].message));
    }
    const { name, startDate, endDate } = req.body;
    const existingTerm = await Term.findOne({ name });
    if (existingTerm) {
        return res
            .status(409)
            .json(new ApiResponse(409, null, "Term already exists."));
    }
    const newTerm = new Term({ name, startDate, endDate });
    await newTerm.save();
    return res
        .status(201)
        .json(new ApiResponse(201, newTerm, "Term added successfully"));
});

export const getTerms = wrapAsync(async (req, res) => {
    const terms = await Term.find();
    return res
        .status(200)
        .json(new ApiResponse(200, terms, "Terms fetched successfully"));
});

export const getTermById = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const term = await Term.findById(id);
    if (!term) {
        throw new ApiError(404, "Term not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, term, "Term fetched successfully"));
});

export const deleteTerm = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const term = await Term.findByIdAndDelete(id);
    if (!term) {
        throw new ApiError(404, "Term not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Term deleted successfully"));
});

export const updateTerm = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { name, startDate, endDate } = req.body;
    const term = await Term.findByIdAndUpdate(
        id,
        { name, startDate, endDate },
        { new: true }
    );
    if (!term) {
        throw new ApiError(404, "Term not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, term, "Term updated successfully"));
});
