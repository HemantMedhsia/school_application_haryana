import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true,
    },
    refreshToken: {
        type: String,
    },
    role: {
        type: String,
        default: "Admin",
    },
    frontendUrl: {
        type: String,
    },
    schoolCode: {
        type: String,
        required: true,
    },
});

adminSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

adminSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

export const Admin = mongoose.model("Admin", adminSchema);
