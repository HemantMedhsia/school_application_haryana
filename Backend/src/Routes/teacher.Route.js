import express from "express";
import {
    createTeacher,
    deleteTeacher,
    getTeacher,
    getTeacherAttendance,
    getTeachers,
    loginTeacher,
    refreshAccessTokenTeacher,
    updateTeacher,
} from "../Controller/teacher.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRoles.js";

const router = express.Router();

router.post("/create-teacher/:schoolId", createTeacher);
router.get("/get-all-teachers",authenticateToken,authorizeRoles("Admin"), getTeachers);
router.get("/get-single-teacher/:teacherId", getTeacher);
router.put("/update-teacher/:teacherId", updateTeacher);
router.delete("/delete-teacher/:teacherId", deleteTeacher);
router.get("/get-teacher-attendance/:teacherId", getTeacherAttendance);

router.post("/login-teacher", loginTeacher);
router.post("/refresh-token-teacher", refreshAccessTokenTeacher);

export { router as teacherRoute };
