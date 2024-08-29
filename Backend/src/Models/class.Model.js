import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        }, 

        sections: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Section",
            },
        ],

        subjects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject", // Reference to the Subject model
            },
        ], // List of subjects assigned to this class
    },
    {
        timestamps: true,
    }
);

// Middleware to update the updatedAt field before saving
classSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create the Class model based on the schema
export const Class = mongoose.model("Class", classSchema);
