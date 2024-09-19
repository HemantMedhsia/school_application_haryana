import Joi from "joi";

const examScheduleValidation = Joi.object({
    term: Joi.string().required().messages({
        "string.base": '"term" should be a string',
        "string.empty": '"term" cannot be empty',
        "any.required": '"term" is a required field',
    }),
    classId: Joi.string().required().messages({
        "string.base": '"classId" should be a string',
        "string.empty": '"classId" cannot be empty',
        "any.required": '"classId" is a required field',
    }),
    examType: Joi.string().required().messages({
        "string.base": '"examType" should be a string',
        "string.empty": '"examType" cannot be empty',
        "any.required": '"examType" is a required field',
    }),
    subjectGroup: Joi.string().required().messages({
        "string.base": '"subjectGroup" should be a string',
        "string.empty": '"subjectGroup" cannot be empty',
        "any.required": '"subjectGroup" is a required field',
    }),
    examDetails: Joi.array()
        .items(
            Joi.object({
                subject: Joi.string().required().messages({
                    "string.base": '"subject" should be a string',
                    "string.empty": '"subject" cannot be empty',
                    "any.required": '"subject" is a required field',
                }),
                examDate: Joi.date().iso().required().messages({
                    "date.base": '"examDate" should be a valid date',
                    "date.empty": '"examDate" cannot be empty',
                    "any.required": '"examDate" is a required field',
                }),
                startTime: Joi.date().iso().required().messages({
                    "date.base": '"startTime" should be a valid date',
                    "date.empty": '"startTime" cannot be empty',
                    "any.required": '"startTime" is a required field',
                }),
                endTime: Joi.date()
                    .iso()
                    .required()
                    .greater(Joi.ref("startTime"))
                    .messages({
                        "date.base": '"endTime" should be a valid date',
                        "date.empty": '"endTime" cannot be empty',
                        "any.required": '"endTime" is a required field',
                        "date.greater":
                            '"endTime" must be greater than "startTime"',
                    }),
            })
        )
        .required()
        .messages({
            "array.base": '"examDetails" should be an array',
            "any.required": '"examDetails" is a required field',
        }),
});

export { examScheduleValidation };
