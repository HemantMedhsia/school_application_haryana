import Joi from "joi";

const singleSubjectMarkValidationSchema = Joi.object({
    subjectName: Joi.string().required(),
    maxMarks: Joi.number().required(),
    minMarks: Joi.number().required(),
    marksObtained: Joi.number().required(),
    result: Joi.string().valid("Pass", "Fail").required(),
    grade: Joi.string().valid("A++", "A+", "A", "B", "C").default(null),
    note: Joi.string().default(""),
});

export default singleSubjectMarkValidationSchema;