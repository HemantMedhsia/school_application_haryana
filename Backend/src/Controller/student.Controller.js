import { School } from "../Models/school.model.js";
import { Student } from "../Models/student.model.js";
import { Parent } from "../Models/parents.model.js";
import { ApiError } from "../Utils/errorHandler.js";
import { generateAccessToken } from "../Utils/generateAcessToken.js";
import { generateRefreshToken } from "../Utils/generateRefreshToken.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { studentValidationSchema } from "../Validation/student.Validation.js";
import { StudentHistory } from "../Models/studentHistory.Model.js";
import jwt from "jsonwebtoken";
import { StudentAttendance } from "../Models/studentAttendence.Model.js";
import { assignFeeGroupToNewStudents } from "../Models/student.model.js";
import { Class } from "../Models/class.Model.js";
import { Section } from "../Models/section.Model.js";
import { Session } from "../Models/session.Model.js";
import fs from "fs";
import csv from "csv-parser";
import { Readable } from 'stream';
import * as XLSX from "xlsx";

const generateAccessAndRefreshTokens = async (studentId, next) => {
    const student = await Student.findById(studentId);

    if (!student) {
        return next(new ApiError(404, "Student not found"));
    }

    const accessToken = generateAccessToken(student);
    const refreshToken = generateRefreshToken(student);

    if (!accessToken || !refreshToken) {
        return next(new ApiError(500, "Failed to generate tokens"));
    }

    return { accessToken, refreshToken };
};

export const createStudent = wrapAsync(async (req, res) => {
    await studentValidationSchema.validateAsync(req.body, {
        abortEarly: false,
    });
    const school = await School.findById(req.params.schoolId);
    if (!school) {
        return res.status(404).json({
            success: false,
            message: "School not found",
        });
    }
    const student = new Student(req.body);
    const { currentClass, currentSection, currentSession } = req.body;
    const studentHistory = {
        session: currentSession,
        class: currentClass,
        classSection: currentSection,
    };

    const studentHistoryData = await StudentHistory.create(studentHistory);

    student.studentHistory.push(studentHistoryData._id);

    const studentData = await student.save();
    school.students.push(studentData._id);

    await school.save();

    await StudentHistory.findByIdAndUpdate(
        studentHistoryData._id,
        { studentId: studentData._id },
        { new: true }
    );

    await assignFeeGroupToNewStudents(student);

    return res
        .status(201)
        .json(new ApiResponse(201, student, "Student Created Successfully"));
});

export const loginStudent = wrapAsync(async (req, res, next) => {
    const { rollNumber, email, password, role } = req.body;

    if (!password || (!rollNumber && !email) || !role) {
        return next(
            new ApiError(
                400,
                "Roll number or email, password, and role are required"
            )
        );
    }

    const student = await Student.findOne({
        $or: [{ rollNumber }, { email }],
    });

    if (!student) {
        console.log("Student not found");
        return next(new ApiError(404, "Student does not exist"));
    }

    console.log("Student found:", student.email);

    const isPasswordValid = await student.isValidPassword(password);
    console.log("Is password valid:", isPasswordValid);

    if (!isPasswordValid) {
        console.log("Invalid password attempt for student:", student.email);
        return next(new ApiError(401, " Invalid student credentials "));
    }
    if (student.role !== role) {
        return next(new ApiError(403, "Unauthorized role"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        student._id
    );
    console.log("refereshToken", refreshToken);

    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    const loggedInStudent = await Student.findById(student._id).select(
        "-password "
    );

    // Cookie options
    // const options = {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production", // Set secure to true in production
    // };

    // Send the response with cookies and student data
    return res
        .status(200)
        .cookie("accessToken", accessToken) // include option before production.
        .cookie("refreshToken", refreshToken) // include option before production.
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInStudent,
                    accessToken,
                    refreshToken,
                },
                "Student logged in successfully"
            )
        );
});

export const refreshAccessTokenStudent = wrapAsync(async (req, res, next) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return next(new ApiError(401, "Unauthorized request"));
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const student = await Student.findById(decodedToken?.id);

        if (!student) {
            return next(new ApiError(401, "Invalid refresh token"));
        }

        if (incomingRefreshToken !== student?.refreshToken) {
            return next(new ApiError(401, "Refresh token is expired or used"));
        }

        // const options = {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        // };

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshTokens(student._id);
        student.refreshToken = newRefreshToken;
        await student.save({ validateBeforeSave: false });

        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", newRefreshToken)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

export const getStudents = wrapAsync(async (req, res) => {
    const students = await Student.find()
        .populate("currentClass")
        .populate("currentSection")
        .populate("currentSession")
        .populate("parent")
        .populate({
            path: "StudentAttendance",
            model: "StudentAttendance",
        })
        .populate("studentHistory")
        .lean();
    return res.status(200).json(new ApiResponse(200, students));
});

export const getStudent = wrapAsync(async (req, res) => {
    const student = await Student.findById(req.params.id)
        .populate({
            path: "studentHistory",
            populate: {
                path: "session class classSection",
                select: "-__v",
            },
        })
        .populate("currentClass currentSection currentSession")
        .setOptions({ strictPopulate: false });
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found",
        });
    }
    return res.status(200).json(new ApiResponse(200, student));
});

