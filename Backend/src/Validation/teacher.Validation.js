import Joi from "joi";
import mongoose from "mongoose";
export const teacherValidationSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required(),
    gender: Joi.string().required(),
    subject: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    contact: Joi.number().required(),
    profile: Joi.string().optional().allow(""),
    profileImage: Joi.string().optional().allow(""),
    qualification: Joi.string().required(),
    experience: Joi.string().required(),
    adharNo: Joi.number().required(),
    panNo: Joi.string().required(),
    address: Joi.string().required(),
    school: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    }),
    teacherAttendance: Joi.array().items(
        Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("any.invalid");
            }
            return value;
        })
    ),
});
