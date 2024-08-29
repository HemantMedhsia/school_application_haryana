import express, { Router } from "express";
import {
    createStaffAttendance,
    deleteStaffAttendance,
    getStaffAttendance,
    updateStaffAttendance,
} from "../Controller/staffAttendance.Controller.js";

const router = express.Router();

router.post("/create-staff-attendance/:staffId", createStaffAttendance);
router.get("/get-staff-attendance/:staffId", getStaffAttendance);
router.put("/update-staff-attendance/:attendanceId", updateStaffAttendance);
router.delete("/delete-staff-attendance/:attendanceId", deleteStaffAttendance);

export { router as staffAttendanceRoute };
