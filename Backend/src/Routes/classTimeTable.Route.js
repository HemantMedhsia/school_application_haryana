import express from "express";
import {
    createClassTimeTable,
    deleteClassTimeTable,
    getAvailableTeacher,
    getClassTimeTable,
    getClassTimeTableByClassId,
    getClassTimeTableById,
    getTeacherTimetable,
    updateClassTimeTable,
} from "../Controller/classTimeTable.Controller.js";

const router = express.Router();

router.post("/create-class-timetable", createClassTimeTable);
router.get("/get-class-timetable", getClassTimeTable);
router.get("/get-class-timetable-byid/:id", getClassTimeTableById);
router.put("/update-class-timetable/:id", updateClassTimeTable);
router.delete("/delete-class-timetable/:id", deleteClassTimeTable);
router.get("/get-class-timetable/:classId", getClassTimeTableByClassId);
router.get("/get-teacher-timetable/:teacherId", getTeacherTimetable);
router.get("/available-teachers", getAvailableTeacher);

export { router as classTimeTableRoute };
