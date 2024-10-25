import mongoose from "mongoose";

const fessDiscountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    discountCode: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    discountType: {
        type: String,
        enum: ["percentage", "fixAmount"],
    },
    percentageValue: {
        type: Number,
    },
    fixAmountValue: {
        type: Number,
    },
});

export const FessDiscount = mongoose.model("FessDiscount", fessDiscountSchema);
