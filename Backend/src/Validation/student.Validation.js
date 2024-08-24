import Joi from "joi";
import mongoose from "mongoose";
export const studentValidationSchema = Joi.object({
    admissionNo: Joi.string().required(),
    rollNumber: Joi.string().required(),
    studentLoginPassword: Joi.string().required(),
    class: Joi.string().required(),
    section: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().optional(),
    gender: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    category: Joi.string().optional(),
    religion: Joi.string().optional(),
    caste: Joi.string().optional(),
    mobileNumber: Joi.string().required(),
    email: Joi.string().email().optional(),
    admissionDate: Joi.date().optional(),
    studentPhoto: Joi.string().required(),
    bloodGroup: Joi.string().optional(),
    house: Joi.string().optional(),
    height: Joi.number().optional(),
    weight: Joi.number().optional(),
    measurementDate: Joi.date().optional(),
    medicalHistory: Joi.string().optional(),
    parent: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("Invalid ObjectId");
        }
    }),
    StudentAttendance: Joi.array()
        .items(
            Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("Invalid ObjectId");
                }
            })
        )
        .optional(),
    complaints: Joi.array()
        .items(
            Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("Invalid ObjectId");
                }
            })
        )
        .optional(),
});
