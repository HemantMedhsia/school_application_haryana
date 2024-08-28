import express from "express";
import {
    createStudent,
    deleteStudent,
    getStudent,
    getStudentByParent,
    getStudents,
    loginStudent,
    refreshAccessTokenStudent,
    updateStudent,
} from "../Controller/student.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRoles.js";

const router = express.Router();

router.post("/create-student/:schoolId", createStudent);
router.get(
    "/get-all-students",
    authenticateToken,
    authorizeRoles("Student"),
    getStudents
);

router.get("/get-student/:id", getStudent);
router.delete("/delete-student/:id", deleteStudent);
router.patch("/update-student/:id", updateStudent);
router.get("/get-student-by-parent/:parentId", getStudentByParent);
router.post("/login-student", loginStudent);
router.post("/refresh-token-student", refreshAccessTokenStudent);

export { router as studentRoute };
