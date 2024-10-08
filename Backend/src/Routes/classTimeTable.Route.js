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
    getStudentTimetabledayWise,
    getStudentTimetabledayWiseByParentId,
    getTeacherTimetable,
    getTeacherTimetableById,
    getTeacherTimetabledayWise,
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
router.get(
    "/get-studenttimetablebyparent",
    authenticateToken,
    getStudentTimetableByParentId
);
router.get("/available-teachers", getAvailableTeacher);
router.get(
    "/get-student-timetable-daywise",
    authenticateToken,
    getStudentTimetabledayWise
);
router.get(
    "/get-student-timetable-daywise-by-parent",
    authenticateToken,
    getStudentTimetabledayWiseByParentId
);

router.get(
    "/get-teacher-timetable-daywise",
    authenticateToken,
    getTeacherTimetabledayWise
);

export { router as classTimeTableRoute };
