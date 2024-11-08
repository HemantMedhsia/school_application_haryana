import jwt from "jsonwebtoken";
export const generateAccessTokenAdmin = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            schoolId: user.school,
            frontendUrl: user.frontendUrl,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
};
