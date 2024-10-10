import Joi from "joi";

export const parentValidatonSchema = Joi.object({
    fatherName: Joi.string().required(),
    fatherPhone: Joi.number().required(),
    fatherOccupation: Joi.string().required(),
    fatherPhoto: Joi.string().optional(),
    motherName: Joi.string().required(),
    motherPhone: Joi.number().required(),
    motherOccupation: Joi.string().required(),
    motherPhoto: Joi.string().optional(),
    guardianIs: Joi.string().required(),
    guardianName: Joi.string().required(),
    guardianRelation: Joi.string().optional(),
    guardianPhone: Joi.number().required(),
    guardianOccupation: Joi.string().optional(),
    email: Joi.string().email().optional(),
    guardianPhoto: Joi.string().optional(),
    guardianAddress: Joi.string().optional(),
    password: Joi.string().required(),
});
