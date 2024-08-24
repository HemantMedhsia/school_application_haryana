import { School } from "../Models/school.model.js";
import { Student } from "../Models/student.model.js";
import { ApiError } from "../Utils/errorHandler.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { studentValidationSchema } from "../Validation/student.Validation.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = wrapAsync(async (studentId, next) => {
    const student = await Student.findById(studentId);

    if (!student) {
        return next(new ApiError(404, "Student not found"));
    }

    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();
    console.log("Access", accessToken);
    console.log("Refresh", refreshToken);

    student.refershToken = refreshToken;

    await student.save({ validateBeforeSave: false });

    if (!accessToken || !refreshToken) {
        return next(ApiError(500, "Failed to generate tokens"));
    }

    return { accessToken, refreshToken };
});

export const createStudent = wrapAsync(async (req, res) => {
    await studentValidationSchema.validateAsync(req.body, {
        abortEarly: false,
    });
    try {
        const school = await School.findById(req.params.schoolId);
        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found",
            });
        }
        const student = new Student(req.body);
        const studentData = await student.save();
        school.students.push(studentData._id);
        await school.save();

        res.status(201).json({
            success: true,
            data: student,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const loginStudent = wrapAsync(async (req, res, next) => { 
    const { rollNumber, email, studentLoginPassword } = req.body;

    if (!rollNumber && !email) {
        return next(ApiError(400, "Roll number or email is required"));
    }

    const student = await Student.findOne({
        $or: [{ rollNumber }, { email }],
    });

    if (!student) {
        console.log("Student not found");
        return next(ApiError(404, "Student does not exist"));
    }

    console.log("Student found:", student.email);

    const isPasswordValid = await student.isValidPassword(studentLoginPassword);
    console.log("Is password valid:", isPasswordValid);

    if (!isPasswordValid) {
        console.log("Invalid password attempt for student:", student.email);
        return next(new ApiError(401, " Invalid student credentials "));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        student._id
    );

    student.refershToken = refreshToken;
    await student.save();

    const loggedInStudent = await Student.findById(student._id).select(
        "-studentLoginPassword -refershToken"
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
                    student: loggedInStudent,
                    accessToken,
                    refreshToken,
                },
                "Student logged in successfully"
            )
        );
});

export const refreshAccessToken = wrapAsync(async (req, res, next) => {
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

        const student = await Student.findById(decodedToken?._id);

        if (!student) {
            return next(new ApiError(401, "Invalid refresh token"));
        }

        if (incomingRefreshToken !== student?.refershToken) {
            return next(new ApiError(401, "Refresh token is expired or used"));
        }

        // const options = {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        // };

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshTokens(student._id);
        // student.refershToken = newRefreshToken;
        // await student.save({ validateBeforeSave: false });

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
    try {
        const students = await Student.find();
        res.status(200).json({
            success: true,
            data: students,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const getStudent = wrapAsync(async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }
        res.status(200).json({
            success: true,
            data: student,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const updateStudent = wrapAsync(async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }
        res.status(200).json({
            success: true,
            data: student,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const deleteStudent = wrapAsync(async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }
        res.status(200).json({
            success: true,
            data: student,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const getStudentByParent = wrapAsync(async (req, res) => {
    try {
        const student = await Student.find({ parent: req.params.parentId });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }
        res.status(200).json({
            success: true,
            data: student,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
