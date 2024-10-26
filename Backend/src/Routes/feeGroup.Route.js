import express from "express";
import {
    addFeeGroup,
    deleteFeeGroup,
    getFeeGroupById,
    getFeeGroups,
    updateFeeGroup,
} from "../Controller/feeGroup.Controller.js";

const router = express.Router();

router.post("/add-fee-group", addFeeGroup);
router.put("/update-fee-group", updateFeeGroup);
router.delete("/delete-fee-group", deleteFeeGroup);
router.get("/get-fee-group", getFeeGroups);
router.get("/get-fee-group/:feeGroupId", getFeeGroupById);

export { router as feeGroupRouter };
