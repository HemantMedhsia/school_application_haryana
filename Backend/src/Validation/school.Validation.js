import Joi from "joi";

export const schoolValidationSchema = Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    students: Joi.array().items(
        Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("Invalid ObjectId");
            }
        })
    ),
    teachers: Joi.array().items(
        Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("Invalid ObjectId");
            }
        })
    ),
    notices: Joi.array().items(
        Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("Invalid ObjectId");
            }
        })
    ),
    subjects: Joi.array().items(
        Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("Invalid ObjectId");
            }
        })
    ),
    workingStaffs: Joi.array().items(
        Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("Invalid ObjectId");
            }
        })
    ),
    createdAt: Joi.date().default(Date.now),
});
