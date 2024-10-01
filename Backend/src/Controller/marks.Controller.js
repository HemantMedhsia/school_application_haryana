import { Marks } from "../Models/marks.Model.js";
import { Student } from "../Models/student.model.js";
import { Teacher } from "../Models/teacher.model.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { markValidationSchema } from "../Validation/marks.Validation.js";
import { SingleSubjectMark } from "../Models/singleSubjectMark.Model.js";

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
    return res.status(201).json(new ApiResponse(201, marks));
});

export const getMarks = wrapAsync(async (req, res) => {
    const marks = await Marks.find();
    return res.status(200).json(new ApiResponse(200, marks));
});

export const getMarksById = wrapAsync(async (req, res) => {
    const marks = await Marks.findById(req.params.id);
    if (!marks) {
        return res.status(404).json({ message: "Marks not found" });
    }
    return res.status(200).json(new ApiResponse(200, marks));
});

export const updateMarks = wrapAsync(async (req, res) => {
    const marks = await Marks.findById(req.params.id);
    if (!marks) {
        return res.status(404).json({ message: "Marks not found" });
    }

    const singleSubjectMarksId = marks.subjectMarks[0];

    const subjectMarks =await SingleSubjectMark.findByIdAndUpdate(
        singleSubjectMarksId,
        req.body,
        { new: true }
    );

    if (!subjectMarks) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Marks not found", false));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subjectMarks,
                "Marks Updated Sucessfully",
                true
            )
        );
    // const marksData = {
    //     ...req.body,
    // };
    // // await markValidationSchema.validateAsync(marksData);
    // Object.assign(marks, marksData);
    // await marks.save();
    // return res.status(200).json(new ApiResponse(200, marks));
});

export const deleteMarks = wrapAsync(async (req, res) => {
    const marks = await Marks.findByIdAndDelete(req.params.id);
    if (!marks) {
        return res.status(404).json({ message: "Marks not found" });
    }
    return res
        .status(200)
        .json(new ApiResponse(200, marks, "Marks deleted successfully"));
});

export const getMarksByStudentId = wrapAsync(async (req, res) => {
    const marks = await Marks.find({ studentId: req.params.studentId });
    return res.status(200).json(new ApiResponse(200, marks));
});

export const getMarksByTeacherId = wrapAsync(async (req, res) => {
    const marks = await Marks.find({ teacherId: req.params.teacherId });
    return res.status(200).json(new ApiResponse(200, marks));
});

export const getMarksByExamType = wrapAsync(async (req, res) => {
    const marks = await Marks.find({ examType: req.params.examType });
    return res.status(200).json(new ApiResponse(200, marks));
});

export const getMarksByDivision = wrapAsync(async (req, res) => {
    const marks = await Marks.find({ division: req.params.division });
    return res.status(200).json(new ApiResponse(200, marks));
});

export const getMarksByRank = wrapAsync(async (req, res) => {
    const marks = await Marks.find({ rank: req.params.rank });
    return res.status(200).json(new ApiResponse(200, marks));
});


