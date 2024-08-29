import express from "express";
import {
    bulkCreateClasses,
    createClass,
    deleteClass,
    getAllClasses,
    getClassById,
    updateClass,
} from "../Controller/class.Controller.js";

const router = express.Router();

router.post("/create-class", createClass);
router.post("/create-multiple-class", bulkCreateClasses);
router.get("/all-class", getAllClasses);
router.get("/single-class/:classId", getClassById);
router.put("/update-class/:classId", updateClass);
router.delete("/delete-class/:classId", deleteClass);

export { router as classRoute };
