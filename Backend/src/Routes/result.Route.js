import express from "express";
import {
    getExamResultsForTerm,
    getStudentExamResultsByExamType,
    getStudentExamResultsByTerm,
} from "../Controller/result.Controller.js";

const router = express.Router();

router.post("/get-student-result-byexamtype", getStudentExamResultsByExamType);
router.post("/get-student-result-byterm", getStudentExamResultsByTerm);
router.post("/get-student-result-info", getExamResultsForTerm);

export { router as resultRoute };
