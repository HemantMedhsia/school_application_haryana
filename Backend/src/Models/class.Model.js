import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            enum: ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            required: true,
        }
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