export const updateStudent = wrapAsync(async (req, res) => {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found",
        });
    }
    return res
        .status(200)
        .json(new ApiResponse(200, student, "Update Successfully"));
});

export const deleteStudent = wrapAsync(async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found",
        });
    }
    const parent = await Parent.findOneAndDelete({ studentId: req.params.id }); // Delete parent if student
    console.log("Parent", parent);
    if (!parent) {
        return res.status(404).json({
            success: false,
            message: "Parent not found",
        });
    }

    const school = await School.findOneAndUpdate(
        { students: req.params.id },
        { $pull: { students: req.params.id } }
    );

    if (!school) {
        return res.status(404).json({
            success: false,
            message:
                "School not found or student ID not associated with any school",
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, student, "Delete Successfully"));
});

export const getStudentByParent = wrapAsync(async (req, res) => {
    const student = await Student.find({
        parent: req.params.parentId,
    }).populate("currentClass");

    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found",
        });
    }
    return res.status(200).json(new ApiResponse(200, student));
});

export const getParentByStudent = wrapAsync(async (req, res) => {
    const student = await Student.findById(req.params.studentId).populate(
        "parent"
    );
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found",
        });
    }
    return res.status(200).json(new ApiResponse(200, student.parent));
});

export const getStudentAttendanceData = wrapAsync(async (req, res) => {
    const studentId = req.user.id;
    const student = await Student.findById(studentId);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    const attendanceStats = await student.getAttendanceStats();

    return res.status(200).json(new ApiResponse(200, attendanceStats));
});

export const getStudentAttendanceDataByParentId = wrapAsync(
    async (req, res) => {
        const parentId = req.user.id;

        const student = await Student.findOne({ parent: parentId });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const attendanceStats = await student.getAttendanceStats();
        return res.status(200).json(new ApiResponse(200, attendanceStats));
    }
);

export const getAttendanceAndStudentCount = wrapAsync(async (req, res) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const attendanceRecords = await StudentAttendance.find({
        date: {
            $gte: startDate,
            $lte: endDate,
        },
    }).populate({
        path: "studentId",
        select: "gender", // Select only gender field
    });

    const maleAttendance = Array(7).fill(0);
    const femaleAttendance = Array(7).fill(0);

    attendanceRecords.forEach((record) => {
        if (record.studentId && record.status === "Present") {
            const dayOfWeek = record.date.getDay();
            if (record.studentId.gender === "Male") {
                maleAttendance[dayOfWeek]++;
            } else if (record.studentId.gender === "Female") {
                femaleAttendance[dayOfWeek]++;
            }
        }
    });

    const barChartData = [
        {
            name: "Male",
            data: maleAttendance,
        },
        {
            name: "Female",
            data: femaleAttendance,
        },
    ];

    const totalCounts = await Student.aggregate([
        {
            $group: {
                _id: "$gender",
                count: { $sum: 1 },
            },
        },
    ]);

    const totalStudents = totalCounts.reduce(
        (acc, curr) => acc + curr.count,
        0
    );
    const totalMaleStudents =
        totalCounts.find((g) => g._id === "Male")?.count || 0;
    const totalFemaleStudents =
        totalCounts.find((g) => g._id === "Female")?.count || 0;

    const response = {
        attendanceData: barChartData,
        totalStudents,
        totalMaleStudents,
        totalFemaleStudents,
    };

    return res.status(200).json(new ApiResponse(200, response));
});

// Controller Function for Bulk Uploading Students without validation schemas
// export const UploadBulkStudents = wrapAsync(async (req, res) => {
//     const studentsData = [];
//     const parentsData = [];

//     fs.createReadStream(req.file.path)
//         .pipe(csv())
//         .on("data", (row) => {
//             studentsData.push(row);
//             parentsData.push(row);
//         })
//         .on("end", async () => {
//             try {
//                 const processedStudents = [];

//                 for (let studentData of studentsData) {
//                     const {
//                         currentClass,
//                         currentSection,
//                         currentSession,
//                         ...restStudentData
//                     } = studentData;

