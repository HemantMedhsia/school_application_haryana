import express from "express";
import {
    getClassResults,
    getStudentResult,
} from "../Controller/result.Controller.js";

const router = express.Router();

router.post("/get-class-result", getClassResults);
router.post("/get-result", getStudentResult);

export { router as resultRoute };
