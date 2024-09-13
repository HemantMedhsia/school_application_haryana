import Joi from "joi";

export const classValidationSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Class name should be a string",
        "any.required": "Class name is required",
    }),
    description: Joi.string().optional().messages({
        "string.base": "Description should be a string",
    }),
    subjectGroups: Joi.array()
        .items(Joi.string().length(24).hex())
        .optional()
        .messages({
            "array.base": "Subject groups should be an array",
            "string.hex": "Subject group IDs must be valid ObjectID",
            "string.length": "Subject group IDs must be 24 characters long",
        }),
    sections: Joi.array().items(Joi.string()).required().messages({
        "array.base": "Sections should be an array of strings",
        "any.required": "Sections are required",
    }),
});
