import Joi from "joi";

const feesTypeValidationSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name is required.",
        "string.base": "Name must be a string.",
    }),

    feesCode: Joi.string().required().messages({
        "any.required": "Fees code is required.",
        "string.base": "Fees code must be a string.",
    }),

    description: Joi.string().optional().messages({
        "string.base": "Description must be a string.",
    }),
});

export const validateFeesType = (data) =>
    feesTypeValidationSchema.validate(data);
