import wrapAsync from "../Utils/wrapAsync.js";
import { Teacher } from "../Models/teacher.model.js";
import { teacherValidationSchema } from "../Validation/teacher.Validation.js";
import { School } from "../Models/school.model.js";
import { generateAccessToken } from "../Utils/generateAcessToken.js";
import { generateRefreshToken } from "../Utils/generateRefreshToken.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import jwt from "jsonwebtoken";

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
    const { email, teacherLoginPassword, role } = req.body;

    if (!email || !teacherLoginPassword || !role) {
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

    const isPasswordValid = await teacher.isValidPassword(teacherLoginPassword);
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
    await teacher.save();

    const loggedInTeacher = await Teacher.findById(teacher._id).select(
        "-teacherLoginPassword -refreshToken"
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
                    teacher: loggedInTeacher,
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
