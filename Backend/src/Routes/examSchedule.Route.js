import express from "express";
import {
    createExamSchedule,
    deleteExamSchedule,
    getAdmitCards,
    getExamScheduleById,
    getExamScheduleBytcseId,
    getExamSchedules,
    getExamSchedulesByClass,
    getExamSchedulesByParentId,
    getExamSchedulesByStudentId,
    getExamSchedulesByTerm,
    updateExamSchedule,
} from "../Controller/examSchedule.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRoles.js";
const router = express.Router();

router.post("/create-examschedule", createExamSchedule);
router.get("/get-examschedules", getExamSchedules);
router.post("/get-examschedule-byallids", getExamScheduleBytcseId);
router.get("/get-examschedule/:id", getExamScheduleById);
router.put("/update-examschedule/:id", updateExamSchedule);
router.delete("/delete-examschedule/:id", deleteExamSchedule);
router.get("/get-examschedule-byclass/:classId", getExamSchedulesByClass);
router.get("/get-examschedule-byterm/:termId", getExamSchedulesByTerm);

router.get(
    "/get-examschedule-bystudent",
    authenticateToken,
    authorizeRoles("Student"),
    getExamSchedulesByStudentId
);
router.get(
    "/get-examschedule-byparent",
    authenticateToken,
    authorizeRoles("Parent"),
    getExamSchedulesByParentId
);

router.post("/print-admit-card/:classId/:examTypeId/:termId", getAdmitCards);

export { router as examScheduleRoute };
