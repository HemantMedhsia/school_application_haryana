import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import { ExamSchedule } from "../Models/examSchedule.model.js";
import mongoose from "mongoose";
import { examScheduleValidation } from "../Validation/examSchedule.Validation.js";
import { Student } from "../Models/student.model.js";
import { Term } from "../Models/term.Model.js";
import { ExamType } from "../Models/examType.Model.js";
import { Subject } from "../Models/subject.Model.js";

export const createExamSchedule = wrapAsync(async (req, res) => {
    // const { error } = examScheduleValidation.validate(req.body);
    // if (error) {
    //     return res.status(400).json({ message: error.details[0].message });
    // }

    const { term, classId, examType, subjectGroup, examDetails } = req.body;

    const existingExamSchedule = await ExamSchedule.findOne({
        term,
        class: classId,
        examType,
        subjectGroup,
    });

    if (existingExamSchedule) {
        throw new ApiError(400, "Exam Schedule already exists");
    }

    const newExamSchedule = new ExamSchedule({
        term: new mongoose.Types.ObjectId(term),
        class: new mongoose.Types.ObjectId(classId),
        examType: new mongoose.Types.ObjectId(examType),
        subjectGroup: new mongoose.Types.ObjectId(subjectGroup),
        examDetails: examDetails.map((details) => ({
            subject: new mongoose.Types.ObjectId(details.subject),
            examDate: new Date(details.examDate),
            startTime: details.startTime,
            endTime: details.endTime,
        })),
    });

    await newExamSchedule.save();
    res.status(201).json(
        new ApiResponse(
            201,
            newExamSchedule,
            "Exam Schedule Created Successfully"
        )
    );
});

export const getExamSchedules = wrapAsync(async (req, res) => {
    const examSchedules = await ExamSchedule.find()
        .populate("term")
        .populate("class")
        .populate("examType")
        .populate("subjectGroup")
        .populate("examDetails.subject");
    res.status(200).json(
        new ApiResponse(
            200,
            examSchedules,
            "Exam Schedules Fetched Successfully"
        )
    );
});

export const getExamScheduleBytcseId = wrapAsync(async (req, res) => {
    const { termId, classId, subjectGroupId, examTypeId } = req.body;
    const examSchedule = await ExamSchedule.findOne({
        term: termId,
        class: classId,
        subjectGroup: subjectGroupId,
        examType: examTypeId,
    })
        .populate("term")
        .populate("class")
        .populate("examType")
        .populate("subjectGroup")
        .populate("examDetails.subject");
    if (!examSchedule) {
        throw new ApiError(404, "Exam Schedule not found");
    }
    res.status(200).json(
        new ApiResponse(200, examSchedule, "Exam Schedule Fetched Successfully")
    );
});

export const getExamScheduleById = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const examSchedule = await ExamSchedule.findById(id)
        .populate("term")
        .populate("class")
        .populate("examType")
        .populate("subjectGroup")
        .populate("examDetails.subject");
    if (!examSchedule) {
        throw new ApiError(404, "Exam Schedule not found");
    }
    res.status(200).json(
        new ApiResponse(200, examSchedule, "Exam Schedule Fetched Successfully")
    );
});

export const updateExamSchedule = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { term, classId, examType, subjectGroup, examDetails } = req.body;

    const updatedExamSchedule = await ExamSchedule.findByIdAndUpdate(
        id,
        {
            term: new mongoose.Types.ObjectId(term),
            class: new mongoose.Types.ObjectId(classId),
            examType: new mongoose.Types.ObjectId(examType),
            subjectGroup: new mongoose.Types.ObjectId(subjectGroup),
            examDetails: examDetails.map((details) => ({
                subject: new mongoose.Types.ObjectId(details.subject),
                examDate: new Date(details.examDate),
                startTime: new Date(details.startTime),
                endTime: new Date(details.endTime),
            })),
        },
        { new: true }
    );

    if (!updatedExamSchedule) {
        throw new ApiError(404, "Exam Schedule not found");
    }
    res.status(200).json(
        new ApiResponse(
            200,
            updatedExamSchedule,
            "Exam Schedule Updated Successfully"
        )
    );
});

