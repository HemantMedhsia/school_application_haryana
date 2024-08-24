import express from "express";
import {
    createStudent,
    deleteStudent,
    getStudent,
    getStudentByParent,
    getStudents,
    loginStudent,
    updateStudent,
} from "../Controller/student.Controller.js";

const router = express.Router();

router.post("/create-student/:schoolId", createStudent);
router.get("/get-all-students", getStudents);
router.get("/get-student/:id", getStudent);
router.delete("/delete-student/:id", deleteStudent);
router.patch("/update-student/:id", updateStudent);
router.get("/get-student-by-parant/:parentId", getStudentByParent);

router.post("/student-login", loginStudent);

export { router as studentRoute };
