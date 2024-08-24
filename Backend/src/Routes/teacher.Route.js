import express from 'express';
import { createTeacher, deleteTeacher, getTeacher, getTeacherAttendance, getTeachers, updateTeacher } from '../Controller/teacher.Controller.js';

const router = express.Router();

router.post('/create-teacher/:schoolId', createTeacher);
router.get('/get-all-teachers', getTeachers);
router.get('/get-single-teacher/:teacherId', getTeacher);
router.put('/update-teacher/:teacherId', updateTeacher);
router.delete('/delete-teacher/:teacherId', deleteTeacher);
router.get('/get-teacher-attendance/:teacherId', getTeacherAttendance);

export { router as teacherRoute };