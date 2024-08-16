import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirm_password: { type: String, required: true },
    school: [{ type: mongoose.Schema.Types.ObjectId, ref: "SchoolModel" }],
    school_admin: [
        { type: mongoose.Schema.Types.ObjectId, ref: "SchoolAdminModel" },
    ],
});
