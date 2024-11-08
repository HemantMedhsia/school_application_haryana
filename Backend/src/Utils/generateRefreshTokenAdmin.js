import jwt from "jsonwebtoken";

export const generateRefreshTokenAdmin = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            schoolId: user.school,
            frontendUrl: user.frontendUrl,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1h" }
    );
};
