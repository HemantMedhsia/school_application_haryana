import express from 'express';
import {  getAllClassStudentMarks, getResultByStudent } from '../Controller/result.Controller.js';


const router = express.Router();


router.post("/create-result", getAllClassStudentMarks);
router.get("/get-result/:studentId",getResultByStudent);






export { router as resultRoute };
