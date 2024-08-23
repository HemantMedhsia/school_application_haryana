import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    school: [{ type: mongoose.Schema.Types.ObjectId, ref: "School" }],
    school_admin: [
        { type: mongoose.Schema.Types.ObjectId, ref: "SchoolAdmin" },
    ],
});

superAdminSchema.pre('save', async function(next) {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(this.password, salt);
        // Replace the plain password with the hashed password
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

superAdminSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

export const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);
