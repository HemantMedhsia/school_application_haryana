import wrapAsync from "../Utils/wrapAsync.js";
import { Teacher } from "../Models/teacher.model.js";
import { teacherValidationSchema } from "../Validation/teacher.Validation.js";
import { School } from "../Models/school.model.js";
import { generateAccessToken } from "../Utils/generateAcessToken.js";
import { generateRefreshToken } from "../Utils/generateRefreshToken.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { TeacherAttendance } from "../Models/teacherAttendence.model.js";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import xlsx from "xlsx";

const generateAccessAndRefreshTokens = async (teacherId, next) => {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
        return next(new ApiError(404, "teacher not found"));
    }

    const accessToken = generateAccessToken(teacher);
    const refreshToken = generateRefreshToken(teacher);

    if (!accessToken || !refreshToken) {
        return next(new ApiError(500, "Failed to generate tokens"));
    }

    return { accessToken, refreshToken };
};

export const createTeacher = wrapAsync(async (req, res) => {
    const { error } = teacherValidationSchema.validate(req.body);
    const school = await School.findById(req.params.schoolId);
    if (!school) {
        return res.status(400).json({ message: "School not found" });
    }
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    const teacher = await Teacher.create(req.body);
    school.teachers.push(teacher._id);
    await school.save();
    return res
        .status(201)
        .json(new ApiResponse(201, teacher, "Teacher Created Successfully"));
});

export const loginTeacher = wrapAsync(async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return next(
            new ApiError(400, "Email, password, and role are required")
        );
    }

    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
        console.log("teacher not found");
        return next(new ApiError(404, "teacher does not exist"));
    }

    console.log("teacher found:", teacher.email);

    const isPasswordValid = await teacher.isValidPassword(password);
    console.log("Is password valid:", isPasswordValid);

    if (!isPasswordValid) {
        console.log("Invalid password attempt for teacher:", teacher.email);
        return next(new ApiError(401, " Invalid teacher credentials "));
    }
    if (teacher.role !== role) {
        return next(new ApiError(403, "Unauthorized role"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        teacher._id
    );

    teacher.refreshToken = refreshToken;
    await teacher.save({ validateBeforeSave: false });

    const loggedInTeacher = await Teacher.findById(teacher._id).select(
        "-password"
    );

    // Cookie options
    const options = {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "None",
    };

    // Send the response with cookies and teacher data
    return res
        .status(200)
        .cookie("accessToken", accessToken, options) // include option before production.
        .cookie("refreshToken", refreshToken, options) // include option before production.
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInTeacher,
                    accessToken,
                    refreshToken,
                },
                "Teacher logged in successfully"
            )
        );
});

export const refreshAccessTokenTeacher = wrapAsync(async (req, res, next) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    console.log(req.cookies.refreshToken);

    if (!incomingRefreshToken) {
        return next(new ApiError(401, "Unauthorized request"));
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const teacher = await Teacher.findById(decodedToken?.id);

        if (!teacher) {
            return next(new ApiError(401, "Invalid refresh token"));
        }

        if (incomingRefreshToken !== teacher?.refreshToken) {
            return next(new ApiError(401, "Refresh token is expired or used"));
        }

        const options = {
            httpOnly: true,
            secure: false,
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Strict",
        };

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshTokens(teacher._id);
        teacher.refreshToken = newRefreshToken;
        await teacher.save({ validateBeforeSave: false });

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        return next(
            new ApiError(401, error?.message || "Invalid refresh token")
        );
    }
});

export const getTeachers = wrapAsync(async (req, res) => {
    const teachers = await Teacher.find();
    return res.status(200).json(new ApiResponse(200, teachers));
});

export const getTeacher = wrapAsync(async (req, res) => {
    const teacher = await Teacher.findById(req.params.teacherId);
    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }
    return res.status(200).json(new ApiResponse(200, teacher));
});

