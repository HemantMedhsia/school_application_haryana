import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { StudentAttendance } from "./studentAttendence.Model.js";
import { FeeGroup } from "./feeGroup.Model.js";

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
        index: true,
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
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: Number,
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
        default:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    siblingGroupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SiblingGroup",
        index: true,
    },
    feeGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FeeGroup",
    },
    studentFees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentFee",
        },
    ],
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

studentSchema.methods.getAttendanceStats = async function () {
    const totalClasses = await StudentAttendance.countDocuments({
        studentId: this._id,
    });

    const presentCount = await StudentAttendance.countDocuments({
        studentId: this._id,
        status: "Present",
    });
    console.log(presentCount);
    const absentCount = totalClasses - presentCount;
    const percentage =
        totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

    return {
        totalClasses,
        present: presentCount,
        absent: absentCount,
        percentage: percentage.toFixed(2),
    };
};

export const Student = mongoose.model("Student", studentSchema);

export const assignFeeGroupToNewStudents = async (newStudent) => {
    const feeGroup = await FeeGroup.findOne({ class: newStudent.currentClass });
    if (feeGroup) {
        const dueAmount =
            feeGroup.fees.tuitionFee +
            feeGroup.fees.admissionFee +
            feeGroup.fees.annualFee +
            feeGroup.fees.otherFee;

        const studentFee = await StudentFee.create({
            student: newStudent._id,
            class: newStudent.currentClass,
            feeGroup: feeGroup._id,
            dueAmount: dueAmount,
        });

        newStudent.studentFees.push(studentFee._id);
        newStudent.feeGroup = feeGroup._id;
        await newStudent.save();
    }
};
