import mongoose from "mongoose";
import bcrypt from "bcrypt";

const parentSchema = new mongoose.Schema({
    fatherName: {
        type: String,
        required: true,
    },
    fatherPhone: {
        type: Number,
    },
    fatherOccupation: {
        type: String,
    },
    fatherPhoto: {
        type: String,
    },
    motherName: {
        type: String,
    },

    motherPhone: {
        type: Number,
    },
    motherOccupation: {
        type: String,
    },
    motherPhoto: {
        type: String,
    },
    guardianIs: {
        type: String,
    },
    guardianName: {
        type: String,
    },
    guardianRelation: {
        type: String,
    },
    guardianPhone: {
        type: Number,
    },
    guardianOccupation: {
        type: String,
    },
    email: {
        type: String,
        index: true,
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

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    },
});

parentSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

parentSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

export const Parent = mongoose.model("Parent", parentSchema);
