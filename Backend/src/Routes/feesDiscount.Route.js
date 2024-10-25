import express from "express";
import {
    assignDiscountToStudent,
    createFeesDiscount,
    deleteFeesDiscount,
    getDiscountedStudentsByDiscountId,
    getFeesDiscount,
    getFeesDiscountById,
    updateFeesDiscount,
} from "../Controller/feesDiscount.Contoller.js";

const router = express.Router();

router.post("/create-fees-discount", createFeesDiscount);
router.get("/get-all-fees-discount", getFeesDiscount);
router.get("/get-single-fee-discount/:id", getFeesDiscountById);
router.put("/update-fees-discount/:id", updateFeesDiscount);
router.delete("/delete-fees-discount/:id", deleteFeesDiscount);
router.post("/assign-fees-discount-to-student", assignDiscountToStudent);
router.get(
    "/get-student-by-discount-id/:id",
    getDiscountedStudentsByDiscountId
);

export { router as feesDiscountRouter };
