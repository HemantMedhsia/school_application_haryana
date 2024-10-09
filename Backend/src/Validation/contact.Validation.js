import Joi from "joi";

const contactValidationSchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    phone: Joi.number().required(),
    Post: Joi.string().trim().required(),
});

export const validateContact = (contact) => {
    return contactValidationSchema.validate(contact);
};
