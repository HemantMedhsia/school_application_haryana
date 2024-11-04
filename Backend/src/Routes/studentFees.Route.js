import express from "express";
import {
    addPaymentsAndDiscounts,
    getAllStudentFeeDetails,
    getDueFeeListPerClassMonth,
    getStudentAndSiblingFeeSummary,
    getStudentBillPerMonth,
    getStudentFeeDetails,
    payAllSiblingStudentFees,
} from "../Controller/studentFees.Controller.js";

const router = express.Router();

router.post("/add-student-fee", addPaymentsAndDiscounts);
router.get("/get-student-fee/:studentId", getStudentFeeDetails);
router.post("/student-due-fee-per-class", getDueFeeListPerClassMonth);
router.get("/get-all-student-fee", getAllStudentFeeDetails);
router.post("/get-student-bill-month", getStudentBillPerMonth);
router.get(
    "/get-student-sibling-fee/:studentId",
    getStudentAndSiblingFeeSummary
);

router.post("/siblings-fees", payAllSiblingStudentFees);

export { router as studentFeesRouter };
