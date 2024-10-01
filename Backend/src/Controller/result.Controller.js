import { Marks } from "../Models/marks.Model.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import { Student } from "../Models/student.model.js";
import mongoose from "mongoose";

export const getStudentExamResultsByExamType = wrapAsync(async (req, res) => {
    const { studentId, examType } = req.body;

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
            $unwind: {
                path: "$examTypeDetails",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "subjects",
                localField: "marks.subject",
                foreignField: "_id",
                as: "subjectDetails",
            },
        },
        {
            $unwind: "$subjectDetails",
        },
        {
            $group: {
                _id: "$student",
                subjects: {
                    $push: {
                        subject: "$subjectDetails.name",
                        totalMarksObtained: "$marks.exams.marksObtained",
                        grade: {
                            $let: {
                                vars: {
                                    subjectPercentage: {
                                        $cond: {
                                            if: {
                                                $eq: [
                                                    "$examTypeDetails.maxMarks",
                                                    0,
                                                ],
                                            },
                                            then: 0,
                                            else: {
                                                $multiply: [
                                                    {
                                                        $divide: [
                                                            "$marks.exams.marksObtained",
                                                            "$examTypeDetails.maxMarks",
                                                        ],
                                                    },
                                                    100,
                                                ],
                                            },
                                        },
                                    },
                                },
                                in: {
                                    $switch: {
                                        branches: [
                                            {
                                                case: {
                                                    $gte: [
                                                        "$$subjectPercentage",
                                                        90,
                                                    ],
                                                },
                                                then: "A+",
                                            },
                                            {
                                                case: {
                                                    $gte: [
                                                        "$$subjectPercentage",
                                                        80,
                                                    ],
                                                },
                                                then: "A",
                                            },
                                            {
                                                case: {
                                                    $gte: [
                                                        "$$subjectPercentage",
                                                        70,
                                                    ],
                                                },
                                                then: "B",
                                            },
                                            {
                                                case: {
                                                    $gte: [
                                                        "$$subjectPercentage",
                                                        60,
                                                    ],
                                                },
                                                then: "C",
                                            },
                                            {
                                                case: {
                                                    $gte: [
                                                        "$$subjectPercentage",
                                                        50,
                                                    ],
                                                },
                                                then: "D",
                                            },
                                            {
                                                case: {
                                                    $lt: [
                                                        "$$subjectPercentage",
                                                        50,
                                                    ],
                                                },
                                                then: "F",
                                            },
                                        ],
                                        default: "F",
                                    },
                                },
                            },
                        },
                    },
                },
                totalMarksObtained: { $sum: "$marks.exams.marksObtained" },
                totalPossibleMarks: {
                    $sum: { $ifNull: ["$examTypeDetails.maxMarks", 50] },
                },
            },
        },
        {
            $addFields: {
                percentage: {
                    $cond: {
                        if: { $eq: ["$totalPossibleMarks", 0] },
                        then: 0,
                        else: {
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
                    },
                },
            },
        },
        {
            $addFields: {
                grade: {
                    $switch: {
                        branches: [
                            { case: { $gte: ["$percentage", 90] }, then: "A+" },
                            { case: { $gte: ["$percentage", 80] }, then: "A" },
                            { case: { $gte: ["$percentage", 70] }, then: "B" },
                            { case: { $gte: ["$percentage", 60] }, then: "C" },
                            { case: { $gte: ["$percentage", 50] }, then: "D" },
                            { case: { $lt: ["$percentage", 50] }, then: "F" },
                        ],
                        default: "F",
                    },
                },
            },
        },
        {
            $project: {
                subjects: 1,
                totalMarksObtained: 1,
                totalPossibleMarks: 1,
                percentage: { $round: ["$percentage", 2] },
                grade: 1,
            },
        },
    ]);

    res.status(200).json(new ApiResponse(200, results));
});

