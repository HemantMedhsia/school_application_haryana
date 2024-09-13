import express from "express";
import {
    createSubject,
    deleteSubject,
    getAllSubjects,
    getSubjectById,
    getSubjectCount,
    getSubjectsByStatus,
    toggleSubjectStatus,
    updateSubject,
} from "../Controller/subject.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";

const router = express.Router();

router.post("/create-subject/:schoolId/", createSubject);
router.get("/all-subject", getAllSubjects);
router.get("/single-subject/:id", getSubjectById);
router.put("/subject-update/:id", updateSubject);
router.delete("/subject-delete/:id", deleteSubject);
router.get("/subject-status/:status", getSubjectsByStatus);
router.get("/subject-count", getSubjectCount);
router.get("/subject-toggle/:id", toggleSubjectStatus);

export { router as subjectRoute };
