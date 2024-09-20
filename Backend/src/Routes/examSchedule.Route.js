import express from "express";
import {
    createExamSchedule,
    deleteExamSchedule,
    getExamScheduleById,
    getExamScheduleBytcseId,
    getExamSchedules,
    getExamSchedulesByClass,
    getExamSchedulesByTerm,
    updateExamSchedule,
} from "../Controller/examSchedule.Controller.js";
const router = express.Router();

router.post("/create-examschedule", createExamSchedule);
router.get("/get-examschedules", getExamSchedules);
router.post("/get-examschedule-byallids", getExamScheduleBytcseId);
router.get("/get-examschedule/:id", getExamScheduleById);
router.put("/update-examschedule/:id", updateExamSchedule);
router.delete("/delete-examschedule/:id", deleteExamSchedule);
router.get("/get-examschedule-byclass/:classId", getExamSchedulesByClass);
router.get("/get-examschedule-byterm/:termId", getExamSchedulesByTerm);

export { router as examScheduleRoute };
