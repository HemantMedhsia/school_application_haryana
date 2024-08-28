import express from 'express';
import { createSingleSubjectMark, deleteSingleSubjectMark, getSingleSubjectMarks, getSingleSubjectMarksById, updateSingleSubjectMark } from '../Controller/singleSubjectMark.Controller.js';

const router = express.Router();

router.post('/create-single-subject-mark/:marksId', createSingleSubjectMark);
router.get('/get-single-subject-marks-by-subjectname/:subjectName', getSingleSubjectMarks);
router.get('/get-single-subject-mark-by-id/:id', getSingleSubjectMarksById);
router.put('/update-single-subject-mark/:id', updateSingleSubjectMark);
router.delete('/delete-single-subject-mark/:id', deleteSingleSubjectMark);

export { router as singleSubjectMarkRoute };