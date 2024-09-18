import express from "express";
import {createMarks, deleteMarks, getMarks, getMarksByDivision, getMarksByExamType, getMarksById, getMarksByRank, getMarksByStudentId, getMarksByTeacherId, updateMarks } from "../Controller/marks.Controller.js";
import { authenticateToken } from '../Middlewares/authenticateToken.js';

const router = express.Router();

// router.post('/create-marks/:studentId', authenticateToken, createMarks);
// router.get('/get-all-marks', authenticateToken, getMarks);
// router.get('/get-mark/:id', authenticateToken, getMarksById);
// router.put('/update-marks/:id', authenticateToken, updateMarks);
// router.delete('/delete-marks/:id', authenticateToken, deleteMarks);
// router.get('/get-marks-by-student/:studentId', authenticateToken, getMarksByStudentId);
// router.get('/get-marks-by-teacher/:teacherId', authenticateToken, getMarksByTeacherId);
// router.get('/get-marks-by-exam-type/:examType', authenticateToken, getMarksByExamType);
// router.get('/get-marks-by-division/:division', authenticateToken, getMarksByDivision);
// router.get('/get-marks-by-rank/:rank', authenticateToken, getMarksByRank);

export { router as marksRoute };
