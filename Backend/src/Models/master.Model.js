import mongoose from "mongoose";

const masterSchema = new mongoose.Schema({
    admin: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
    ],

    school: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School",
        },
    ],

    student: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },
    ],

    teacher: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
        },
    ],

    parent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Parent",
        },
    ],
});

export const Master = mongoose.model("Master", masterSchema);
