import express from "express";
import {
    createComplaint,
    deleteComplaint,
    getComplaintById,
    getComplaints,
    getComplaintsByCategory,
    getComplaintsByStatus,
    getComplaintsByStudent,
    getComplaintsByStudentByParentId,
    getComplaintsByTeacherAndStatus,
    updateComplaint,
} from "../Controller/complaint.Controller.js";
import { authorizeRoles } from "../Middlewares/authorizeRoles.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";

const router = express.Router();

router.post("/create-complaint/:studentId/:teacherId", createComplaint);
router.put("/update-complaint/:complaintId", updateComplaint);
router.delete("/delete-complaint/:complaintId", deleteComplaint);
router.get(
    "/get-single-complaint-byComplaintId/:complaintId",
    getComplaintById
);
router.get("/get-all-complaints", getComplaints);
router.get(
    "/get-student-complaints",
    authenticateToken,
    authorizeRoles("Student"),
    getComplaintsByStudent
);
router.get(
    "/get-student-complaints-by-parent",
    authenticateToken,
    authorizeRoles("Parent"),
    getComplaintsByStudentByParentId
);

router.get("/get-complaint-by-category/:category", getComplaintsByCategory);
router.get(
    "/get-complaint-by-teacher-and-status/:teacherId/:status",
    getComplaintsByTeacherAndStatus
);
router.get("/get-complaint-by-status/:status", getComplaintsByStatus);

export { router as complaintRoute };
