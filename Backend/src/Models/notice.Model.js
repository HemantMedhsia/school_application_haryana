import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin", // or 'Teacher', depending on who can create notices
        required: true,
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true,
    },
    category: {
        type: String,
        enum: ["Announcement", "Event", "Holiday", "General"],
        default: "General",
    },
    audience: {
        type: String,
        enum: ["Student", "Teachers", "Parents", "All"],
        default: ["All"],
    },
    attachments: [
        {
            filename: String,
            url: String,
        },
    ],
    expirationDate: {
        type: Date,
    },
});

export const Notice = mongoose.model("Notice", NoticeSchema);
