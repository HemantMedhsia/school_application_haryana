import express from "express";
import {
    createClassTimeTable,
    deleteClassTimeTable,
    getAvailableTeacher,
    getClassTimeTable,
    getClassTimeTableByClassId,
    getClassTimeTableById,
    getStudentTimetable,
    getStudentTimetableByParentId,
    getTeacherTimetable,
    getTeacherTimetableById,
    updateClassTimeTable,
} from "../Controller/classTimeTable.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";

const router = express.Router();

router.post("/create-class-timetable", createClassTimeTable);
router.get("/get-class-timetable", getClassTimeTable);
router.get("/get-class-timetable-byid/:id", getClassTimeTableById);
router.put("/update-class-timetable/:id", updateClassTimeTable);
router.delete("/delete-class-timetable/:id", deleteClassTimeTable);
router.get("/get-class-timetable/:classId", getClassTimeTableByClassId);
router.get("/get-teacher-timetable", authenticateToken, getTeacherTimetable);
router.get("/get-teacher-timetable/:teacherId", getTeacherTimetableById);
router.get("/get-student-timetable", authenticateToken, getStudentTimetable);
router.get("/get-studenttimetablebyparent", authenticateToken, getStudentTimetableByParentId);
router.get("/available-teachers", getAvailableTeacher);

export { router as classTimeTableRoute };
