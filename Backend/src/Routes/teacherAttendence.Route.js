import express from "express";
import { createTeacherAttendance, deleteTeacherAttendance, getTeacherAttendance, updateTeacherAttendance } from "../Controller/teacherAttendence.Controller.js";

const router = express.Router();

router.post("/create-attendance/:teacherId", createTeacherAttendance);
router.get("/get-teacher-attendance/:teacherId", getTeacherAttendance);
router.put("/update-teacher-attendance/:attendanceId", updateTeacherAttendance);
router.delete("/delete-teacher-attendance/:attendanceId", deleteTeacherAttendance);


export { router as teacherAttendenceRoute };
