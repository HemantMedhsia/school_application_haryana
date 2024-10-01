import express from "express";
import {
    addMarks,
    addMultipleStudentMarks,
    deleteMarks,
    getAllMarks,
    getExistingMarks,
    getMarkById,
    getMarksByAllIds,
    getMarksByClass,
    getMarksByClassAndExamType,
    getMarksByStudent,
    getStudentExamResultsByExamType,
    studentMarkbytermandexamtype,
    updateMarks,
} from "../Controller/mark.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRoles.js";
import { getMarksByExamCategoryClassAndSection } from "../Controller/marks.Controller.js";

const router = express.Router();

router.post("/add-mark-data", authenticateToken, addMarks);
router.post("/addmultiple-mark-data", addMultipleStudentMarks);
router.get("/getall-marks", getAllMarks);
router.get("/get-mark/:id", getMarkById);
router.put("/update-mark/:id", updateMarks);
router.delete("/delete-mark/:id", deleteMarks);
router.get("/get-mark-by-student/:studentId", getMarksByStudent);
router.get("/get-mark-by-class/:classId", getMarksByClass);
router.post("/student-mark", studentMarkbytermandexamtype);
router.get(
    "/get-mark-by-class-and-exam-type/:classId/:examTypeId",
    getMarksByClassAndExamType
);
router.get(
    "/getexisting/:termId/:classId/:examTypeId/:subjectId",
    getExistingMarks
);

router.get(
    "/get-allid/:termId/:classId/:examTypeId/:subjectId",
    getMarksByAllIds
);
router.post("/get-student-result-byexamtype", getStudentExamResultsByExamType);
router.get("/get-student-result-byExamCategoryandMClass/:examCategoryId/:classId", getMarksByExamCategoryClassAndSection);

export { router as markRoute };
