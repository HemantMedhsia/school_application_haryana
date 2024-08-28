import Joi from "joi";
import mongoose from "mongoose";
export const markValidationSchema = Joi.object({
    studentId: Joi.string().required(),
    teacherId: Joi.string().required(),
    examType: Joi.string()
        .valid(
            "Chapter Wise Weekly Test",
            "Monthly Test",
            "Monthly Exam Practice",
            "Internal Assessments Test"
        )
        .required(),
    subjectMarks: Joi.array().items(
        Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("any.invalid");
            }
            return value;
        })
    ),
    percentage: Joi.number().default(0),
    rank: Joi.number().default(0),
    division: Joi.string()
        .valid("First", "Second", "Third", "Fail")
        .default("Fail"),
    grandTotal: Joi.number().default(0),
    totalObtainedMarks: Joi.number().default(0),
});
