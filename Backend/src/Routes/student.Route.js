import express from "express";
import {
    createStudent,
    deleteStudent,
    getAttendanceAndStudentCount,
    getStudent,
    getStudentAttendanceData,
    getStudentAttendanceDataByParentId,
    getStudentByParent,
    getStudents,
    loginStudent,
    refreshAccessTokenStudent,
    updateStudent,
    UploadBulkStudents,
} from "../Controller/student.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRoles.js";
import { uploadMiddleware } from "../Middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/create-student/:schoolId", createStudent);
router.get(
    "/get-all-students",
    authenticateToken,
    authorizeRoles("Admin", "Teacher"),
    getStudents
);

router.get("/get-student/:id", getStudent);
router.delete("/delete-student/:id", deleteStudent);
router.patch("/update-student/:id", updateStudent);
router.get("/get-student-by-parent/:parentId", getStudentByParent);
router.post("/login-student", loginStudent);
router.post("/refresh-token-student", refreshAccessTokenStudent);
router.get(
    "/get-student-attendancedata",
    authenticateToken,
    getStudentAttendanceData
);
router.get(
    "/get-student-attendancedatabyparent",
    authenticateToken,
    getStudentAttendanceDataByParentId
);

router.get("/student-weekly-attendance", getAttendanceAndStudentCount);
router.post("/upload-bulk-students/:schoolId", uploadMiddleware, UploadBulkStudents);

export { router as studentRoute };
