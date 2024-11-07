import Joi from "joi";
import mongoose from "mongoose";

// Custom validation for ObjectId
const objectId = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
};

// Define the Joi validation schema
const studentValidationSchema = Joi.object({
    admissionNo: Joi.string().required(),
    rollNumber: Joi.string(),
    age: Joi.number().optional().allow(""),
    address: Joi.string().optional().allow(""),
    password: Joi.string().required(),
    currentClass: Joi.string().custom(objectId).required(),
    currentSection: Joi.string().custom(objectId).required(),
    currentSession: Joi.string().custom(objectId).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().optional().allow(""),
    gender: Joi.string().required(),
    dateOfBirth: Joi.date().optional().allow(""),
    category: Joi.string().optional().allow(""),
    religion: Joi.string().optional().allow(""),
    caste: Joi.string().optional(),
    mobileNumber: Joi.number().required(),
    email: Joi.string().email().optional().allow(""),
    admissionDate: Joi.date().optional().allow(""),
    studentPhoto: Joi.string().optional().allow(""),
    bloodGroup: Joi.string().optional().allow(""),
    house: Joi.string().optional().allow(""),
    height: Joi.number().optional().allow(""),
    weight: Joi.number().optional().allow(""),
    measurementDate: Joi.date().optional().allow(""),
    medicalHistory: Joi.string().optional().allow(""),
    parent: Joi.string().custom(objectId).optional().allow(""),
    StudentAttendance: Joi.array()
        .items(Joi.string().custom(objectId))
        .optional()
        .allow(""),
    complaints: Joi.array()
        .items(Joi.string().custom(objectId))
        .optional()
        .allow(""),
    studentHistory: Joi.array()
        .items(Joi.string().custom(objectId))
        .optional()
        .allow(""),
    marks: Joi.array()
        .items(Joi.string().custom(objectId))
        .optional()
        .allow(""),
    refreshToken: Joi.string().optional().allow(""),
    role: Joi.string().default("Student").optional().allow(""),
});

export { studentValidationSchema };
