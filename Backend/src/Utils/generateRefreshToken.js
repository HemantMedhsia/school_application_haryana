import jwt from 'jsonwebtoken'

const generateRefreshToken = (user) => {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "4m" }
    );
};