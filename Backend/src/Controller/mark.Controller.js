import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import { Marks } from "../Models/marks.Model.js";
import { addMarksSchema } from "../Validation/mark.Validation.js";
import mongoose from "mongoose";

export const addMarks = wrapAsync(async (req, res) => {
    const { error } = addMarksSchema.validate(req.body);
    if (error) {
        throw new ApiError(400, error.details[0].message);
    }

    const { student, term, class: classId, marks } = req.body;
    console.log(teacherId);

    const newMarks = marks.map((mark) => ({
        subject: mark.subject,
        teacher: teacherId,
        exams: mark.exams.map((exam) => ({
            examType: exam.examType,
            marksObtained: exam.marksObtained,
        })),
    }));

    const marksEntry = new Marks({
        student,
        term,
        class: classId,
        marks: newMarks,
    });

    await marksEntry.save();

    res.status(201).json(
        new ApiResponse(201, marksEntry, "Marks Added Successfully")
    );
});

// export const addMultipleStudentMarks = wrapAsync(async (req, res) => {
//     const { termId, classId, examTypeId, subjectId, studentMarksArray } =
//         req.body;
//     const teacherId = req.user?._id;
//     console.log(subjectId);
//     const marksData = studentMarksArray.map(({ studentId, marksObtained }) => ({
//         student: studentId,
//         term: termId,
//         class: classId,
//         marks: [
//             {
//                 subject: subjectId,
//                 teacher: teacherId,
//                 exams: [
//                     {
//                         examType: examTypeId,
//                         marksObtained: marksObtained || 0,
//                     },
//                 ],
//             },
//         ],
//     }));

//     const result = await Marks.insertMany(marksData);

//     res.status(201).json(
//         new ApiResponse(201, result, "Marks Added Successfully")
//     );
// });

export const addMultipleStudentMarks = wrapAsync(async (req, res) => {
    const { termId, classId, examTypeId, subjectId, studentMarksArray } =
        req.body;
    const teacherId = req.user?._id;

    const existingClassMarks = await Marks.findOne({
        term: termId,
        class: classId,
        "marks.subject": subjectId,
        "marks.exams.examType": examTypeId,
    });

    if (existingClassMarks) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    `Marks for subject ${subjectId} have already been entered for the class.`
                )
            );
    }

    const marksData = studentMarksArray.map(({ studentId, marksObtained }) => ({
        student: studentId,
        term: termId,
        class: classId,
        marks: [
            {
                subject: subjectId,
                teacher: teacherId,
                exams: [
                    {
                        examType: examTypeId,
                        marksObtained: marksObtained || 0,
                    },
                ],
            },
        ],
    }));

    const result = await Marks.insertMany(marksData);

    res.status(201).json(
        new ApiResponse(201, result, "Marks Added Successfully")
    );
});

export const studentMarkbytermandexamtype = wrapAsync(async (req, res) => {
    const { termId, examTypeId, studentId } = req.body;
    const marks = await Marks.find({
        term: termId,
        "marks.exams.examType": examTypeId,
        student: studentId,
    })
        // .populate("term")
        .populate("class")
        .populate("marks.subject")
        .populate("marks.exams.examType");

    if (!marks || marks.length === 0) {
        throw new ApiError(404, "Marks not found");
    }

    res.status(200).json(new ApiResponse(200, marks));
});

export const getAllMarks = wrapAsync(async (req, res) => {
    const marks = await Marks.find()
        .populate("student")
        .populate("term")
        .populate("class")
        .populate("marks.subject")
        .populate("marks.exams.examType");

    res.status(200).json(new ApiResponse(200, marks));
});

