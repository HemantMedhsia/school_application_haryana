 import Joi from "joi";
 
 export const parentValidatonSchema = Joi.object({
    fatherName: Joi.string().required(),
    fatherPhone: Joi.string().required(),
    fatherOccupation: Joi.string().required(),
    fatherPhoto: Joi.string().optional(),
    motherName: Joi.string().required(),
    motherPhone: Joi.string().required(),
    motherOccupation: Joi.string().required(),
    motherPhoto: Joi.string().optional(),
    guardianIs: Joi.string().valid("Father", "Mother", "Other").required(),
    guardianName: Joi.string().required(),
    guardianRelation: Joi.string().optional(),
    guardianPhone: Joi.string().required(),
    guardianOccupation: Joi.string().optional(),
    guardianEmail: Joi.string().email().optional(),
    guardianPhoto: Joi.string().optional(),
    guardianAddress: Joi.string().optional(),
    password: Joi.string().required(),
});