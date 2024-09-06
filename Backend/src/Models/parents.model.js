import mongoose from "mongoose";
import bcrypt from "bcrypt";

const parentSchema = new mongoose.Schema({
    fatherName: {
        type: String,
        required: true,
    },
    fatherPhone: {
        type: String,
        required: true,
    },
    fatherOccupation: {
        type: String,
        required: true,
    },
    fatherPhoto: {
        type: String,
    },
    motherName: {
        type: String,
        required: true,
    },
    motherPhone: {
        type: String,
        required: true,
    },
    motherOccupation: {
        type: String,
        required: true,
    },
    motherPhoto: {
        type: String,
    },
    guardianIs: {
        type: String,
        enum: ["Father", "Mother", "Other"],
        required: true,
    },
    guardianName: {
        type: String,
        required: true,
    },
    guardianRelation: {
        type: String,
    },
    guardianPhone: {
        type: String,
        required: true,
    },
    guardianOccupation: {
        type: String,
    },
    email: {
        type: String,
    },
    guardianPhoto: {
        type: String,
    },
    guardianAddress: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
    role: {
        type: String,
        default: "Parent",
    },
});

parentSchema.pre("save", async function (next) {
    try {
        // Hash the password only if it has been modified or is new
        if (!this.isModified("password")) return next();

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(
            this.password,
            salt
        );
        next();
    } catch (error) {
        next(error);
    }
});

// Method to validate the password
parentSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(
            password,
            this.password
        );
    } catch (error) {
        throw new Error(error);
    }
};

export const Parent = mongoose.model("Parent", parentSchema);
