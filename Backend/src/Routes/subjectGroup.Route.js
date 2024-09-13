import express from "express";
import { addSubjectGroup, deleteSubjectGroup, getAllSubjectGroups, getSubjectGroupById, updateSubjectGroup } from "../Controller/subjectGroup.Controller.js";

const router = express.Router();

router.post("/create-subject-group", addSubjectGroup);
router.get("/all-subject-groups", getAllSubjectGroups);
router.get("/single-subject-group/:id", getSubjectGroupById);
router.put("/update-subject-group/:id", updateSubjectGroup);
router.delete("/delete-subject-group/:id", deleteSubjectGroup);

export { router as subjectGroupRoute };
