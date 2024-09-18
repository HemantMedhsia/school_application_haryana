import Joi from "joi";

export const addMarksSchema = Joi.object({
    student: Joi.string().required().messages({
        "string.empty": "Student ID is required",
        "any.required": "Student ID is required",
    }),
    term: Joi.string().required().messages({
        "string.empty": "Term ID is required",
        "any.required": "Term ID is required",
    }),
    class: Joi.string().required().messages({
        "string.empty": "Class ID is required",
        "any.required": "Class ID is required",
    }),
    marks: Joi.array()
        .items(
            Joi.object({
                subject: Joi.string().required().messages({
                    "string.empty": "Subject ID is required",
                    "any.required": "Subject ID is required",
                }),
                exams: Joi.array()
                    .items(
                        Joi.object({
                            examType: Joi.string().required().messages({
                                "string.empty": "Exam Type ID is required",
                                "any.required": "Exam Type ID is required",
                            }),
                            marksObtained: Joi.number()
                                .min(0)
                                .required()
                                .messages({
                                    "number.base":
                                        "Marks obtained must be a number",
                                    "number.min":
                                        "Marks obtained must be at least 0",
                                    "any.required":
                                        "Marks obtained is required",
                                }),
                        }).required()
                    )
                    .required()
                    .messages({
                        "array.base": "Exams must be an array",
                        "any.required": "Exams are required",
                    }),
            })
        )
        .required()
        .messages({
            "array.base": "Marks must be an array",
            "any.required": "Marks are required",
        }),
}).messages({
    "object.base": "Invalid input data",
});
