import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
    },
    post: {
        type: String,
        required: true,
        trim: true,
    },
});

export const Contact = mongoose.model("Contact", contactSchema);
