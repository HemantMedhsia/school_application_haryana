import Joi from "joi";
import mongoose from "mongoose";

export const staffValidationSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string()
        .valid(
            "Cleaning",
            "Security",
            "Care Taker",
            "Peon",
            "Office Staff",
            "Librarian",
            "Other"
        )
        .required(),
    age: Joi.number().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().required(),
    staffAttendance: Joi.array().items(
        Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("any.invalid");
            }
            return value;
        })
    ),
    dateJoined: Joi.date().default(Date.now),
});
