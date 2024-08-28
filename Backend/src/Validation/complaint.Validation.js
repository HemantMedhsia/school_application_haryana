import Joi from "joi";
import mongoose from "mongoose";

export const complaintValidationSchema = Joi.object({
    createdBy: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("any.invalid");
            }
            return value;
        })
        .required(),
    category: Joi.string()
        .valid("Academic", "Disciplinary", "Facilities", "Staff", "Other")
        .required(),
    description: Joi.string().required(),
    status: Joi.string()
        .valid("Pending", "Resolved", "In Progress")
        .default("Pending"),
    resolutionNotes: Joi.string().default("").optional(),
    attachments: Joi.array().items(
        Joi.object({
            filename: Joi.string(),
            url: Joi.string(),
        })
    ),
});
