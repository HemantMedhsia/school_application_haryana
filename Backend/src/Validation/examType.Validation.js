import Joi from "joi";

export const validateExamType = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            "string.empty": "Name is required",
        }),
        term: Joi.string().hex().length(24).required().messages({
            "string.base": "Term ID must be a valid ObjectId",
            "string.length": "Term ID must be 24 characters long",
            "any.required": "Term is required",
        }),
        maxMarks: Joi.number().integer().min(1).required().messages({
            "number.base": "Max Marks must be a number",
            "number.min": "Max Marks must be at least 1",
            "any.required": "Max Marks are required",
        }),
        minMarks: Joi.number()
            .integer()
            .min(0)
            .required()
            .less(Joi.ref("maxMarks"))
            .messages({
                "number.base": "Min Marks must be a number",
                "number.min": "Min Marks must be at least 0",
                "any.required": "Min Marks are required",
                "number.less": "Min Marks should be less than Max Marks",
            }),
    });

    return schema.validate(data);
};
