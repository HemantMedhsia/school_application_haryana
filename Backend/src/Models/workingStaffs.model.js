import mongoose from 'mongoose';

// Define the schema for the working staff
const workingStaffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    hireDate: {
        type: Date,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    isFullTime: {
        type: Boolean,
        required: true
    },
    staffLoginPassword: {
        type: String,
        required: true
    },
});

workingStaffSchema.pre("save", async function (next) {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(
            this.staffLoginPassword,
            salt
        );
        // Replace the plain password with the hashed password
        this.staffLoginPassword = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

workingStaffSchema.methods.isValidPassword = async function (staffLoginPassword) {
    try {
        return await bcrypt.compare(
            staffLoginPassword,
            this.staffLoginPassword
        );
    } catch (error) {
        throw new Error(error);
    }
};

// Create the working staff model
export const WorkingStaff = mongoose.model('WorkingStaff', workingStaffSchema);
