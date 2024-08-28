import Joi from "joi";
import mongoose from "mongoose";
export const markValidationSchema = Joi.object({
    studentId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("any.invalid");
            }
            return value;
        })
        .required(),
    teacherId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("any.invalid");
            }
            return value;
        })
        .required(),
    examType: Joi.string()
        .valid(
            "Chapter Wise Weekly Test",
            "Monthly Test",
            "Monthly Exam Practice",
            "Internal Assessments Test"
        )
        .required(),
    subjectMarks: Joi.array()
        .items(
            Joi.object({
                subjectName: Joi.string().required(),
                maxMarks: Joi.number().required(),
                minMarks: Joi.number().required(),
                marksObtained: Joi.number().required(),
                result: Joi.string().valid("Pass", "Fail").required(),
                grade: Joi.string()
                    .valid("A++", "A+", "A", "B", "C")
                    .default(null),
                note: Joi.string().default(""),
            })
        )
        .required(),
    percentage: Joi.number().required(),
    rank: Joi.number().required(),
    division: Joi.string().valid("First", "Second", "Third", "Fail").required(),
    grandTotal: Joi.number().required(),
    totalObtainedMarks: Joi.number().required(),
});