export const deleteExamSchedule = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const examSchedule = await ExamSchedule.findByIdAndDelete(id);
    if (!examSchedule) {
        throw new ApiError(404, "Exam Schedule not found");
    }
    res.status(200).json(
        new ApiResponse(200, null, "Exam Schedule Deleted Successfully")
    );
});

export const getExamSchedulesByClass = wrapAsync(async (req, res) => {
    const { classId } = req.params;
    const examSchedules = await ExamSchedule.find({ class: classId })
        .populate("term")
        .populate("class")
        .populate("examType")
        .populate("subjectGroup")
        .populate("examDetails.subject");
    if (!examSchedules || examSchedules.length === 0) {
        throw new ApiError(404, "Exam Schedules not found");
    }
    res.status(200).json(
        new ApiResponse(
            200,
            examSchedules,
            "Exam Schedules fetched successfully"
        )
    );
});

export const getExamSchedulesByTerm = wrapAsync(async (req, res) => {
    const { termId } = req.params;
    const examSchedules = await ExamSchedule.find({ term: termId })
        .populate("term")
        .populate("class")
        .populate("examType")
        .populate("subjectGroup")
        .populate("examDetails.subject");
    if (!examSchedules || examSchedules.length === 0) {
        throw new ApiError(404, "Exam Schedules not found");
    }
    res.status(200).json(
        new ApiResponse(
            200,
            examSchedules,
            "Exam Schedules fetched successfully"
        )
    );
});

export const getExamSchedulesBySubjectGroup = wrapAsync(async (req, res) => {
    const { subjectGroupId } = req.params;
    const examSchedules = await ExamSchedule.find({
        subjectGroup: subjectGroupId,
    })
        .populate("term")
        .populate("class")
        .populate("examType")
        .populate("subjectGroup")
        .populate("examDetails.subject");
    if (!examSchedules || examSchedules.length === 0) {
        throw new ApiError(404, "Exam Schedules not found");
    }
    res.status(200).json(
        new ApiResponse(
            200,
            examSchedules,
            "Exam Schedules fetched successfully"
        )
    );
});

export const getExamSchedulesByStudentId = wrapAsync(async (req, res) => {
    const studentId = req.user?.id;
    console.log(studentId);
    const student = await Student.findById(studentId)
        .select("currentClass")
        .lean();

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const examSchedules = await ExamSchedule.find({
        class: student.currentClass,
    })
        .select("examType examDetails")
        .populate("examType", "name")
        .populate({
            path: "examDetails.subject",
            select: "name",
        })
        .lean();

    if (!examSchedules || examSchedules.length === 0) {
        throw new ApiError(404, "Exam Schedules not found");
    }

    const responseMap = {};

    examSchedules.forEach((schedule) => {
        const examTypeName = schedule.examType.name;

        if (!responseMap[examTypeName]) {
            responseMap[examTypeName] = {
                serial: Object.keys(responseMap).length + 1,
                examType: examTypeName,
                examDetails: [],
            };
        }

        const examDetailWithSubjectName = schedule.examDetails.map(
            (detail) => ({
                ...detail,
                subject: detail.subject ? detail.subject.name : null,
            })
        );

        responseMap[examTypeName].examDetails.push(
            ...examDetailWithSubjectName
        );
    });

    const responseArray = Object.values(responseMap);

    res.status(200).json(
        new ApiResponse(
            200,
            responseArray,
            "Exam Schedules fetched successfully"
        )
    );
});

