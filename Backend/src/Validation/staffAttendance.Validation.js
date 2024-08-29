import Joi from "joi";

export const staffAttendanceValidationSchema = Joi.object({
    staffId: Joi.string().required().messages({
        "string.empty": "Staff ID is required",
        "any.required": "Staff ID is required",
    }),
    date: Joi.date().optional().messages({
        "date.base": "Invalid date format",
        "any.required": "Date is required",
    }),
    status: Joi.string()
        .valid("Present", "Absent", "Late", "Holiday")
        .required()
        .messages({
            "string.empty": "Status is required",
            "any.only":
                "Status must be one of 'Present', 'Absent', 'Late', or 'Holiday'",
            "any.required": "Status is required",
        }),
    reason: Joi.string().allow("").optional().messages({
        "string.base": "Reason must be a string",
    }),
});
