import { Subject } from "../models/subject.Model.js";
import wrapAsync from "../utils/wrapAsync.js";
import { subjectSchema } from "../Validation/subject.Validation.js"; // Import the Joi validation schema

// Validate the subject data
const validateSubject = async (data) => {
    const { error } = await subjectSchema.validateAsync(data);
    if (error) {
        throw new Error(error.details[0].message);
    }
};

// Create a new subject
export const createSubject = wrapAsync(async (req, res) => {
    await validateSubject(req.body); // Validate incoming data
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
});

// Get all subjects
export const getAllSubjects = wrapAsync(async (req, res) => {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
});

// Get subject by ID
export const getSubjectById = wrapAsync(async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.status(200).json(subject);
});

// Update subject
export const updateSubject = wrapAsync(async (req, res) => {
    await validateSubject(req.body); // Validate incoming data
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.status(200).json(subject);
});

// Delete subject
export const deleteSubject = wrapAsync(async (req, res) => {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.status(204).json({ message: "Subject Delete Sucessfully" });
});

// Get subjects by status
export const getSubjectsByStatus = wrapAsync(async (req, res) => {
    const status = req.params.status;

    const subjects = await Subject.find({
        status: { $regex: new RegExp(`^${status}$`, "i") }, // Case-insensitive regex
    });

    res.status(200).json(subjects);
});

// count Total subject

export const getSubjectCount = wrapAsync(async (req, res) => {
    const count = await Subject.countDocuments();
    res.status(200).json({ count });
});

// Subject Active/Inactive by id
export const toggleSubjectStatus = wrapAsync(async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    subject.status = subject.status === "Active" ? "Inactive" : "Active"; // Toggle logic
    await subject.save();

    res.status(200).json(subject);
});
