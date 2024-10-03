import express from "express";
import {
    createMultipleTeacherAttendenceInBulk,
    createTeacherAttendance,
    deleteTeacherAttendance,
    getAttendanceSummary,
    getTeacherAttendance,
    updateTeacherAttendance,
} from "../Controller/teacherAttendence.Controller.js";

const router = express.Router();

router.post("/create-attendance/:teacherId", createTeacherAttendance);
router.get("/get-teacher-attendance/:teacherId", getTeacherAttendance);
router.put("/update-teacher-attendance/:attendanceId", updateTeacherAttendance);
router.delete(
    "/delete-teacher-attendance/:attendanceId",
    deleteTeacherAttendance
);
router.post(
    "/create-multiple-attendance",
    createMultipleTeacherAttendenceInBulk
);

router.get("/get-teacher-attendance-summary/:teacherId", getAttendanceSummary);

export { router as teacherAttendenceRoute };
