import Joi from 'joi';

export const attendanceValidationSchema = Joi.object({
    studentId: Joi.string().optional(),
    date: Joi.date().required(),
    status: Joi.string().valid("Present", "Absent", "Late", "Holiday").required(),
    reason: Joi.string().allow(''),
    notes: Joi.string().allow(''),
});
