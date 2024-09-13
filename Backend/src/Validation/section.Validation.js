import Joi from "joi";

const sectionSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": '"name" should be a type of string',
        "any.required": '"name" is a required field',
    }),
    description: Joi.string().optional().messages({
        "string.base": '"description" should be a type of string',
    }),
});

export const validateSection = (data) => {
    return sectionSchema.validate(data, { abortEarly: false });
};
