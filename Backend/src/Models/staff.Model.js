import mongoose from "mongoose";
import bcrypt from "bcrypt";
const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: [
            "Cleaning",
            "Security",
            "Care Taker",
            "Peon",
            "Office Staff",
            "Librarian",
            "Other",
        ],
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    staffAttendance: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StaffAttendance",
        },
    ],
    dateJoined: {
        type: Date,
        default: Date.now,
    },
    refreshToken: {
        type: String,
    },
});

staffSchema.pre("save", async function (next) {
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
staffSchema.methods.isValidPassword = async function (staffLoginPassword) {
    try {
        return await bcrypt.compare(
            password,
            this.password
        );
    } catch (error) {
        throw new Error(error);
    }
};

export const Staff = mongoose.model("Staff", staffSchema);
