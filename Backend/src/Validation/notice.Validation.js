import Joi from "joi";
import mongoose from "mongoose";

export const noticeValidationSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().default(Date.now()),
    createdBy: Joi.string().optional(), // You can validate this as an ObjectId if needed
    schoolId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("any.invalid");
            }
            return value;
        })
        .optional(),
    category: Joi.string()
        .valid("Announcement", "Event", "Holiday", "General")
        .default("General"),
    audience: Joi.string()
        .valid("Student", "Teachers", "Parents", "All")
        .default("All"),
    attachments: Joi.array().items(
        Joi.object({
            filename: Joi.string().required(),
            url: Joi.string().uri().required(),
        })
    ),
    expirationDate: Joi.date().optional(),
});
