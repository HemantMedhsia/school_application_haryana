import express from "express";
import { createManySections, createSection, deleteManySections, deleteSection, getAllSections, getSectionById, updateSection } from "../Controller/section.Controller.js";

const router =  express.Router();

router.post("/create-single-section", createSection);
router.post("/create-many-sections", createManySections);
router.get("/get-all-sections", getAllSections);
router.get("/get-section-by-id/:sectionId", getSectionById);
router.put("/update-section/:sectionId", updateSection);
router.delete("/delete-section/:sectionId", deleteSection);
router.post("/delete-many-sections", deleteManySections);

export {router as sectionRoute};