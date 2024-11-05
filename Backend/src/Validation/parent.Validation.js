import Joi from "joi";

export const parentValidatonSchema = Joi.object({
    fatherName: Joi.string().required(),
    fatherPhone: Joi.number().optional().allow(""),
    fatherOccupation: Joi.string().optional().allow(""),
    fatherPhoto: Joi.string().optional().allow(""),
    motherName: Joi.string().optional().allow(""),
    motherPhone: Joi.number().optional().allow(""),
    motherOccupation: Joi.string().optional().allow(""),
    motherPhoto: Joi.string().optional().allow(""),
    guardianIs: Joi.string().optional().allow(""),
    guardianName: Joi.string().optional().allow(""),
    guardianRelation: Joi.string().optional().allow(""),
    guardianPhone: Joi.number().optional().allow(""),
    guardianOccupation: Joi.string().optional().allow(""),
    email: Joi.string().email().optional().allow(""),
    guardianPhoto: Joi.string().optional().allow(""),
    guardianAddress: Joi.string().optional().allow(""),
    password: Joi.string().required(),
});
