import mongoose from "mongoose";

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
});

teacherSchema.pre("save", async function (next) {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(
            this.teacherLoginPassword,
            salt
        );
        // Replace the plain password with the hashed password
        this.teacherLoginPassword = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

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

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
