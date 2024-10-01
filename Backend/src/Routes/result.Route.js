import express from "express";
import {
    getStudentExamResultsByExamType,
    getStudentExamResultsByTerm,
} from "../Controller/result.Controller.js";

const router = express.Router();

router.post("/get-student-result-byexamtype", getStudentExamResultsByExamType);
router.post("/get-student-result-byterm", getStudentExamResultsByTerm);

export { router as resultRoute };
