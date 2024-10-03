import Joi from "joi";
import mongoose from "mongoose";

export const teacherAttendanceValidationSchema = Joi.object({
    teacherId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("any.invalid");
            }
            return value;
        })
        .required(),
    date: Joi.date(),
    status: Joi.string().valid("Present", "Absent").required(),
    reason: Joi.string().allow(""),
    notes: Joi.string().allow(""),
});
