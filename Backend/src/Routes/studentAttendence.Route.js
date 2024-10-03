import express from "express";
import {
    deleteStudentAttendance,
    createStudentAttendence,
    getStudentAttendance,
    updateStudentAttendance,
    getAttendanceSummary,
    getAttendanceByDateRange,
    createMultipleStudentAttendenceInBulk,
    getAllStudentAttendance,
    getStudentAttendanceByStudentId,
    getStudentAttendanceByParentId,
    getStudentAttendanceByStudentId_Admin,
    updateStudentAttendanceByStudentId,
} from "../Controller/studentAttendence.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";

const router = express.Router();

router.post(
    "/create-student-attendance/:studentId",
    authenticateToken,
    createStudentAttendence
);
router.get("/get-student-attendance/:studentId", getStudentAttendance);
router.put("/update-student-attendance/:attendanceId", updateStudentAttendance);
router.delete(
    "/delete-student-attendance/:attendanceId",
    deleteStudentAttendance
);
router.get("/get-student-attendance-summary/:studentId", getAttendanceSummary);
router.get(
    "/get-student-attendance-daterange/:studentId",
    getAttendanceByDateRange
);
router.post(
    "/insert-student-attendance-in-bulk",
    authenticateToken,
    createMultipleStudentAttendenceInBulk
);
router.get("/get-all-attendance", getAllStudentAttendance);
router.get(
    "/get-student-attendance-byid",
    authenticateToken,
    getStudentAttendanceByStudentId
);
router.get(
    "/get-student-attendance-byparentid",
    authenticateToken,
    getStudentAttendanceByParentId
);
router.get(
    "/get-student-attendance-bystudentid-admin/:studentId",
    authenticateToken,
    getStudentAttendanceByStudentId_Admin
);

router.put(
    "/update-student-attendance-admin/:studentId",
    updateStudentAttendanceByStudentId
);

export { router as studentAttendenceRoute };