export const getExamSchedulesByParentId = wrapAsync(async (req, res) => {
    const parentId = req.user?.id;
    const student = await Student.findOne({ parent: parentId })
        .select("currentClass")
        .lean();

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const examSchedules = await ExamSchedule.find({
        class: student.currentClass,
    })
        .select("examType examDetails")
        .populate("examType", "name")
        .populate({ path: "examDetails.subject", select: "name" })
        .lean();

    if (!examSchedules || examSchedules.length === 0) {
        throw new ApiError(404, "Exam Schedules not found");
    }

    const responseMap = {};

    examSchedules.forEach((schedule) => {
        const examTypeName = schedule.examType.name;

        if (!responseMap[examTypeName]) {
            responseMap[examTypeName] = {
                serial: Object.keys(responseMap).length + 1,
                examType: examTypeName,
                examDetails: [],
            };
        }

        const examDetailWithSubjectName = schedule.examDetails.map(
            (detail) => ({
                ...detail,
                subject: detail.subject ? detail.subject.name : null,
            })
        );

        responseMap[examTypeName].examDetails.push(
            ...examDetailWithSubjectName
        );
    });

    const responseArray = Object.values(responseMap);
    res.status(200).json(
        new ApiResponse(
            200,
            responseArray,
            "Exam Schedules fetched successfully"
        )
    );
});

export const getAdmitCards = wrapAsync(async (req, res) => {
    const { classId, examTypeId, termId } = req.params;
    const { studentIds } = req.body;

    let matchCondition = { currentClass: new mongoose.Types.ObjectId(classId) };

    if (studentIds && studentIds.length > 0) {
        matchCondition._id = {
            $in: studentIds.map((id) => new mongoose.Types.ObjectId(id)),
        };
    }

    const [result, term, examType, subjectMap] = await Promise.all([
        Student.aggregate([
            { $match: matchCondition },
            {
                $lookup: {
                    from: "examschedules",
                    let: { classId: "$currentClass" },
                    pipeline: [
                        {
                            $match: {
                                examType: new mongoose.Types.ObjectId(
                                    examTypeId
                                ),
                                term: new mongoose.Types.ObjectId(termId),
                                class: new mongoose.Types.ObjectId(classId),
                            },
                        },
                        { $project: { examDetails: 1 } },
                    ],
                    as: "examSchedule",
                },
            },
            {
                $lookup: {
                    from: "classes",
                    localField: "currentClass",
                    foreignField: "_id",
                    as: "classDetails",
                },
            },
            { $unwind: "$examSchedule" },
            { $unwind: "$classDetails" },
            {
                $project: {
                    studentName: { $concat: ["$firstName", " ", "$lastName"] },
                    studentPhoto: 1,
                    rollNumber: 1,
                    className: "$classDetails.name",
                    examDetails: "$examSchedule.examDetails",
                },
            },
        ]),
        Term.findById(termId).select("name").lean(),
        ExamType.findById(examTypeId).select("name").lean(),
        Subject.find({}).lean(),
    ]);

    if (result.length === 0) {
        return res.status(404).json({ message: "No data found" });
    }

    const subjectIdToName = subjectMap.reduce((acc, subject) => {
        acc[subject._id.toString()] = subject.name;
        return acc;
    }, {});

    const className = result[0]?.className || "Unknown Class";

    const response = {
        commonInfo: {
            schoolName: "Green Valley High School",
            schoolLogo: "https://example.com/school-logo.png",
            term: term ? term.name : "Unknown Term",
            examType: examType ? examType.name : "Unknown Exam Type",
            standard: className,
            examDetails:
                result.length > 0
                    ? result[0].examDetails.map((detail) => ({
                          subject:
                              subjectIdToName[detail.subject] ||
                              "Unknown Subject",
                          examDate: detail.examDate,
                          startTime: detail.startTime,
                          endTime: detail.endTime,
                      }))
                    : [],
        },
        students: result.map((student) => ({
            studentName: student.studentName,
            studentPhoto: student.studentPhoto,
            rollNumber: student.rollNumber,
        })),
    };

    res.status(200).json(
        new ApiResponse(200, response, "Admit Cards Fetched Successfully")
    );
});
