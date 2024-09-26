import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import { Timetable } from "../Models/classTimeTable.Model.js";
import { Teacher } from "../Models/teacher.model.js";
import mongoose from "mongoose";

export const createClassTimeTable = wrapAsync(async (req, res) => {
    const { classId, dayOfWeek, entries } = req.body;

    for (const entry of entries) {
        const existingTimetable = await Timetable.findOne({
            dayOfWeek,
            "entries.period": entry.period,
            "entries.teacherId": entry.teacherId,
        });

        if (existingTimetable) {
            return res.status(400).json({
                message: `Teacher ${entry.teacherId} is already assigned to another class during period ${entry.period} on ${dayOfWeek}.`,
            });
        }

        await Teacher.findByIdAndUpdate(
            entry.teacherId,
            { $addToSet: { subjects: entry.subjectId } },
            { new: true }
        );
    }

    const timetable = new Timetable({
        classId,
        dayOfWeek,
        entries,
    });

    await timetable.save();

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                timetable,
                "Class Timetable created successfully"
            )
        );
});

export const getAvailableTeacher = wrapAsync(async (req, res) => {
    const { dayOfWeek, periods } = req.query;

    if (!periods) {
        return res.status(400).json({
            message: "Periods are required",
        });
    }

    const assignedTeachers = await Timetable.find({
        dayOfWeek,
        "entries.period": { $in: periods.split(",").map(Number) },
    }).select("entries.teacherId");

    const assignedTeacherIds = assignedTeachers.flatMap((t) =>
        t.entries.map((entry) => entry.teacherId.toString())
    );

    const availableTeachers = await Teacher.find({
        _id: { $nin: assignedTeacherIds },
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                availableTeachers,
                "Available Teachers fetched successfully"
            )
        );
});

export const getClassTimeTable = wrapAsync(async (req, res) => {
    const timetable = await Timetable.find()
        .populate("classId")
        .populate("entries.teacherId")
        .populate("entries.subjectId");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                timetable,
                "Class Timetable fetched successfully"
            )
        );
});

export const getClassTimeTableById = wrapAsync(async (req, res) => {
    const timetable = await Timetable.findById(req.params.id)
        .populate("classId")
        .populate("entries.teacherId")
        .populate("entries.subjectId");

    if (!timetable) {
        return res.status(404).json({
            message: "Timetable not found",
        });
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                timetable,
                "Class Timetable fetched successfully"
            )
        );
});

export const deleteClassTimeTable = wrapAsync(async (req, res) => {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
        return res.status(404).json({
            message: "Timetable not found",
        });
    }
    for (const entry of timetable.entries) {
        await Teacher.findByIdAndUpdate(
            entry.teacherId,
            { $pull: { subjects: entry.subjectId } },
            { new: true }
        );
    }

    await Timetable.findByIdAndDelete(req.params.id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                timetable,
                "Timetable deleted successfully and subjects removed from teachers"
            )
        );
});

export const updateClassTimeTable = wrapAsync(async (req, res) => {
    const { classId, dayOfWeek, entries } = req.body;

    if (!classId || !dayOfWeek || !Array.isArray(entries)) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
        return res.status(404).json({ message: "Timetable not found" });
    }

    for (const entry of timetable.entries) {
        await Teacher.findByIdAndUpdate(
            entry.teacherId,
            { $pull: { subjects: entry.subjectId } },
            { new: true }
        );
    }

    for (const entry of entries) {
        const existingTimetable = await Timetable.findOne({
            dayOfWeek,
            "entries.period": entry.period,
            "entries.teacherId": entry.teacherId,
            _id: { $ne: req.params.id },
        });

        if (existingTimetable) {
            return res.status(400).json({
                success: false,
                message: `Teacher ${entry.teacherId} is already assigned to another class during period ${entry.period} on ${dayOfWeek}.`,
            });
        }

        await Teacher.findByIdAndUpdate(
            entry.teacherId,
            { $addToSet: { subjects: entry.subjectId } },
            { new: true }
        );
    }

    timetable.classId = classId;
    timetable.dayOfWeek = dayOfWeek;
    timetable.entries = entries;

    await timetable.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                timetable,
                "Class Timetable updated successfully"
            )
        );
});

// export const getClassTimeTableByClassId = wrapAsync(async (req, res) => {
//     const timetable = await Timetable.find({ classId: req.params.classId })
//         .populate("entries.teacherId", "name")
//         .populate("entries.subjectId", "name")
//         .select(
//             "dayOfWeek entries.period entries.subjectId entries.teacherId entries.startTime entries.endTime"
//         );

//     const transformedTimetable = timetable.map((entry) => {
//         const day = entry.dayOfWeek;
//         const periods = entry.entries.map((periodEntry) => ({
//             period: periodEntry.period,
//             subject: periodEntry.subjectId.name,
//             teacher: periodEntry.teacherId.name,
//             startTime: periodEntry.startTime,
//             endTime: periodEntry.endTime,
//         }));

