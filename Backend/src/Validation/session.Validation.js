import Joi from 'joi';

export const sessionValidationSchema = Joi.object({
    sessionYear: Joi.string().required(),
    sessionStartDate: Joi.string().default('April'),
    sessionEndDate: Joi.string().default('March')
});