import { Marks } from "../Models/marks.Model.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import { Student } from "../Models/student.model.js";

export const getClassResults = async (req, res) => {
    const { classId, termId } = req.body;

    const classResults = await Marks.calculateClassResults(classId, termId);

    return res.json(classResults);
};

export const getStudentResult = async (req, res) => {
    const { studentId, termId, classId } = req.body;
    const studentMarks = await Marks.findOne({ student: studentId, term: termId, class: classId })
        .populate("student")
        .populate("class")
        .populate("marks.subject")
        .populate("marks.exams.examType");

    if (!studentMarks) {
        return res.status(404).json({ message: "Marks not found for the student" });
    }

    await studentMarks.calculateTotalMarks();

    res.json(studentMarks);
};


