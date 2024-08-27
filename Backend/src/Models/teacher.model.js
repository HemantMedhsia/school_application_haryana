import mongoose from "mongoose";
import bcrypt from "bcrypt";

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    teacherLoginPassword: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true,
    },
    profile: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    adharNo: {
        type: Number,
        required: true,
    },
    panNo: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
    },
    teacherAttendance: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TeacherAttendance",
        },
    ],
    refreshToken: {
        type: String,
    },
    role: {
        type: String,
        default: "Teacher",
    },
});

teacherSchema.pre("save", async function (next) {
    try {
        // Hash the password only if it has been modified or is new
        if (!this.isModified("teacherLoginPassword")) return next();

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.teacherLoginPassword = await bcrypt.hash(
            this.teacherLoginPassword,
            salt
        );
        next();
    } catch (error) {
        next(error);
    }
});

// Method to validate the password
teacherSchema.methods.isValidPassword = async function (teacherLoginPassword) {
    try {
        return await bcrypt.compare(
            teacherLoginPassword,
            this.teacherLoginPassword
        );
    } catch (error) {
        throw new Error(error);
    }
};
export const Teacher = mongoose.model("Teacher", teacherSchema);
