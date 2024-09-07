import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { required } from "joi";

const studentSchema = new mongoose.Schema({
    admissionNo: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    currentClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    currentSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true,
    },
    currentSession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    gender: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
    },
    religion: {
        type: String,
    },
    caste: {
        type: String,
    },
    age: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        index: true,
    },
    admissionDate: {
        type: Date,
    },
    studentPhoto: {
        type: String,
        required: true,
    },
    bloodGroup: {
        type: String,
    },
    house: {
        type: String,
    },
    height: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    measurementDate: {
        type: Date,
    },
    medicalHistory: {
        type: String,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent",
        required: true,
    },
    StudentAttendance: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentAttendance",
        },
    ],
    complaints: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
        },
    ],
    studentHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentHistory",
        },
    ],
    marks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Marks",
        },
    ],
    refreshToken: {
        type: String,
    },
    role: {
        type: String,
        default: "Student",
    },
});

studentSchema.pre("save", async function (next) {
    try {
        // Hash the password only if it has been modified or is new
        if (!this.isModified("password")) return next();

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to validate the password
studentSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

export const Student = mongoose.model("Student", studentSchema);
