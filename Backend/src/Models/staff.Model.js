import mongoose from "mongoose";
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
    staffLoginPassword: {
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
});

staffSchema.pre("save", async function (next) {
    try {
        // Hash the password only if it has been modified or is new
        if (!this.isModified("parentLoginPassword")) return next();

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.staffLoginPassword = await bcrypt.hash(
            this.staffLoginPassword,
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
            staffLoginPassword,
            this.staffLoginPassword
        );
    } catch (error) {
        throw new Error(error);
    }
};

export const Staff = mongoose.model("Staff", staffSchema);
