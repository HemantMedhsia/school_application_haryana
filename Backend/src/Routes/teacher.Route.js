import express from "express";
import {
    createTeacher,
    deleteTeacher,
    getAttendanceAndTeacherCount,
    getTeacher,
    getTeacherAttendance,
    getTeachers,
    loginTeacher,
    refreshAccessTokenTeacher,
    updateTeacher,
    uploadBulkTeacherData,
} from "../Controller/teacher.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRoles.js";
import { uploadMiddleware } from "../Middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/create-teacher/:schoolId", createTeacher);
router.get(
    "/get-all-teachers",
    authenticateToken,
    authorizeRoles("Admin"),
    getTeachers
);
router.get("/get-single-teacher/:teacherId", getTeacher);
router.put("/update-teacher/:teacherId", updateTeacher);
router.delete("/delete-teacher/:teacherId", deleteTeacher);
router.get("/get-teacher-attendance/:teacherId", getTeacherAttendance);

router.post("/login-teacher", loginTeacher);
router.post("/refresh-token-teacher", refreshAccessTokenTeacher);
router.get("/teacher-weekly-attendance", getAttendanceAndTeacherCount);
router.post(
    "/bulk-upload-teacher/:schoolId",
    uploadMiddleware,
    uploadBulkTeacherData
);

export { router as teacherRoute };
