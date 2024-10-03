import express from "express";
import {
    createMultipleTeacherAttendenceInBulk,
    createTeacherAttendance,
    deleteTeacherAttendance,
    getAttendanceSummary,
    getTeacherAttendance,
    getTeacherAttendanceByAdmin,
    getTeacherAttendanceByTeacherId,
    updateTeacherAttendance,
    updateTeacherAttendanceByTeacherId,
} from "../Controller/teacherAttendence.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRoles.js";

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
router.get(
    "/get-teacher-attendance-byTeacherId",
    authenticateToken,
    authorizeRoles("Admin", "Teacher"),
    getTeacherAttendanceByTeacherId
);
router.get(
    "/get-teacher-attendance-byadmin/:teacherId",
    authenticateToken,
    authorizeRoles("Admin"),
    getTeacherAttendanceByAdmin
);

router.put(
    "/update-teacher-attendance-byadmin/:teacherId",
    authenticateToken,
    authorizeRoles("Admin"),
    updateTeacherAttendanceByTeacherId
);

export { router as teacherAttendenceRoute };
