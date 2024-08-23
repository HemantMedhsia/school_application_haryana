import express from 'express';
import { createSchool, deleteSchool, getSchool, getSchools } from '../Controller/school.Controller.js';

const router = express.Router();

router.post('/create-school', createSchool);
router.get('/get-schools', getSchools);
router.get('/get-school/:id', getSchool);
router.delete('/delete-school/:id', deleteSchool);

export {router as schoolRoute};