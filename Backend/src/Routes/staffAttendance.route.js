import express, { Router } from "express";
import {
    createMultipleStaffAttendenceInBulk,
    createStaffAttendance,
    deleteStaffAttendance,
    getStaffAttendance,
    getStaffAttendanceSummary,
    updateStaffAttendance,
} from "../Controller/staffAttendance.Controller.js";

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

export { router as staffAttendanceRoute };
