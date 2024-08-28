import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
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
