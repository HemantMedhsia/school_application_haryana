import { Parent } from "../Models/parents.model.js";
import { Student } from "../Models/student.model.js";
import { ApiError } from "../Utils/errorHandler.js";
import { generateAccessToken } from "../Utils/generateAcessToken.js";
import { generateRefreshToken } from "../Utils/generateRefreshToken.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import wrapAsync from "../utils/wrapAsync.js";
import { parentValidatonSchema } from "../Validation/parent.Validation.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (parentId, next) => {
    const parent = await Parent.findById(parentId);

    if (!parent) {
        return next(new ApiError(404, "Parent not found"));
    }

    const accessToken = generateAccessToken(parent);
    const refreshToken = generateRefreshToken(parent);

    if (!accessToken || !refreshToken) {
        return next(new ApiError(500, "Failed to generate tokens"));
    }

    return { accessToken, refreshToken };
};

export const createParent = wrapAsync(async (req, res) => {
    await parentValidatonSchema.validateAsync(req.body, {
        abortEarly: false,
    });
    const parent = new Parent(req.body);
    const parentData = await parent.save();

    // Find the student by student id
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);
    if (!student) {
        throw new NotFoundError(`Student with id ${studentId} not found`);
    }

    // Assign parent id to the student schema
    student.parent = parentData._id;
    await student.save();

    res.status(201).json({
        success: true,
        data: parent,
    });
});

export const loginParent = wrapAsync(async (req, res, next) => {
    const { guardianEmail, parentLoginPassword } = req.body;

    if (!guardianEmail) {
        return next(new ApiError(400, "email is required"));
    }

    // Use findOne to get a single document
    const parent = await Parent.findOne({ guardianEmail });

    if (!parent) {
        console.log("parent not found");
        return next(new ApiError(404, "parent does not exist"));
    }

    console.log("parent found:", parent.guardianEmail);

    const isPasswordValid = await parent.isValidPassword(parentLoginPassword);
    console.log("Is password valid:", isPasswordValid);

    if (!isPasswordValid) {
        console.log("Invalid password attempt for parent:", parent.email);
        return next(new ApiError(401, " Invalid parent credentials "));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        parent._id
    );

    parent.refreshToken = refreshToken;
    await parent.save();

    const loggedInparent = await Parent.findById(parent._id).select(
        "-parentLoginPassword -refreshToken"
    );

    // Cookie options
    // const options = {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production", // Set secure to true in production
    // };

    // Send the response with cookies and parent data
    return res
        .status(200)
        .cookie("accessToken", accessToken) // include option before production.
        .cookie("refreshToken", refreshToken) // include option before production.
        .json(
            new ApiResponse(
                200,
                {
                    parent: loggedInparent,
                    accessToken,
                    refreshToken,
                },
                "Parent logged in successfully"
            )
        );
});

export const refreshAccessTokenParent = wrapAsync(async (req, res, next) => {
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

        const parent = await Parent.findById(decodedToken?.id);

        if (!parent) {
            return next(new ApiError(401, "Invalid refresh token"));
        }

        if (incomingRefreshToken !== parent?.refreshToken) {
            return next(new ApiError(401, "Refresh token is expired or used"));
        }

        // const options = {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        // };

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshTokens(parent._id);
        parent.refreshToken = newRefreshToken;
        await parent.save({ validateBeforeSave: false });

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

export const getParents = wrapAsync(async (req, res) => {
    const parents = await Parent.find();
    res.status(200).json({
        success: true,
        data: parents,
    });
});

export const getParent = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const parent = await Parent.findById(id);
    if (!parent) {
        throw new NotFoundError(`Parent with id ${id} not found`);
    }
    res.status(200).json({
        success: true,
        data: parent,
    });
});

export const updateParent = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const parent = await Parent.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!parent) {
        throw new NotFoundError(`Parent with id ${id} not found`);
    }
    res.status(200).json({
        success: true,
        data: parent,
    });
});

export const deleteParent = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const parent = await Parent.findByIdAndDelete(id);
    if (!parent) {
        throw new NotFoundError(`Parent with id ${id} not found`);
    }
    res.status(200).json({
        success: true,
        data: {},
    });
});
