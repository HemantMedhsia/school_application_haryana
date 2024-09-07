import Joi from 'joi';
import mongoose from 'mongoose';

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
    rollNumber: Joi.string().required(),
    age: Joi.string().required(),
    address: Joi.string().optional(),
    password: Joi.string().required(),
    currentClass: Joi.string().custom(objectId).required(),
    currentSection: Joi.string().custom(objectId).required(),
    currentSession: Joi.string().custom(objectId).required(),
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
    studentPhoto: Joi.string().optional(),
    bloodGroup: Joi.string().optional(),
    house: Joi.string().optional(),
    height: Joi.number().optional(),
    weight: Joi.number().optional(),
    measurementDate: Joi.date().optional(),
    medicalHistory: Joi.string().optional(),
    parent: Joi.string().custom(objectId).optional(),
    StudentAttendance: Joi.array().items(Joi.string().custom(objectId)).optional(),
    complaints: Joi.array().items(Joi.string().custom(objectId)).optional(),
    studentHistory: Joi.array().items(Joi.string().custom(objectId)).optional(),
    marks: Joi.array().items(Joi.string().custom(objectId)).optional(),
    refreshToken: Joi.string().optional(),
    role: Joi.string().default("Student").optional(),
});

export {studentValidationSchema};