export const getStudentExamResultsByExamType = wrapAsync(async (req, res) => {
    const { studentId, examType } = req.body;
    console.log(studentId, examType);
    const results = await Marks.aggregate([
        {
            $match: {
                student: new mongoose.Types.ObjectId(studentId),
                "marks.exams.examType": new mongoose.Types.ObjectId(examType),
            },
        },
        {
            $unwind: "$marks",
        },
        {
            $unwind: "$marks.exams",
        },
        {
            $match: {
                "marks.exams.examType": new mongoose.Types.ObjectId(examType),
            },
        },
        {
            $lookup: {
                from: "examtypes",
                localField: "marks.exams.examType",
                foreignField: "_id",
                as: "examTypeDetails",
            },
        },
        {
            $unwind: "$examTypeDetails",
        },
        {
            $group: {
                _id: {
                    student: "$student",
                    examType: "$marks.exams.examType",
                    subject: "$marks.subject",
                },
                totalMarksObtained: { $sum: "$marks.exams.marksObtained" },
                totalPossibleMarks: { $sum: "$examTypeDetails.maxMarks" },
            },
        },
        {
            $project: {
                student: "$_id.student",
                subject: "$_id.subject",
                examType: "$_id.examType",
                totalMarksObtained: 1,
                totalPossibleMarks: 1,
                percentage: {
                    $multiply: [
                        {
                            $divide: [
                                "$totalMarksObtained",
                                "$totalPossibleMarks",
                            ],
                        },
                        100,
                    ],
                },
                grade: {
                    $switch: {
                        branches: [
                            { case: { $gte: ["$percentage", 90] }, then: "A+" },
                            { case: { $gte: ["$percentage", 80] }, then: "A" },
                            { case: { $gte: ["$percentage", 70] }, then: "B" },
                            { case: { $gte: ["$percentage", 60] }, then: "C" },
                            { case: { $gte: ["$percentage", 50] }, then: "D" },
                        ],
                        default: "F",
                    },
                },
            },
        },
    ]);

    console.log(results);

    res.status(200).json(new ApiResponse(200, results));
});

export const getMarkById = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const marks = await Marks.findById(id)
        .populate("student")
        .populate("term")
        .populate("class")
        .populate("marks.subject")
        .populate("marks.exams.examType");

    if (!marks) {
        throw new ApiError(404, "Marks not found");
    }

    res.status(200).json(new ApiResponse(200, marks));
});

export const updateMarks = wrapAsync(async (req, res) => {
    const marks = await Marks.findById(req.params.id);
    if (!marks) {
        throw new ApiError(404, "Marks not found");
    }

    const updatedMarks = await Marks.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(
        new ApiResponse(200, updatedMarks, "Marks Updated Successfully")
    );
});

export const deleteMarks = wrapAsync(async (req, res) => {
    const marks = await Marks.findByIdAndDelete(req.params.id);
    if (!marks) {
        throw new ApiError(404, "Marks not found");
    }

    res.status(200).json(
        new ApiResponse(200, null, "Marks Deleted Successfully")
    );
});

export const getMarksByStudent = wrapAsync(async (req, res) => {
    const { studentId } = req.params;
    const marks = await Marks.find({ student: studentId })
        .populate("student")
        .populate("term")
        .populate("class")
        .populate("marks.subject")
        .populate("marks.exams.examType");

    if (!marks || marks.length === 0) {
        throw new ApiError(404, "Marks not found");
    }

    res.status(200).json(new ApiResponse(200, marks));
});

export const getMarksByClass = wrapAsync(async (req, res) => {
    const { classId } = req.params;
    const marks = await Marks.find({ class: classId })
        .populate("student")
        .populate("term")
        .populate("class")
        .populate("marks.subject")
        .populate("marks.exams.examType");

    if (!marks || marks.length === 0) {
        throw new ApiError(404, "Marks not found");
    }

    res.status(200).json(new ApiResponse(200, marks));
});

export const getMarksByClassAndExamType = wrapAsync(async (req, res) => {
    const { classId, examTypeId } = req.params;
    const marks = await Marks.find({
        class: classId,
        "marks.exams.examType": examTypeId, //examTypeId
    })
        .populate("student")
        .populate("term")
        .populate("class")
        .populate("marks.subject")
        .populate("marks.exams.examType");

    if (!marks || marks.length === 0) {
        throw new ApiError(404, "Marks not found");
    }

    res.status(200).json(new ApiResponse(200, marks));
});

export const getMarksByAllIds = wrapAsync(async (req, res) => {
    const { termId, classId, examTypeId, subjectId } = req.body;
    const marks = await Marks.find({
        term: termId,
        class: classId,
        "marks.exams.examType": examTypeId,
        "marks.subject": subjectId,
    })
        .populate("student")
        .populate("term")
        .populate("class")
        .populate("marks.subject")
        .populate("marks.exams.examType");

    if (!marks || marks.length === 0) {
        throw new ApiError(404, "Marks not found");
    }

    res.status(200).json(new ApiResponse(200, marks));
});

export const getExistingMarks = wrapAsync(async (req, res) => {
    const { termId, classId, examTypeId, subjectId } = req.params;
    const marks = await Marks.findOne({
        term: termId,
        class: classId,
        "marks.exams.examType": examTypeId,
        "marks.subject": subjectId,
    })
        .populate("marks.subject")
        .populate("student");

    if (!marks) {
        throw new ApiError(404, "Marks not found");
    }

    res.status(200).json(new ApiResponse(200, marks));
});
