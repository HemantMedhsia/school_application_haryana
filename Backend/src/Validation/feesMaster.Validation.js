import Joi from "joi";

const feesMasterValidationSchema = Joi.object({
    feesGroup: Joi.string().required(),

    feesDetails: Joi.array()
        .items(
            Joi.object({
                feesType: Joi.string().required(),
                amount: Joi.number().required(),
                dueDate: Joi.date().required(),
                fineType: Joi.string()
                    .valid("none", "percentage", "fixAmount")
                    .required(),
                percentage: Joi.number().when("fineType", {
                    is: "percentage",
                    then: Joi.number().required(),
                    otherwise: Joi.optional(),
                }),
                fixAmount: Joi.number().when("fineType", {
                    is: "fixAmount",
                    then: Joi.number().required(),
                    otherwise: Joi.optional(),
                }),
            })
        )
        .required(),
});

export default feesMasterValidationSchema;
