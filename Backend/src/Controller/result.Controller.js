import { Marks } from "../Models/marks.Model.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import { Student } from "../Models/student.model.js";

export const getAllClassStudentMarks = wrapAsync(async (req, res) => {
    const { classId, termId } = req.body;

    const marks = await Marks.find({ class: classId, term: termId })
        .populate("student")
        .populate("marks.subject")
        .populate("marks.exams.examType");

    if (!marks || marks.length === 0) {
        return res
            .status(404)
            .json({ message: "No marks found for this class and term." });
    }

    res.status(200).json(new ApiResponse(200, marks));
});

export const getResultByStudent = wrapAsync(async (req, res) => {
    const { studentId } = req.params;

    const marksRecord = await Marks.findOne({ student: studentId }).populate({
        path: "marks",
        populate: [
            { path: "subject" },
            { path: "teacher" },
            { path: "exams.examType" },
        ],
    });

    if (!marksRecord) {
        return res.status(404).json({ message: "Marks record not found." });
    }

    res.status(200).json(new ApiResponse(200, marksRecord));
});

export const calculateRank = wrapAsync(async (req, res) => {
    const { classId, termId } = req.body;

    await Marks.calculateRank(classId, termId);

    res.status(200).json({ message: "Rank calculated successfully." });
});
