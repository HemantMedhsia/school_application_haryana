import { Admin } from "../Models/admin.Model.js";
import { School } from "../Models/school.model.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { adminValidationSchema } from "../Validation/admin.Validation.js";
import { ApiError } from "../Utils/errorHandler.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../Utils/generateAcessToken.js";
import { generateRefreshToken } from "../Utils/generateRefreshToken.js";
import { Master } from "../Models/master.Model.js";
import { generateAccessTokenAdmin } from "../Utils/generateAccessTokenAdmin.js";
import { generateRefreshTokenAdmin } from "../Utils/generateRefreshTokenAdmin.js";

const generateAccessAndRefreshTokens = async (adminId, next) => {
    const admin = await Admin.findById(adminId);

    if (!admin) {
        return next(new ApiError(404, "Admin not found"));
    }
    const accessToken = generateAccessTokenAdmin(admin);
    const refreshToken = generateRefreshTokenAdmin(admin);

    admin.refreshToken = refreshToken;

    await admin.save({ validateBeforeSave: false });

    if (!accessToken || !refreshToken) {
        return next(new ApiError(500, "Failed to generate tokens"));
    }

    return { accessToken, refreshToken };
};

// export const createAdmin = wrapAsync(async (req, res) => {
//     const school = await School.findById(req.params.schoolId);
//     if (!school) {
//         return res.status(404).json({ error: "School not found" });
//     }

//     const adminData = { ...req.body, school: req.params.schoolId };
//     await adminValidationSchema.validateAsync(adminData, {
//         abortEarly: false,
//     });

//     const admin = new Admin(adminData);
//     const savedAdmin = await admin.save();
//     school.admin.push(savedAdmin._id);
//     await school.save();
//     return res
//         .status(201)
//         .json(
//             new ApiResponse(201, savedAdmin, "Admin registered Successfully")
//         );
// });

export const createAdmin = wrapAsync(async (req, res) => {
    const school = await School.findById(req.params.schoolId);
    if (!school) {
        return res.status(404).json({ error: "School not found" });
    }

    const adminData = { ...req.body, school: req.params.schoolId };
    await adminValidationSchema.validateAsync(adminData, {
        abortEarly: false,
    });

    const admin = new Admin(adminData);
    const savedAdmin = await admin.save();

    school.admin.push(savedAdmin._id);
    await school.save();

    let masterData = await Master.findOne();
    if (!masterData) {
        masterData = new Master({ admin: [], school: [] });
    }
    masterData.admin.push(savedAdmin._id);
    if (!masterData.school.includes(school._id)) {
        masterData.school.push(school._id);
    }
    await masterData.save();

    return res
        .status(201)
        .json(
            new ApiResponse(201, savedAdmin, "Admin registered successfully")
        );
});

// export const loginAdmin = wrapAsync(async (req, res, next) => {
//     const { email, password, role } = req.body;

//     if (!email || !password || !role) {
//         return next(
//             new ApiError(400, "Email , password and role are required")
//         );
//     }

//     const admin = await Admin.findOne({ email });

//     if (!admin) {
//         console.log("Admin not found");
//         return next(new ApiError(404, "Admin does not exist"));
//     }

//     console.log("Admin found:", admin.email);

//     const isPasswordValid = await admin.isValidPassword(password);
//     console.log("Is password valid:", isPasswordValid);

//     if (!isPasswordValid) {
//         console.log("Invalid password attempt for admin:", admin.email);
//         return next(new ApiError(401, "Invalid admin credentials"));
//     }

//     if (admin.role !== role) {
//         return next(new ApiError(403, "Unauthorized role"));
//     }

//     const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
//         admin._id
//     );

//     admin.refreshToken = refreshToken;
//     await admin.save({ validateBeforeSave: false });

//     return res
//         .status(200)
//         .cookie("accessToken", accessToken)
//         .cookie("refreshToken", refreshToken)
//         .json(
//             new ApiResponse(
//                 200,
//                 {
//                     user: admin,
//                     accessToken,
//                     refreshToken,
//                 },
//                 "Admin logged in successfully"
//             )
//         );
// });

export const loginAdmin = wrapAsync(async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return next(
            new ApiError(400, "Email, password, and role are required")
        );
    }

    const masterData = await Master.findOne({
        admin: { $exists: true },
    }).populate("admin");
    if (!masterData) {
        return next(
            new ApiError(404, "No admins found in the Master database")
        );
    }

    const admin = masterData.admin.find((admin) => admin.email === email);
    if (!admin) {
        console.log("Admin not found");
        return next(new ApiError(404, "Admin does not exist"));
    }

    console.log("Admin found:", admin.email);

    const isPasswordValid = await admin.isValidPassword(password);
    console.log("Is password valid:", isPasswordValid);

    if (!isPasswordValid) {
        console.log("Invalid password attempt for admin:", admin.email);
        return next(new ApiError(401, "Invalid admin credentials"));
    }

    if (admin.role !== role) {
        return next(new ApiError(403, "Unauthorized role"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        admin._id
    );

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return res
        .status(200)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", refreshToken)
        .json(
            new ApiResponse(
                200,
                {
                    user: admin,
                    accessToken,
                    refreshToken,
                },
                "Admin logged in successfully"
            )
        );
});

export const refreshAccessTokenAdmin = wrapAsync(async (req, res, next) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return next(new ApiError(401, "Unauthorized request"));
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        return next(new ApiError(401, "Invalid refresh token"));
    }

    const admin = await Admin.findById(decodedToken?.id);
    if (!admin) {
        return next(new ApiError(401, "Invalid refresh token"));
    }

    if (incomingRefreshToken !== admin?.refreshToken) {
        return next(new ApiError(401, "Refresh token is expired or used"));
    }

    const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshTokens(admin._id);

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
});

export const getAdmins = wrapAsync(async (req, res) => {
    const admins = await Admin.find();
    return res.status(200).json(new ApiResponse(200, admins));
});

export const getAdminById = wrapAsync(async (req, res) => {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
    }
    return res.status(200).json(new ApiResponse(200, admin));
});

export const updateAdmin = wrapAsync(async (req, res) => {
    const { id } = req.params;

    const admin = await Admin.findByIdAndUpdate(id, req.body, { new: true });
    if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
    }
    return res
        .status(200)
        .json(new ApiResponse(200, admin, "Admin update successfully "));
});

export const deleteAdmin = wrapAsync(async (req, res) => {
    const { id } = req.params;

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, admin, "Admin deleted successfully"));
});

export const verifyAdminAccessToken = wrapAsync(async (req, res, next) => {});
