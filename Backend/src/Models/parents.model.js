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
    guardianEmail: {
        type: String,
    },
    guardianPhoto: {
        type: String,
    },
    guardianAddress: {
        type: String,
    },
    parentLoginPassword: {
        type: String,
        required: true,
    },
    refershToken: {
        type: String,
    },
});

parentSchema.pre("save", async function (next) {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(
            this.parentLoginPassword,
            salt
        );
        // Replace the plain password with the hashed password
        this.parentLoginPassword = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

parentSchema.methods.isValidPassword = async function (parentLoginPassword) {
    try {
        return await bcrypt.compare(
            parentLoginPassword,
            this.parentLoginPassword
        );
    } catch (error) {
        throw new Error(error);
    }
};

export const Parent = mongoose.model("Parent", parentSchema);
