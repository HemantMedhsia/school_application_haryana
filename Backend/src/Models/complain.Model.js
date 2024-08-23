import mongoose from "mongoose";

const ComplainSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
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
    
},{
    timestamps : true,
});

module.exports = mongoose.model("Complain", ComplainSchema);
