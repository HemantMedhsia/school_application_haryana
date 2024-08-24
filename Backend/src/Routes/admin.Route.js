import express from 'express';
import { createAdmin, deleteAdmin, getAdminById, getAdmins, updateAdmin } from '../Controller/admin.Controller.js';

const router = express.Router();

router.post('/create-admin/:schoolId', createAdmin);
router.get('/get-all-admins', getAdmins);
router.get('/admin-single-admin/:id', getAdminById);
router.put('/update-admin/:id', updateAdmin);
router.delete('/delete-admin/:id', deleteAdmin);

export {router as adminRoute}; 