import Joi from "joi";

export const parentValidatonSchema = Joi.object({
    fatherName: Joi.string().required(),
    fatherPhone: Joi.number().optional(),
    fatherOccupation: Joi.string().optional(),
    fatherPhoto: Joi.string().optional(),
    motherName: Joi.string().optional(),
    motherPhone: Joi.number().optional(),
    motherOccupation: Joi.string().optional(),
    motherPhoto: Joi.string().optional(),
    guardianIs: Joi.string().optional(),
    guardianName: Joi.string().optional(),
    guardianRelation: Joi.string().optional(),
    guardianPhone: Joi.number().optional(),
    guardianOccupation: Joi.string().optional(),
    email: Joi.string().email().optional(),
    guardianPhoto: Joi.string().optional(),
    guardianAddress: Joi.string().optional(),
    password: Joi.string().required(),
});
