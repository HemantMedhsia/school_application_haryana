import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, // Trims whitespace from the string
        }, // e.g., "A", "B", "C", "D"

        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class", // Reference to the Class model
            required: true,
        }, // Reference to the class this section belongs to
    },
    { timestamps: true }
);

// Export the Section model
export const Section = mongoose.model("Section", sectionSchema);
