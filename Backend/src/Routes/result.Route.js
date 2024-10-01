import express from "express";
import {
    getExamResultsForTerm,
    getStudentExamResultsByExamType,
    getStudentExamResultsByTerm,
    getTermResultforParent,
    getTermResultforstudent,
} from "../Controller/result.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";

const router = express.Router();

router.post("/get-student-result-byexamtype", getStudentExamResultsByExamType);
router.post("/get-student-result-byterm", getStudentExamResultsByTerm);
router.post("/get-student-result-info", getExamResultsForTerm);
router.post(
    "/show-student-result-byterm",
    authenticateToken,
    getTermResultforstudent
);

router.post(
    "/show-student-result-byparent",
    authenticateToken,
    getTermResultforParent
);

export { router as resultRoute };
