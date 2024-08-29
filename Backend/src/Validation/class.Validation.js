import Joi from "joi";

export const classValidationSchema = Joi.object({
    name: Joi.string()
        .valid(
            "Nursery",
            "LKG",
            "UKG",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12"
        )
        .required()
        .messages({
            "string.base": "Class name should be a string",
            "any.only": "Invalid class name",
            "any.required": "Class name is required",
        }),
});