//                     const classDoc = await Class.findOne({
//                         name: currentClass,
//                     });
//                     const sectionDoc = await Section.findOne({
//                         name: currentSection,
//                     });
//                     const sessionDoc = await Session.findOne({
//                         sessionYear: currentSession,
//                     });

//                     if (!classDoc || !sectionDoc || !sessionDoc) {
//                         return res
//                             .status(404)
//                             .json(
//                                 new ApiResponse(
//                                     404,
//                                     null,
//                                     `Class, Section, or Session not found for record with admissionNo: ${studentData.admissionNo}`
//                                 )
//                             );
//                     }

//                     const requiredFields = [
//                         "admissionNo",
//                         "rollNumber",
//                         "password",
//                         "firstName",
//                         "gender",
//                         "mobileNumber",
//                         "email",
//                     ];

//                     for (let field of requiredFields) {
//                         if (
//                             !studentData[field] ||
//                             studentData[field].trim() === ""
//                         ) {
//                             return res
//                                 .status(400)
//                                 .json(
//                                     new ApiResponse(
//                                         400,
//                                         null,
//                                         `Field "${field}" is required for student with admissionNo: ${studentData.admissionNo}`
//                                     )
//                                 );
//                         }
//                     }

//                     const existingStudent = await Student.findOne({
//                         rollNumber: studentData.rollNumber,
//                     });
//                     if (existingStudent) {
//                         return res
//                             .status(400)
//                             .json(
//                                 new ApiResponse(
//                                     400,
//                                     null,
//                                     `Duplicate roll number found: ${studentData.rollNumber} for student with admissionNo: ${studentData.admissionNo}`
//                                 )
//                             );
//                     }

//                     const dateOfBirth = parseDate(studentData.dateOfBirth);
//                     const admissionDate = parseDate(studentData.admissionDate);
//                     const measurementDate = parseDate(
//                         studentData.measurementDate
//                     );

//                     const newStudent = new Student({
//                         ...restStudentData,
//                         currentClass: classDoc._id,
//                         currentSection: sectionDoc._id,
//                         currentSession: sessionDoc._id,
//                         password: studentData.password,
//                         dateOfBirth,
//                         admissionDate,
//                         measurementDate,
//                     });

//                     const savedStudent = await newStudent.save();

//                     const studentHistory = {
//                         session: sessionDoc._id,
//                         class: classDoc._id,
//                         classSection: sectionDoc._id,
//                     };
//                     const studentHistoryData = await StudentHistory.create(
//                         studentHistory
//                     );
//                     savedStudent.studentHistory.push(studentHistoryData._id);
//                     await savedStudent.save();

//                     processedStudents.push(savedStudent);
//                 }

//                 const parentDocs = [];

//                 for (let i = 0; i < processedStudents.length; i++) {
//                     const student = processedStudents[i];
//                     const parentData = {
//                         fatherName: parentsData[i].fatherName,
//                         motherName: parentsData[i].motherName,
//                         fatherPhone: parentsData[i].fatherPhone,
//                         motherPhone: parentsData[i].motherPhone,
//                         email: parentsData[i].parentEmail,
//                         password: parentsData[i].parentPassword,
//                         studentId: student._id,
//                     };

//                     if (
//                         !parentData.fatherName ||
//                         parentData.fatherName.trim() === ""
//                     ) {
//                         return res
//                             .status(400)
//                             .json(
//                                 new ApiResponse(
//                                     400,
//                                     null,
//                                     `Father's name is required for student with admissionNo: ${student.admissionNo}`
//                                 )
//                             );
//                     }
//                     if (
//                         !parentData.password ||
//                         parentData.password.trim() === ""
//                     ) {
//                         return res
//                             .status(400)
//                             .json(
//                                 new ApiResponse(
//                                     400,
//                                     null,
//                                     `Parent password is required for student with admissionNo: ${student.admissionNo}`
//                                 )
//                             );
//                     }

//                     const newParent = new Parent(parentData);
//                     const savedParent = await newParent.save();

//                     student.parent = savedParent._id;
//                     await student.save();

//                     await assignFeeGroupToNewStudents(student);

//                     parentDocs.push(savedParent);
//                 }

//                 fs.unlinkSync(req.file.path);

//                 return res.status(201).json(
//                     new ApiResponse(
//                         201,
//                         {
//                             students: processedStudents,
//                             parents: parentDocs,
//                         },
//                         "Bulk upload successful, students and parents linked."
//                     )
//                 );
//             } catch (err) {
//                 console.error(err);
//                 fs.unlinkSync(req.file.path);
//                 return res
//                     .status(500)
//                     .json(
//                         new ApiResponse(
//                             500,
//                             null,
//                             "An error occurred during bulk upload."
//                         )
//                     );
//             }
//         });
// });

