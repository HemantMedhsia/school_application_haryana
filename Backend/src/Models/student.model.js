import mongoose from "mongoose";
import bcrypt from "bcrypt";

const studentSchema = new mongoose.Schema({
    admissionNo: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
    },
    studentLoginPassword: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    section: {
        type: String,
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
    mobileNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
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
    complaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
    }],

});

studentSchema.pre("save", async function (next) {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(
            this.studentLoginPassword,
            salt
        );
        // Replace the plain password with the hashed password
        this.studentLoginPassword = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

studentSchema.methods.isValidPassword = async function (studentLoginPassword) {
    try {
        return await bcrypt.compare(
            studentLoginPassword,
            this.studentLoginPassword
        );
    } catch (error) {
        throw new Error(error);
    }
};

export const Student = mongoose.model("Student", studentSchema);
