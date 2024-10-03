import express, { Router } from "express";
import {
    createMultipleStaffAttendenceInBulk,
    createStaffAttendance,
    deleteStaffAttendance,
    getStaffAttendance,
    getStaffAttendanceByAdmin,
    getStaffAttendanceSummary,
    updateStaffAttendance,
    updateStaffAttendanceByStaffId,
} from "../Controller/staffAttendance.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRoles.js";

const router = express.Router();

router.post("/create-staff-attendance/:staffId", createStaffAttendance);
router.get("/get-staff-attendance/:staffId", getStaffAttendance);
router.put("/update-staff-attendance/:attendanceId", updateStaffAttendance);
router.delete("/delete-staff-attendance/:attendanceId", deleteStaffAttendance);
router.post(
    "/create-multiple-attendance-staff",
    createMultipleStaffAttendenceInBulk
);
router.get("/get-staff-attendance-summary/:staffId", getStaffAttendanceSummary);
router.get(
    "/get-staff-attendance-byadmin/:staffId",
    authenticateToken,
    authorizeRoles("Admin"),
    getStaffAttendanceByAdmin
);
router.put(
    "/update-staff-attendance-byadmin/:staffId",
    authenticateToken,
    authorizeRoles("Admin"),
    updateStaffAttendanceByStaffId
);

export { router as staffAttendanceRoute };
