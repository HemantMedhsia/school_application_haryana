// validations/subjectValidation.js
import Joi from "joi";

export const subjectSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": `"name" should be a type of 'text'`,
        "any.required": `"name" is a required field`,
    }),
    code: Joi.string().required().messages({
        "string.base": `"code" should be a type of 'text'`,
        "any.required": `"code" is a required field`,
    }),
    description: Joi.string().optional(),
    createdBy: Joi.string().required().messages({
        "any.required": `"createdBy" is a required field`,
    }),
    syllabus: Joi.string().optional(),
    credits: Joi.number().integer().min(0).optional(),
    status: Joi.string().valid("Active", "Inactive").optional(),
});
