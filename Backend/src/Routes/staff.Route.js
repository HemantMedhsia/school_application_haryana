import express from 'express';
import { createStaff, deleteStaff, getAllStaffs, getStaffById, updateStaff } from '../Controller/staff.Controller.js';

const router = express.Router();

router.post('/create-staff/:schoolId', createStaff);
router.get('/get-all-staffs', getAllStaffs);
router.get('/get-single-staff/:id', getStaffById);
router.put('/update-staff/:id', updateStaff);
router.delete('/delete-staff/:id', deleteStaff);



export { router as staffRoute };