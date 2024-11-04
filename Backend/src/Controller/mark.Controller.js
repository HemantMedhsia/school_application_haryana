import wrapAsync from "../Utils/wrapAsync.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import { Marks } from "../Models/marks.Model.js";
import { addMarksSchema } from "../Validation/mark.Validation.js";
import mongoose from "mongoose";
import { ExamType } from "../Models/examType.Model.js";
import { Student } from "../Models/student.model.js";
import { Term } from "../Models/term.Model.js";

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

export const getMarksByExamCategoryClassAndSection = wrapAsync(
    async (req, res) => {
        const marks = await Marks.find({
            "marks.exams.examType": req.params.examCategory,
            class: req.params.class,
        }).populate(
            "student class marks.subject marks.teacher marks.exams.examType"
        );

        res.status(200).json(new ApiResponse(200, marks));
    }
);

// export const getClassResults = wrapAsync(async (req, res) => {
//     const { classId, studentIds, termIds } = req.body;

//     // Step 1: Aggregate marks by exam type for each term and subject
//     const marksData = await Marks.aggregate([
//         {
//             $match: {
//                 class: new mongoose.Types.ObjectId(classId),
//                 student: {
//                     $in: studentIds.map(
//                         (id) => new mongoose.Types.ObjectId(id)
//                     ),
//                 },
//                 term: {
//                     $in: termIds.map((id) => new mongoose.Types.ObjectId(id)),
//                 },
//             },
//         },
//         {
//             $unwind: "$marks",
//         },
//         {
//             $unwind: "$marks.exams",
//         },
//         {
//             $lookup: {
//                 from: "subjects", // Ensure this matches your subject collection name
//                 localField: "marks.subject",
//                 foreignField: "_id",
//                 as: "subjectDetails",
//             },
//         },
//         {
//             $unwind: "$subjectDetails",
//         },
//         {
//             $group: {
//                 _id: {
//                     student: "$student",
//                     term: "$term",
//                     subject: "$marks.subject",
//                     examType: "$marks.exams.examType", // Group by exam type
//                 },
//                 marksObtained: { $sum: "$marks.exams.marksObtained" },
//                 totalMarks: { $sum: "$marks.exams.totalMarks" }, // Sum total marks for each exam type
//             },
//         },
//         {
//             $group: {
//                 _id: {
//                     student: "$_id.student",
//                     term: "$_id.term",
//                 },
//                 examDetails: {
//                     $push: {
//                         subject: "$_id.subject",
//                         examType: "$_id.examType",
//                         marksObtained: "$marksObtained",
//                         totalMarks: "$totalMarks",
//                     },
//                 },
//             },
//         },
//         {
//             $project: {
//                 _id: 0,
//                 student: "$_id.student",
//                 term: "$_id.term",
//                 examDetails: 1,
//             },
//         },
//     ]);

//     console.log("md", marksData);

//     const results = marksData.map((item) => {
//         const totalMarksObtained = item.examDetails.reduce(
//             (acc, exam) => acc + exam.marksObtained,
//             0
//         );
//         const totalMarks = item.examDetails.reduce(
//             (acc, exam) => acc + exam.totalMarks,
//             0
//         );
//         const percentage = totalMarks
//             ? (totalMarksObtained / totalMarks) * 100
//             : 0;

//         return {
//             student: item.student,
//             term: item.term,
//             examDetails: item.examDetails,
//             totalMarksObtained: totalMarksObtained,
//             totalMarks: totalMarks,
//             percentage: percentage,
//             grade: calculateGrade(percentage),
//         };
//     });

//     res.status(200).json({
//         commonData: {
//             schoolName: "Vardhan International School",
//             address:
//                 "Plot No. 30, Nibiya Lathiya, Bypass, Varanasi, Uttar Pradesh 221011",
//             affiliation: "Affiliated to CBSE(10+2), New Delhi",
//             website: "http://www.imperialpublicschool.com",
//             email: "ips.vns@yahoo.co.in",
//             logo: "/path/to/your/logo.png",
//             secondLogo: "/path/to/your/second_logo.png",
//             session: "2023-24",
//         },
//         gradeScale: [
//             { range: "91-100", grade: "A1", points: 10 },
//             { range: "81-90", grade: "A2", points: 9 },
//             { range: "71-80", grade: "B1", points: 8 },
//             { range: "61-70", grade: "B2", points: 7 },
//             { range: "51-60", grade: "C1", points: 6 },
//             { range: "41-50", grade: "C2", points: 5 },
//             { range: "33-40", grade: "D", points: 4 },
//         ],
//         studentRecords: {
//             studnetProfile: {
//                 name: "AMISH SRIVASTAVA",
//                 fatherName: "JYOTI PRAKASH SRIVASTAVA",
//                 motherName: "SMRITI SRIVASTAVA",
//                 admNo: "20170009",
//                 class: "XI",
//                 section: "(SCIENCE)",
//                 dob: "05-Jan-2008",
//                 rollNo: "10",
//                 profilePicture: "/path/to/student/profile/picture.jpg",
//             },
//             subjects: [
//                 {
//                     name: "English Core",
//                     term1: {
//                         unitTest: 8,
//                         internal: 57,
//                         halfYearly: 73,
//                         total: 138,
//                     },
//                     term2: {
//                         unitTest: 9,
//                         internal: 55,
//                         annual: 71,
//                         total: 135,
//                     },
//                     overallTotal: 318,
//                     grade: "A2",
//                 },
//             ],
//         },
//         maxMarks: {
//             unitTest: 20,
//             internal: 80,
//             halfYearly: 100,
//         },
//     });
// });

