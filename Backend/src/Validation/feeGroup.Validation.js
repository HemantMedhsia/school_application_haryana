import Joi from "joi";

export const feeGroupValidationSchema = Joi.object({
    feeGroupId: Joi.string().optional(), 
    class: Joi.string().required().messages({
        "string.empty": "Class reference is required",
        "any.required": "Class reference is required",
    }),
    fees: Joi.object({
        tuitionFee: Joi.number().min(0).required().messages({
            "number.base": "Tuition fee must be a number",
            "number.min": "Tuition fee must be a positive number",
            "any.required": "Tuition fee is required",
        }),
        admissionFee: Joi.number().min(0).required().messages({
            "number.base": "Admission fee must be a number",
            "number.min": "Admission fee must be a positive number",
            "any.required": "Admission fee is required",
        }),
        annualFee: Joi.number().min(0).required().messages({
            "number.base": "Annual fee must be a number",
            "number.min": "Annual fee must be a positive number",
            "any.required": "Annual fee is required",
        }),
        otherFee: Joi.number().min(0).optional().messages({
            "number.base": "Other fee must be a number",
            "number.min": "Other fee, if provided, must be a positive number",
        }),
    }).required(),
    installmentDates: Joi.array()
        .items(
            Joi.object({
                month: Joi.string().required().messages({
                    "string.empty": "Month is required for installment",
                    "any.required": "Month is required for installment",
                }),
                dueDate: Joi.date().required().messages({
                    "date.base": "Due date must be a valid date",
                    "any.required": "Due date is required for installment",
                }),
            })
        )
        .optional(),
});
