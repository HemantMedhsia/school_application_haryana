import express from "express";
import {
    addPaymentsAndDiscounts,
    getAllStudentFeeDetails,
    getDueFeeListPerClassMonth,
    getStudentFeeDetails,
} from "../Controller/studentFees.Controller.js";

const router = express.Router();

router.post("/add-student-fee", addPaymentsAndDiscounts);
router.get("/get-student-fee/:studentId", getStudentFeeDetails);
router.post("/student-due-fee-per-class", getDueFeeListPerClassMonth);
router.get("/get-all-student-fee",getAllStudentFeeDetails)

export { router as studentFeesRouter };