export const updateTeacher = wrapAsync(async (req, res) => {
    const teacher = await Teacher.findByIdAndUpdate(
        req.params.teacherId,
        req.body,
        {
            new: true,
        }
    );
    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }
    return res
        .status(200)
        .json(new ApiResponse(200, teacher, "Update detail Successfully"));
});

export const deleteTeacher = wrapAsync(async (req, res) => {
    const teacher = await Teacher.findByIdAndDelete(req.params.teacherId);
    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }
    return res
        .status(200)
        .json(new ApiResponse(200, teacher, "Teacher deleted successfully"));
});

export const getTeacherAttendance = wrapAsync(async (req, res) => {
    const teacher = await Teacher.findById(req.params.teacherId).populate(
        "teacherAttendance"
    );
    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }
    // res.status(200).json({ teacherAttendance: teacher.teacherAttendance });
    return res
        .status(200)
        .json(new ApiResponse(200, teacher.teacherAttendance));
});

export const getAttendanceAndTeacherCount = wrapAsync(async (req, res) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const attendanceRecords = await TeacherAttendance.find({
        date: {
            $gte: startDate,
            $lte: endDate,
        },
    }).populate({
        path: "teacherId",
        select: "gender",
    });

    const maleAttendance = Array(7).fill(0);
    const femaleAttendance = Array(7).fill(0);

    attendanceRecords.forEach((record) => {
        const dayOfWeek = record.date.getDay();
        if (record.status === "Present") {
            if (record.teacherId.gender === "Male") {
                maleAttendance[dayOfWeek]++;
            } else if (record.teacherId.gender === "Female") {
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

    const totalCounts = await Teacher.aggregate([
        {
            $group: {
                _id: "$gender",
                count: { $sum: 1 },
            },
        },
    ]);

    const totalTeacher = totalCounts.reduce((acc, curr) => acc + curr.count, 0);
    const totalMaleTeachers =
        totalCounts.find((g) => g._id === "Male")?.count || 0;
    const totalFemaleTeachers =
        totalCounts.find((g) => g._id === "Female")?.count || 0;

    const response = {
        attendanceData: barChartData,
        totalTeacher,
        totalMaleTeachers,
        totalFemaleTeachers,
    };

    return res.status(200).json(new ApiResponse(200, response));
});

export const uploadBulkTeacherData = wrapAsync(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: "No file uploaded.",
        });
    }

    const schoolId = req.params.schoolId;
    const filePath = req.file.path;
    const teacherData = [];
    const errors = [];
    const processedTeachers = [];

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
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            parsedData = xlsx.utils.sheet_to_json(worksheet, { defval: null });
        } else {
            throw new Error("Unsupported file format.");
        }

        parsedData.forEach((row) => {
            teacherData.push(row);
        });

        const schoolDoc = await School.findById(schoolId);
        if (!schoolDoc) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "School not found."));
        }

        for (let i = 0; i < teacherData.length; i++) {
            const data = teacherData[i];

            const { error } = teacherValidationSchema.validate(data);
            if (error) {
                console.error(
                    `Validation error for record #${i + 1}:`,
                    error.details
                );
                errors.push({
                    email: data.email || "undefined",
                    message: `Validation error for teacher ${
                        data.name || "undefined"
                    }: ${error.message}`,
                });
                continue;
            }

            const existingTeacher = await Teacher.findOne({
                email: data.email,
            });
            if (existingTeacher) {
                errors.push({
                    email: data.email,
                    message: `Teacher with email ${data.email} already exists. Skipping this record.`,
                });
                continue;
            }

            const newTeacher = new Teacher({
                ...data,
                school: schoolId,
            });

            const savedTeacher = await newTeacher.save();
            processedTeachers.push(savedTeacher);

            schoolDoc.teachers.addToSet(savedTeacher._id);
        }

        await schoolDoc.save();
        fs.unlinkSync(filePath);

        return res.status(207).json(
            new ApiResponse(
                207,
                {
                    successfulTeachers: processedTeachers,
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