export const UploadBulkStudents = wrapAsync(async (req, res) => {
    try {
        console.log('Uploaded File:', req.file);

        if (!req.file) {
            return res.status(400).json(
                new ApiResponse(
                    400,
                    null,
                    "No file uploaded or file upload failed."
                )
            );
        }

        // Read the workbook from the buffer
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheet_name_list = workbook.SheetNames;
        const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        const studentsData = xlData;
        const parentsData = xlData;

        const processedStudents = [];
        const parentDocs = [];
        const errors = [];

        for (let i = 0; i < studentsData.length; i++) {
            const studentData = studentsData[i];

            const {
                currentClass,
                currentSection,
                currentSession,
                ...restStudentData
            } = studentData;

            const classDoc = await Class.findOne({
                name: currentClass,
            });
            const sectionDoc = await Section.findOne({
                name: currentSection,
            });
            const sessionDoc = await Session.findOne({
                sessionYear: currentSession,
            });

            if (!classDoc || !sectionDoc || !sessionDoc) {
                errors.push({
                    admissionNo: studentData.admissionNo,
                    message: "Class, Section, or Session not found.",
                });
                continue;
            }

            const requiredFields = [
                "admissionNo",
                "rollNumber",
                "password",
                "firstName",
                "gender",
                "mobileNumber",
                "email",
            ];

            let missingField = null;
            for (let field of requiredFields) {
                if (
                    !studentData[field] ||
                    studentData[field].toString().trim() === ""
                ) {
                    missingField = field;
                    break;
                }
            }

            if (missingField) {
                errors.push({
                    admissionNo: studentData.admissionNo,
                    message: `Field "${missingField}" is required.`,
                });
                continue;
            }

            const existingStudent = await Student.findOne({
                rollNumber: studentData.rollNumber,
            });
            if (existingStudent) {
                errors.push({
                    admissionNo: studentData.admissionNo,
                    message: `Duplicate roll number found: ${studentData.rollNumber}.`,
                });
                continue;
            }

            const dateOfBirth = parseDate(studentData.dateOfBirth);
            const admissionDate = parseDate(studentData.admissionDate);
            const measurementDate = parseDate(
                studentData.measurementDate
            );

            const newStudent = new Student({
                ...restStudentData,
                currentClass: classDoc._id,
                currentSection: sectionDoc._id,
                currentSession: sessionDoc._id,
                password: studentData.password,
                dateOfBirth,
                admissionDate,
                measurementDate,
            });

            const savedStudent = await newStudent.save();

            const studentHistory = {
                session: sessionDoc._id,
                class: classDoc._id,
                classSection: sectionDoc._id,
            };
            const studentHistoryData = await StudentHistory.create(
                studentHistory
            );
            savedStudent.studentHistory.push(studentHistoryData._id);
            await savedStudent.save();

            processedStudents.push(savedStudent);

            const parentData = {
                fatherName: parentsData[i].fatherName,
                motherName: parentsData[i].motherName,
                fatherPhone: parentsData[i].fatherPhone,
                motherPhone: parentsData[i].motherPhone,
                email: parentsData[i].parentEmail,
                password: parentsData[i].parentPassword,
                studentId: savedStudent._id,
            };

            if (
                !parentData.fatherName ||
                parentData.fatherName.toString().trim() === ""
            ) {
                errors.push({
                    admissionNo: studentData.admissionNo,
                    message: "Father's name is required for parent.",
                });
                continue;
            }
            if (
                !parentData.password ||
                parentData.password.toString().trim() === ""
            ) {
                errors.push({
                    admissionNo: studentData.admissionNo,
                    message: "Parent password is required.",
                });
                continue;
            }

            const newParent = new Parent(parentData);
            const savedParent = await newParent.save();

            savedStudent.parent = savedParent._id;
            await savedStudent.save();

            await assignFeeGroupToNewStudents(savedStudent);

            parentDocs.push(savedParent);
        }

        // No need to delete the file since it's stored in memory

        if (errors.length > 0) {
            return res.status(207).json(
                new ApiResponse(
                    207,
                    {
                        successfulStudents: processedStudents,
                        successfulParents: parentDocs,
                        errors: errors,
                    },
                    "Bulk upload processed with some errors."
                )
            );
        } else {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        successfulStudents: processedStudents,
                        successfulParents: parentDocs,
                    },
                    "Bulk upload processed successfully."
                )
            );
        }
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json(
                new ApiResponse(
                    500,
                    null,
                    "An error occurred during bulk upload."
                )
            );
    }
});

function parseDate(dateString) {
    if (!dateString) return null;
    const date = moment(dateString, ['DD-MM-YYYY', 'YYYY-MM-DD', moment.ISO_8601], true);
    return date.isValid() ? date.toDate() : null;
}