import Joi from "joi";

const sectionSchema = Joi.object({
    name: Joi.string()
        .valid("A", "B", "C", "D") 
        .required()
        .messages({
            "string.base": '"name" should be a type of string',
            "any.only":
                '"name" must be one of the following values: A, B, C, D',
            "any.required": '"name" is a required field',
        }),
});

export const validateSection = (data) => {
    return sectionSchema.validate(data, { abortEarly: false });
};
