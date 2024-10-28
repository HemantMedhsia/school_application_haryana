import express from "express";
import {
    addPaymentsAndDiscounts,
    getStudentFeeDetails,
} from "../Controller/studentFees.Controller.js";

const router = express.Router();

router.post("/add-student-fee", addPaymentsAndDiscounts);
router.get("/get-student-fee/:studentId", getStudentFeeDetails);

export { router as studentFeesRouter };
