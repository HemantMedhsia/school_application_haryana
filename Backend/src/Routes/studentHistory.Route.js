import express from 'express'
import { addStudentHistory, deleteStudentHistory, getSingleStudentHistory, getStudentHistory, updateStudentHistory } from '../Controller/studentHistory.Controller.js';

const router = express.Router();

router.get("/all-student-history", getStudentHistory);
router.get("/single-student-history/:studentId", getSingleStudentHistory);
router.post("/add-student-history", addStudentHistory);
router.put("/update-student-history/:studentId", updateStudentHistory);
router.delete("/delete-student-history/:studentHistoryId", deleteStudentHistory);

export { router as studentHistoryRoute }