// const calculateGrade = (marks) => {
//     if (marks >= 90) return "A+";
//     if (marks >= 80) return "A";
//     if (marks >= 70) return "B";
//     if (marks >= 60) return "C";
//     if (marks >= 50) return "D";
//     return "F";
// };

export const getClassResults = wrapAsync(async (req, res) => {
    const { classId, studentIds, termIds } = req.body;

    const gradeScale = [
        { range: "91-100", grade: "A1", points: 10 },
        { range: "81-90", grade: "A2", points: 9 },
        { range: "71-80", grade: "B1", points: 8 },
        { range: "61-70", grade: "B2", points: 7 },
        { range: "51-60", grade: "C1", points: 6 },
        { range: "41-50", grade: "C2", points: 5 },
        { range: "33-40", grade: "D", points: 4 },
        { range: "0-32", grade: "F", points: 0 },
    ];

    const [terms, marksData, examType] = await Promise.all([
        Term.find({ _id: { $in: termIds } }).lean(),
        Marks.find({
            class: classId,
            student: { $in: studentIds },
            term: { $in: termIds },
        })
            .populate({
                path: "student",
                select: "firstName lastName admissionNo currentClass currentSection  studentPhoto parent dateOfBirth rollNumber",
                populate: [
                    { path: "currentClass", select: "name" },
                    { path: "currentSection", select: "name" },
                    { path: "parent", select: "fatherName motherName" },
                ],
            })
            .populate("marks.subject")
            .populate("marks.exams.examType")
            .lean(),
        ExamType.find({}).select("name maxMarks").lean(),
    ]);

    const termNames = {};
    terms.forEach((term) => {
        termNames[term._id.toString()] = term.name;
    });

    const examTypeDetails = {};
    examType.forEach((exam) => {
        examTypeDetails[exam.name] = exam.maxMarks;
    });

    const studentRecordsMap = {};

    const toCamelCase = (str) => {
        return str
            .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
                index === 0 ? match.toLowerCase() : match.toUpperCase()
            )
            .replace(/\s+/g, "");
    };

    marksData.forEach((mark) => {
        const student = mark.student;

        const studentProfile = {
            name: `${student.firstName} ${student.lastName}`,
            fatherName: student.parent?.fatherName || "N/A",
            motherName: student.parent?.motherName || "N/A",
            admNo: student.admissionNo,
            class: student.currentClass.name,
            section: student.currentSection.name,
            dob: student.dateOfBirth.toISOString().split("T")[0],
            rollNo: student.rollNumber,
            profilePicture: student.studentPhoto,
        };

        console.log("StudentProfile", studentProfile);

        if (!studentRecordsMap[studentProfile.admNo]) {
            studentRecordsMap[studentProfile.admNo] = {
                studentProfile,
                subjects: [],
            };
        }

        mark.marks.forEach((subjectData) => {
            const { subject, exams } = subjectData;

            const subjectRecord = studentRecordsMap[
                studentProfile.admNo
            ].subjects.find((s) => s.name === subject.name) || {
                name: subject.name,
                overallTotal: 0,
                grade: "",
                maxMarks: 0,
            };

            termIds.forEach((termId) => {
                const termName = toCamelCase(termNames[termId.toString()]); // Original term name
                if (!subjectRecord[termName]) {
                    subjectRecord[termName] = { total: 0 };
                }

                exams.forEach((exam) => {
                    if (exam.examType.term.toString() === termId) {
                        const examTypeName = exam.examType.name; // Original exam type name

                        // Convert specific keys to camelCase if they match
                        const camelCaseKey = toCamelCase(examTypeName);

                        subjectRecord[termName][camelCaseKey] =
                            (subjectRecord[termName][camelCaseKey] || 0) +
                            exam.marksObtained;

                        subjectRecord[termName].total += exam.marksObtained;
                        subjectRecord.maxMarks += examTypeDetails[examTypeName];
                    }
                });
            });

            subjectRecord.overallTotal = termIds.reduce(
                (sum, termId) =>
                    sum +
                    (subjectRecord[toCamelCase(termNames[termId.toString()])]
                        ?.total || 0),
                0
            );

            const percentage =
                (subjectRecord.overallTotal / subjectRecord.maxMarks) * 100;
            subjectRecord.grade = calculateGrade(percentage);

            if (
                !studentRecordsMap[studentProfile.admNo].subjects.find(
                    (s) => s.name === subjectRecord.name
                )
            ) {
                studentRecordsMap[studentProfile.admNo].subjects.push(
                    subjectRecord
                );
            }
        });
    });

    const schoolInfo = {
        schoolName: "Vardhan International School",
        address:
            "Plot No. 30, Nibiya Lathiya, Bypass, Varanasi, Uttar Pradesh 221011",
        affiliation: "Affiliated to CBSE(10+2), New Delhi",
        website: "http://www.imperialpublicschool.com",
        email: "ips.vns@yahoo.co.in",
        logo: "/path/to/your/logo.png",
        secondLogo: "/path/to/your/second_logo.png",
        session: "2024-2025",
    };

    const studentRecords = Object.values(studentRecordsMap);

    const result = {
        commonData: schoolInfo,
        gradeScale,
        examTypeDetails,
        studentRecords,
    };

    res.status(200).json(new ApiResponse(200, result));
});

const calculateGrade = (percentage) => {
    if (percentage >= 91) return "A1";
    if (percentage >= 81) return "A2";
    if (percentage >= 71) return "B1";
    if (percentage >= 61) return "B2";
    if (percentage >= 51) return "C1";
    if (percentage >= 41) return "C2";
    if (percentage >= 33) return "D";
    return "F";
};
