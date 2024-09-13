import { School } from "../Models/school.model.js";
import { Subject } from "../Models/subject.Model.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { Admin } from "../Models/admin.Model.js";
import { subjectSchema } from "../Validation/subject.Validation.js"; 
import { ApiResponse } from "../Utils/responseHandler.js";

const validateSubject = async (data) => {
    const { error } = await subjectSchema.validateAsync(data);
    if (error) {
        throw new Error(error.details[0].message);
    }
};

export const createSubject = wrapAsync(async (req, res) => {
    const { schoolId } = req.params;

    const schoolExists = await School.findById(schoolId);
    if (!schoolExists) {
        return res.status(404).json({ message: "School not found" });
    }

    await validateSubject(req.body);

    const savedSubject = await new Subject(req.body).save();

    await schoolExists.updateOne({ $push: { subjects: savedSubject._id } });

    return res
        .status(201)
        .json(
            new ApiResponse(201, savedSubject, "Subject Created Successfully")
        );
});

// Get all subjects
export const getAllSubjects = wrapAsync(async (req, res) => {
    const subjects = await Subject.find();
    return res.status(200).json(new ApiResponse(200, subjects));
});

// Get subject by ID
export const getSubjectById = wrapAsync(async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    return res.status(200).json(new ApiResponse(200, subject));
});

// Update subject
export const updateSubject = wrapAsync(async (req, res) => {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    return res
        .status(200)
        .json(new ApiResponse(200, subject, "Subject Update Successfully"));
});

// Delete subject
export const deleteSubject = wrapAsync(async (req, res) => {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    return res
        .status(200)
        .json(new ApiResponse(200, subject, "Subject Deleted Successfully"));
});

// Get subjects by status
export const getSubjectsByStatus = wrapAsync(async (req, res) => {
    const status = req.params.status;

    const subjects = await Subject.find({
        status: { $regex: new RegExp(`^${status}$`, "i") }, 
    });
    return res.status(200).json(new ApiResponse(200, subjects));
});

// count Total subject

export const getSubjectCount = wrapAsync(async (req, res) => {
    const count = await Subject.countDocuments();
    return res.status(200).json(new ApiResponse(200, count));
});

// Subject Active/Inactive by id
export const toggleSubjectStatus = wrapAsync(async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    subject.status = subject.status === "Active" ? "Inactive" : "Active"; // Toggle logic
    await subject.save();
    return res.status(200).json(new ApiResponse(200, subject));
});
