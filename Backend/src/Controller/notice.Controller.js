import { Notice } from "../Models/notice.Model.js";
import mongoose from "mongoose";
import { noticeValidationSchema } from "../Validation/notice.Validation.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { School } from "../Models/school.model.js";
import { ApiResponse } from "../Utils/responseHandler.js";

// create a Notice
export const createNotice = wrapAsync(async (req, res) => {
    const school = await School.findById(req.params.schoolId);
    if (!school) {
        return res.status(404).json({ error: "School not found" });
    }

    const { error } = await noticeValidationSchema.validateAsync(req.body);
    if (error) {
        return res
            .status(400)
            .json({ errors: error.details.map((err) => err.message) });
    }

    req.body.schoolId = req.params.schoolId;
    req.body.createdBy = req.user.id; // Accessing the authenticated user's ID

    const notice = new Notice(req.body);
    const noticeData = await notice.save();

    school.notices.push(noticeData._id);
    await school.save();
    return res
        .status(201)
        .json(new ApiResponse(201, noticeData, "Notice Created Successfully"));
});

// Get All Notices
export const getAllNotices = wrapAsync(async (req, res) => {
    const notices = await Notice.find();
    return res.status(200).json(new ApiResponse(200, notices));
});

// Get a Single Notice
export const getNoticeById = wrapAsync(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid notice ID" });
    }

    const notice = await Notice.findById(id);
    if (!notice) {
        return res.status(404).json({ error: "Notice not found" });
    }
    return res.status(200).json(new ApiResponse(200, notice));
});

// Update a Notice
export const updateNotice = wrapAsync(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid notice ID" });
    }

    const updatedNotice = await Notice.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedNotice) {
        return res.status(404).json({ error: "Notice not found" });
    }
    return res
        .status(200)
        .json(new ApiResponse(200, updatedNotice, "Updated Notice Successfully"));
});

// Delete a Notice
export const deleteNotice = wrapAsync(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid notice ID" });
    }

    const deletedNotice = await Notice.findByIdAndDelete(id);
    if (!deletedNotice) {
        return res.status(404).json({ error: "Notice not found" });
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, deleteNotice, "Notice is Deleted Sucessfully")
        );
});

// Get Notices by Audience
export const getNoticesByAudience = wrapAsync(async (req, res) => {
    const { audience } = req.params;
    const notices = await Notice.find({
        audience: { $regex: new RegExp(`^${audience}$`, "i") },
    });
    return res.status(200).json(new ApiResponse(200, notices));
});

// Get Notices by Category
export const getNoticesByCategory = wrapAsync(async (req, res) => {
    const { category } = req.params;
    const notices = await Notice.find({
        category: { $regex: new RegExp(`^${category}$`, "i") },
    });
    return res.status(200).json(new ApiResponse(200, notices));
});

// Get Notices for a Specific School
export const getNoticesForSchool = wrapAsync(async (req, res) => {
    const { schoolId } = req.params;
    const notices = await Notice.find({ schoolId });
    return res.status(200).json(new ApiResponse(200, notices));
});
