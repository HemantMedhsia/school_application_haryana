import express from "express";
import { createSubject, deleteSubject, getAllSubjects, getSubjectById, getSubjectCount, getSubjectsByStatus, toggleSubjectStatus, updateSubject } from "../Controller/subject.Controller.js";

const router = express.Router();

router.post("/create-subject", createSubject);
router.get("/all-subject",getAllSubjects);
router.get("/single-subject/:id",getSubjectById);
router.put("/subject-update/:id",updateSubject);
router.delete("/subject-delete/:id",deleteSubject);
router.get("/subject-status/:status",getSubjectsByStatus);
router.get("/subject-count",getSubjectCount);
router.post("/subject-toggle/:id",toggleSubjectStatus);





export  {router as subjectRoute};
