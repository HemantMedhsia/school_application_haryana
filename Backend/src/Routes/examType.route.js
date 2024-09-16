import express from "express";
import {
    createExamType,
    deleteExamType,
    getExamTypeById,
    getExamTypes,
    getExamTypesByTerm,
    updateExamType,
} from "../Controller/examType.Controller.js";

const router = express.Router();

router.post("/create-examtype", createExamType);
router.get("/get-examtype", getExamTypes);
router.get("/get-examtype/:id", getExamTypeById);
router.delete("/delete-examtype/:id", deleteExamType);
router.put("/update-examtype/:id", updateExamType);
router.get("/get-examtype-byterm/:termId", getExamTypesByTerm);

export { router as examTypeRoute };
