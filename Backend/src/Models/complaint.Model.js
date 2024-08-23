import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
    {
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher", // Assuming you have a Teacher model
            required: true,
        },
        category: {
            type: String,
            enum: ["Academic", "Disciplinary", "Facilities", "Staff", "Other"],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Resolved", "In Progress"],
            default: "Pending",
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
        resolutionNotes: {
            type: String,
            default: "",
        },
        attachments: [
            {
                filename: String,
                url: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Complaint = mongoose.model("Complaint", ComplaintSchema);
