import express from "express";
import {
    addFeeGroup,
    deleteFeeGroup,
    deleteInstallment,
    getFeeGroupById,
    getFeeGroups,
    getInstallmentById,
    getInstallments,
    manageInstallment,
    updateFeeGroup,
    updateInstallment,
} from "../Controller/feeGroup.Controller.js";

const router = express.Router();

router.post("/add-fee-group", addFeeGroup);
router.put("/update-fee-group", updateFeeGroup);
router.delete("/delete-fee-group", deleteFeeGroup);
router.get("/get-fee-group", getFeeGroups);
router.get("/get-fee-group/:feeGroupId", getFeeGroupById);
router.post("/add-installment", manageInstallment);
router.delete("/delete-installment", deleteInstallment);
router.put("/update-installment", updateInstallment);
router.get("/get-installment", getInstallments);
router.get("/get-installment-by-id/:installmentId", getInstallmentById);

export { router as feeGroupRouter };
