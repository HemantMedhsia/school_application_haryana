import express from "express";
import {
    createSection,
    deleteManySections,
    deleteSection,
    getAllSections,
    getSectionById,
    getSectionsByClass,
    updateSection,
} from "../Controller/section.Controller.js";

const router = express.Router();

router.post("/create-single-section", createSection);
// router.post("/create-many-sections", createManySections);
router.get("/get-all-sections", getAllSections);
router.get("/get-section-by-id/:sectionId", getSectionById);
router.put("/update-section/:sectionId", updateSection);
router.delete("/delete-single-section/:sectionId", deleteSection);
router.post("/delete-many-section", deleteManySections);
router.get("/get-section-by-class/:classId", getSectionsByClass);

export { router as sectionRoute };
