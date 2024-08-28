import Marks from "../Models/marks.Model.js";
import { Student } from "../Models/student.model.js";
import { Teacher } from "../Models/teacher.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import { markValidationSchema } from "../Validation/marks.Validation.js";

export const createMarks = wrapAsync(async (req, res) => {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }

    const marksData = {
        studentId: student._id.toString(),
        teacherId: teacher._id.toString(),
        ...req.body,
    };
    await markValidationSchema.validateAsync(marksData);
    const marks = await Marks.create(marksData);
    student.marks.push(marks._id);
    await student.save();
    res.status(201).json({ marks });
});

export const getMarks = wrapAsync(async (req, res) => {
    const marks = await Marks.find();
    res.status(200).json({ marks });
});

export const getMarksById = wrapAsync(async (req, res) => {
    const marks = await Marks.findById(req.params.id);
    if (!marks) {
        return res.status(404).json({ message: "Marks not found" });
    }
    res.status(200).json({ marks });
});

export const updateMarks = wrapAsync(async (req, res) => {
    const marks = await Marks.findById(req.params.id);
    if (!marks) {
        return res.status(404).json({ message: "Marks not found" });
    }
    const marksData = {
        ...req.body,
    };
    await markValidationSchema.validateAsync(marksData);
    Object.assign(marks, marksData);
    await marks.save();
    res.status(200).json({ marks });
});

export const deleteMarks = wrapAsync(async (req, res) => {
    const marks = await Marks.findByIdAndDelete(req.params.id);
    if (!marks) {
        return res.status(404).json({ message: "Marks not found" });
    }
    res.status(200).json({ message: "Marks deleted successfully" });
});

export const getMarksByStudentId = wrapAsync(async (req, res) => {
    const marks = await Marks.find({ studentId: req.params.studentId });
    res.status(200).json({ marks });
});

export const getMarksByTeacherId = wrapAsync(async (req, res) => {
    const marks = await Marks.find({ teacherId: req.params.teacherId });
    res.status(200).json({ marks });
});

export const getMarksByExamType = wrapAsync(async (req, res) => {
    const marks = await Marks.find({ examType: req.params.examType });
    res.status(200).json({ marks });
});

export const getMarksByDivision = wrapAsync(async (req, res) => {
    const marks = await Marks.find({ division: req.params.division });
    res.status(200).json({ marks });
});

export const getMarksByRank = wrapAsync(async (req, res) => {
    const marks = await Marks.find({ rank: req.params.rank });
    res.status(200).json({ marks });
});