//         return { day, periods };
//     });

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 transformedTimetable,
//                 "Class Timetable fetched successfully"
//             )
//         );
// });

// export const getClassTimeTableByClassId = wrapAsync(async (req, res) => {
//     const classId = new mongoose.Types.ObjectId(req.params.classId);

//     const timetable = await Timetable.aggregate([
//         { $match: { classId } },
//         { $unwind: "$entries" },
//         {
//             $lookup: {
//                 from: "teachers",
//                 localField: "entries.teacherId",
//                 foreignField: "_id",
//                 as: "teacherDetails",
//             },
//         },
//         { $unwind: "$teacherDetails" },
//         {
//             $lookup: {
//                 from: "subjects",
//                 localField: "entries.subjectId",
//                 foreignField: "_id",
//                 as: "subjectDetails",
//             },
//         },
//         { $unwind: "$subjectDetails" },
//         {
//             $project: {
//                 dayOfWeek: 1,
//                 "entries.period": 1,
//                 "entries.startTime": 1,
//                 "entries.endTime": 1,
//                 "subjectDetails.name": 1,
//                 "teacherDetails.name": 1,
//             },
//         },
//         {
//             $group: {
//                 _id: "$dayOfWeek",
//                 periods: {
//                     $push: {
//                         period: "$entries.period",
//                         subject: "$subjectDetails.name",
//                         teacher: "$teacherDetails.name",
//                         startTime: "$entries.startTime",
//                         endTime: "$entries.endTime",
//                     },
//                 },
//             },
//         },
//     ]);

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 timetable,
//                 "Class Timetable fetched successfully"
//             )
//         );
// });

export const getClassTimeTableByClassId = wrapAsync(async (req, res) => {
    const classId = new mongoose.Types.ObjectId(req.params.classId);

    const timetable = await Timetable.aggregate([
        { $match: { classId } },
        { $unwind: "$entries" },
        {
            $lookup: {
                from: "teachers",
                localField: "entries.teacherId",
                foreignField: "_id",
                as: "teacherDetails",
            },
        },
        { $unwind: "$teacherDetails" },
        {
            $lookup: {
                from: "subjects",
                localField: "entries.subjectId",
                foreignField: "_id",
                as: "subjectDetails",
            },
        },
        { $unwind: "$subjectDetails" },
        {
            $project: {
                dayOfWeek: 1,
                "entries.period": 1,
                "entries.startTime": 1,
                "entries.endTime": 1,
                "subjectDetails.name": 1,
                "teacherDetails.name": 1,
            },
        },
        {
            $group: {
                _id: "$dayOfWeek",
                periods: {
                    $push: {
                        subject: "$subjectDetails.name",
                        time: {
                            $concat: [
                                {
                                    $dateToString: {
                                        format: "%H:%M",
                                        date: "$entries.startTime",
                                    },
                                }, 
                                " - ",
                                {
                                    $dateToString: {
                                        format: "%H:%M",
                                        date: "$entries.endTime",
                                    },
                                },
                            ],
                        },
                        teacher: "$teacherDetails.name",
                    },
                },
            },
        },
    ]);
    
    const formattedTimetable = timetable.reduce((acc, curr) => {
        const day = curr._id;
        acc[day] = curr.periods.map((period) => ({
            subject: period.subject,
            time: period.time,
            teacher: period.teacher,
        }));
        return acc;
    }, {});

    const classLabel = `Class ${classId}`; // Dynamic class label based on classId

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { [classLabel]: formattedTimetable },
                "Class Timetable fetched successfully"
            )
        );
});

export const getTeacherTimetable = wrapAsync(async (req, res) => {
    const teacherId = new mongoose.Types.ObjectId(req.params.teacherId);
    const timetable = await Timetable.aggregate([
        { $unwind: "$entries" },
        { $match: { "entries.teacherId": teacherId } },
        {
            $lookup: {
                from: "classes",
                localField: "classId",
                foreignField: "_id",
                as: "classDetails",
            },
        },
        { $unwind: "$classDetails" },
        {
            $lookup: {
                from: "teachers",
                localField: "entries.teacherId",
                foreignField: "_id",
                as: "teacherDetails",
            },
        },
        { $unwind: "$teacherDetails" },
        {
            $lookup: {
                from: "subjects",
                localField: "entries.subjectId",
                foreignField: "_id",
                as: "subjectDetails",
            },
        },
        { $unwind: "$subjectDetails" },
        {
            $project: {
                dayOfWeek: 1,
                "entries.period": 1,
                "entries.startTime": 1,
                "entries.endTime": 1,
                "subjectDetails.name": 1,
                "teacherDetails.name": 1,
                "classDetails.name": 1,
            },
        },
        {
            $group: {
                _id: "$dayOfWeek",
                periods: {
                    $push: {
                        period: "$entries.period",
                        subject: "$subjectDetails.name",
                        startTime: "$entries.startTime",
                        endTime: "$entries.endTime",
                        className: "$classDetails.name",
                    },
                },
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                timetable,
                "Teacher's Timetable fetched successfully"
            )
        );
});
