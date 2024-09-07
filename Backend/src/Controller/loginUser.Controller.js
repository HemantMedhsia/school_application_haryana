import { Admin } from "../Models/admin.Model.js";
import { Teacher } from "../Models/teacher.model.js";
import { Parent } from "../Models/parents.model.js";
import { Student } from "../Models/student.model.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../Utils/generateAcessToken.js";
import { generateRefreshToken } from "../Utils/generateRefreshToken.js";
import rateLimit from "express-rate-limit";
import { ApiError } from "../Utils/errorHandler.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { loginSchema } from "../Validation/login.Validation.js";

export const loginLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 5, // Limit each IP to 5 login requests per window
    message: "Too many login attempts from this IP, please try again later.",
});

export const loginHandler = wrapAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate the request body
    const { error } = loginSchema.validate({ email, password });
    if (error) {
        return next(new ApiError(400, error.details[0].message));
    }

    // Single query to find the user across all roles
    let user;
    try {
        user = await Promise.any([
            Admin.findOne({ email }).lean().then((user) => ({ user, model: Admin })),
            Teacher.findOne({ email }).lean().then((user) => ({ user, model: Teacher })),
            Parent.findOne({ email }).lean().then((user) => ({ user, model: Parent })),
            Student.findOne({ email }).lean().then((user) => ({ user, model: Student })),
        ]);
    } catch (error) {
        return next(new ApiError(500, "Internal server error while searching for user."));
    }

    // If user is not found
    if (!user || !user.user) {
        return next(new ApiError(404, "User not found"));
    }

    // Validate the password
    const isValidPassword = await bcrypt.compare(password, user.user.password);
    if (!isValidPassword) {
        return next(new ApiError(401, "Invalid credentials"));
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.user);
    const refreshToken = generateRefreshToken(user.user);

    // Update refreshToken in the corresponding model
    await user.model.updateOne({ email }, { $set: { refreshToken } });

    // Send response with tokens
    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        })
        .json(
            new ApiResponse(
                200,
                { user: user.user, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});
