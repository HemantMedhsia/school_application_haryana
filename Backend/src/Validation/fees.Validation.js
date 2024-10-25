import Joi from "joi";

export const validateFeesDiscount = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required().messages({
            "string.empty": "Discount name is required",
            "string.min": "Discount name must be at least 3 characters long",
            "string.max": "Discount name cannot exceed 100 characters",
        }),
        discountCode: Joi.string().length(4).required().messages({
            "string.length": "Discount code must be exactly 4 characters",
            "any.required": "Discount code is required",
        }),

        description: Joi.string().max(250).optional().allow(null, "").messages({
            "string.max": "Description cannot exceed 250 characters",
        }),
        discountType: Joi.string()
            .valid("percentage", "fixAmount")
            .required()
            .messages({
                "any.only":
                    "Discount type can only be 'percentage' or 'fixAmount'",
                "any.required": "Discount type is required",
            }),
        percentageValue: Joi.when("discountType", {
            is: "percentage",
            then: Joi.number().min(0).max(100).required().messages({
                "number.base": "Percentage value must be a number",
                "number.min": "Percentage value cannot be negative",
                "number.max": "Percentage value cannot exceed 100",
                "any.required":
                    "Percentage value is required for percentage type",
            }),
            otherwise: Joi.forbidden(),
        }),
        fixAmountValue: Joi.when("discountType", {
            is: "fixAmount",
            then: Joi.number().min(0).required().messages({
                "number.base": "Fixed amount value must be a number",
                "number.min": "Fixed amount cannot be negative",
                "any.required":
                    "Fixed amount value is required for fixAmount type",
            }),
            otherwise: Joi.forbidden(),
        }),
    });

    return schema.validate(data);
};
