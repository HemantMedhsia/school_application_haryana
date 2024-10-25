import express from "express";
import {
    createFeesMaster,
    deleteFeesMaster,
    getAllFeesMasters,
    getFeesMasterById,
    updateFeesMaster,
} from "../Controller/feesMaster.Controller.js";

const router = express.Router();

router.post("/create-fees-master", createFeesMaster);
router.get("/get-all-fees-masters", getAllFeesMasters);
router.get("/get-fees-master-by-id/:id", getFeesMasterById);
router.put("/update-fees-master/:id", updateFeesMaster);
router.delete("/delete-fees-master/:id", deleteFeesMaster);

export { router as feesMasterRouter };
