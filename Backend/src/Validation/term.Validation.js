import Joi from 'joi';

export const validateTerm = Joi.object({
    name: Joi.string().required(),
    startDate: Joi.date(),
    endDate: Joi.date() 
});
