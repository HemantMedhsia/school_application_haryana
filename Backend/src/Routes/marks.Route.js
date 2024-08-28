import express from 'express';
import { createMark, updateMark } from '../Controller/marks.Controller.js';

const router = express.Router();

router.post('/create-marks/:studentId/:teacherId', createMark);
router.put('/update-marks/:studentId', updateMark);

export { router as marksRoute };