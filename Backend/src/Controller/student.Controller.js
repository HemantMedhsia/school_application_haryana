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
import path from "path";
import XLSX from "xlsx";

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

function parseDate(dateValue) {
    if (!dateValue) return null;

    if (typeof dateValue === "string") {
        // Handle both 'dd-mm-yyyy' and 'dd/mm/yyyy' formats
        const parts = dateValue.split(/[-\/]/);
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // JavaScript months are zero-based
            const year = parseInt(parts[2], 10);
            // Create a Date object with UTC to prevent timezone differences
            const date = new Date(Date.UTC(year, month, day));
            return isNaN(date.getTime()) ? null : date;
        }
    } else if (typeof dateValue === "number") {
        const epoch = new Date(Date.UTC(1899, 11, 30));
        const excelDays = dateValue - (dateValue < 60 ? 0 : 1);
        epoch.setDate(epoch.getDate() + excelDays);
        return new Date(
            Date.UTC(
                epoch.getUTCFullYear(),
                epoch.getUTCMonth(),
                epoch.getUTCDate()
            )
        );
    } else if (dateValue instanceof Date) {
        return new Date(
            Date.UTC(
                dateValue.getUTCFullYear(),
                dateValue.getUTCMonth(),
                dateValue.getUTCDate()
            )
        );
    }

    return null;
}

export const UploadBulkStudents = wrapAsync(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: "No file uploaded.",
        });
    }

    const schoolId = req.params.schoolId;

    const filePath = req.file.path;
    const studentsData = [];
    const parentsData = [];
    const errors = [];
    const processedStudents = [];
    const parentDocs = [];

    try {
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        let parsedData = [];

        if (fileExtension === ".csv") {
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on("data", (row) => {
                        parsedData.push(row);
                    })
                    .on("end", resolve)
                    .on("error", reject);
            });
        } else if (fileExtension === ".xls" || fileExtension === ".xlsx") {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            parsedData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        } else {
            throw new Error("Unsupported file format.");
        }

        parsedData.forEach((row) => {
            studentsData.push(row);
            parentsData.push(row);
        });

        const schoolDoc = await School.findById(schoolId);
        if (!schoolDoc) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "School not found."));
        }

        for (let i = 0; i < studentsData.length; i++) {
            const studentData = studentsData[i];
            const parentData = parentsData[i];

            const {
                currentClass,
                currentSection,
                currentSession,
                ...restStudentData
            } = studentData;

            const classDoc = await Class.findOne({ name: currentClass });
            const sectionDoc = await Section.findOne({ name: currentSection });
            const sessionDoc = await Session.findOne({
                sessionYear: currentSession,
            });

            if (!classDoc || !sectionDoc || !sessionDoc) {
                errors.push({
                    admissionNo: studentData.admissionNo,
                    message: `Class, Section, or Session not found.`,
                });
                continue;
            }

            const requiredStudentFields = [
                "admissionNo",
                "rollNumber",
                "password",
                "firstName",
                "gender",
                "mobileNumber",
                "email",
            ];

            let missingStudentField = null;
            for (let field of requiredStudentFields) {
                if (
                    !studentData[field] ||
                    studentData[field].toString().trim() === ""
                ) {
                    missingStudentField = field;
                    break;
                }
            }

            if (missingStudentField) {
                errors.push({
                    admissionNo: studentData.admissionNo,
                    message: `Field "${missingStudentField}" is required for student.`,
                });
                continue;
            }

            const dateOfBirth = parseDate(studentData.dateOfBirth);
            const admissionDate = parseDate(studentData.admissionDate);
            const measurementDate = parseDate(studentData.measurementDate);

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
            if (!schoolDoc.students.includes(savedStudent._id)) {
                schoolDoc.students.push(savedStudent._id);
            }

            await schoolDoc.save();

            const parentRequiredFields = [
                "fatherName",
                "motherName",
                "fatherPhone",
                "motherPhone",
                "parentEmail",
                "parentPassword",
            ];

            let missingParentField = null;
            for (let field of parentRequiredFields) {
                if (
                    !parentData[field] ||
                    parentData[field].toString().trim() === ""
                ) {
                    missingParentField = field;
                    break;
                }
            }

            if (missingParentField) {
                errors.push({
                    admissionNo: studentData.admissionNo,
                    message: `Field "${missingParentField}" is required for parent.`,
                });
                continue;
            }

            const newParent = new Parent({
                fatherName: parentData.fatherName,
                motherName: parentData.motherName,
                fatherPhone: parentData.fatherPhone,
                motherPhone: parentData.motherPhone,
                email: parentData.parentEmail,
                password: parentData.parentPassword,
                studentId: savedStudent._id,
                guardianIs: parentData.guardianIs || null,
                guardianName: parentData.guardianName || null,
                guardianPhone: parentData.guardianPhone || null,
                guardianOccupation: parentData.guardianOccupation || null,
                guardianPhoto: parentData.guardianPhoto || null,
                guardianRelation: parentData.guardianRelation || null,
                guardianAddress: parentData.guardianAddress || null,
            });

            const savedParent = await newParent.save();
            parentDocs.push(savedParent);

            savedStudent.parent = savedParent._id;
            await savedStudent.save();
        }

        await schoolDoc.save();

        fs.unlinkSync(filePath);

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
    } catch (err) {
        console.error(err);

        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
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