export const getStudentExamResultsByTerm = wrapAsync(async (req, res) => {
    const { studentId, term } = req.body;

    const results = await Marks.aggregate([
        {
            $match: {
                student: new mongoose.Types.ObjectId(studentId),
                term: new mongoose.Types.ObjectId(term),
            },
        },
        {
            $unwind: "$marks",
        },
        {
            $unwind: "$marks.exams",
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
            $lookup: {
                from: "subjects",
                localField: "marks.subject",
                foreignField: "_id",
                as: "subjectDetails",
            },
        },
        {
            $unwind: "$subjectDetails",
        },
        {
            $group: {
                _id: {
                    student: "$student",
                    subject: "$marks.subject",
                },
                exams: {
                    $push: {
                        examType: "$examTypeDetails.name",
                        marksObtained: "$marks.exams.marksObtained",
                        maxMarks: "$examTypeDetails.maxMarks",
                    },
                },
                subjectName: { $first: "$subjectDetails.name" },
                subjectTotalMarksObtained: {
                    $sum: "$marks.exams.marksObtained",
                },
                subjectTotalPossibleMarks: {
                    $sum: "$examTypeDetails.maxMarks",
                },
            },
        },
        {
            $addFields: {
                subjectGrade: {
                    $switch: {
                        branches: [
                            {
                                case: {
                                    $gte: [
                                        {
                                            $multiply: [
                                                {
                                                    $divide: [
                                                        "$subjectTotalMarksObtained",
                                                        "$subjectTotalPossibleMarks",
                                                    ],
                                                },
                                                100,
                                            ],
                                        },
                                        90,
                                    ],
                                },
                                then: "A+",
                            },
                            {
                                case: {
                                    $gte: [
                                        {
                                            $multiply: [
                                                {
                                                    $divide: [
                                                        "$subjectTotalMarksObtained",
                                                        "$subjectTotalPossibleMarks",
                                                    ],
                                                },
                                                100,
                                            ],
                                        },
                                        80,
                                    ],
                                },
                                then: "A",
                            },
                            {
                                case: {
                                    $gte: [
                                        {
                                            $multiply: [
                                                {
                                                    $divide: [
                                                        "$subjectTotalMarksObtained",
                                                        "$subjectTotalPossibleMarks",
                                                    ],
                                                },
                                                100,
                                            ],
                                        },
                                        70,
                                    ],
                                },
                                then: "B",
                            },
                            {
                                case: {
                                    $gte: [
                                        {
                                            $multiply: [
                                                {
                                                    $divide: [
                                                        "$subjectTotalMarksObtained",
                                                        "$subjectTotalPossibleMarks",
                                                    ],
                                                },
                                                100,
                                            ],
                                        },
                                        60,
                                    ],
                                },
                                then: "C",
                            },
                            {
                                case: {
                                    $gte: [
                                        {
                                            $multiply: [
                                                {
                                                    $divide: [
                                                        "$subjectTotalMarksObtained",
                                                        "$subjectTotalPossibleMarks",
                                                    ],
                                                },
                                                100,
                                            ],
                                        },
                                        50,
                                    ],
                                },
                                then: "D",
                            },
                            {
                                case: {
                                    $lt: [
                                        {
                                            $multiply: [
                                                {
                                                    $divide: [
                                                        "$subjectTotalMarksObtained",
                                                        "$subjectTotalPossibleMarks",
                                                    ],
                                                },
                                                100,
                                            ],
                                        },
                                        50,
                                    ],
                                },
                                then: "F",
                            },
                        ],
                        default: "F",
                    },
                },
            },
        },
        {
            $group: {
                _id: "$_id.student",
                subjects: {
                    $push: {
                        subject: "$subjectName",
                        exams: "$exams",
                        subjectTotalMarksObtained: "$subjectTotalMarksObtained",
                        subjectTotalPossibleMarks: "$subjectTotalPossibleMarks",
                        subjectGrade: "$subjectGrade",
                    },
                },
                totalMarksObtained: { $sum: "$subjectTotalMarksObtained" },
                totalPossibleMarks: { $sum: "$subjectTotalPossibleMarks" },
            },
        },
        {
            $addFields: {
                percentage: {
                    $round: [
                        {
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
                        2,
                    ],
                },
            },
        },
        {
            $addFields: {
                finalGrade: {
                    $switch: {
                        branches: [
                            { case: { $gte: ["$percentage", 90] }, then: "A+" },
                            { case: { $gte: ["$percentage", 80] }, then: "A" },
                            { case: { $gte: ["$percentage", 70] }, then: "B" },
                            { case: { $gte: ["$percentage", 60] }, then: "C" },
                            { case: { $gte: ["$percentage", 50] }, then: "D" },
                            { case: { $lt: ["$percentage", 50] }, then: "F" },
                        ],
                        default: "F",
                    },
                },
            },
        },
        {
            $project: {
                subjects: 1,
                totalMarksObtained: 1,
                totalPossibleMarks: 1,
                percentage: 1,
                finalGrade: 1,
            },
        },
    ]);

    res.status(200).json(new ApiResponse(200, results));
});



