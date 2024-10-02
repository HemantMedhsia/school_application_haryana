import { Complaint } from "../Models/complaint.Model.js";
import { Student } from "../Models/student.model.js";
import { Teacher } from "../Models/teacher.model.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { complaintValidationSchema } from "../Validation/complaint.Validation.js";

export const createComplaint = wrapAsync(async (req, res) => {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    const teacher = await Teacher.findById(req.params.teacherId);
    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }

    const complaintData = {
        createdBy: teacher._id.toString(),
        ...req.body,
    };
    await complaintValidationSchema.validateAsync(complaintData);
    const complaint = await Complaint.create(complaintData);
    student.complaints.push(complaint._id);
    await student.save();
    return res.status(201).json(new ApiResponse(201, complaint));
});

export const updateComplaint = wrapAsync(async (req, res) => {
    const complaint = await Complaint.findByIdAndUpdate(
        req.params.complaintId,
        req.body,
        { new: true }
    );
    if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
    }

    return res.status(200).json(new ApiResponse(200, complaint));
});

export const deleteComplaint = wrapAsync(async (req, res) => {
    const complaint = await Complaint.findByIdAndDelete(req.params.complaintId);
    if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
    }
    return res
        .status(200)
        .json(new ApiResponse(200, complaint, "Complaint Delete Successfully"));
});

export const getComplaintById = wrapAsync(async (req, res) => {
    const complaint = await Complaint.findById(req.params.complaintId);
    if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
    }
    return res.status(200).json(new ApiResponse(200, complaint));
});

export const getComplaints = wrapAsync(async (req, res) => {
    const complaints = await Complaint.find();
    return res.status(200).json(new ApiResponse(200, complaints));
});

export const getComplaintsByStudent = wrapAsync(async (req, res) => {
    const student = await Student.findById(req.user.id).populate("complaints");
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    return res.status(200).json(new ApiResponse(200, student.complaints));
});

export const getComplaintsByStudentByParentId = wrapAsync(async (req, res) => {
    const student = await Student.findOne({ parent: req.user.id }).populate(
        "complaints"
    );
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    return res.status(200).json(new ApiResponse(200, student.complaints));
});


export const getComplaintsByStatus = wrapAsync(async (req, res) => {
    const complaints = await Complaint.find({ status: req.params.status });
    return res.status(200).json(new ApiResponse(200, complaints));
});

export const getComplaintsByCategory = wrapAsync(async (req, res) => {
    const complaints = await Complaint.find({ category: req.params.category });
    return res.status(200).json(new ApiResponse(200, complaints));
});

export const getComplaintsByTeacherAndStatus = wrapAsync(async (req, res) => {
    const complaints = await Complaint.find({
        createdBy: req.params.teacherId,
        status: req.params.status,
    });
    return res.status(200).json(new ApiResponse(200, complaints));
});
