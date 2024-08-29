import express from "express";
import {
    createStaff,
    deleteStaff,
    getAllStaffs,
    getStaffById,
    loginStaff,
    refreshAccessTokenStaff,
    updateStaff,
} from "../Controller/staff.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";

const router = express.Router();

router.post("/create-staff/:schoolId", createStaff);
router.get("/get-all-staffs", getAllStaffs);
router.get("/get-single-staff/:id",authenticateToken, getStaffById);
router.put("/update-staff/:id", updateStaff);
router.delete("/delete-staff/:id", deleteStaff);

router.post("/login-staff", loginStaff);
router.post("/refresh-token-staff", refreshAccessTokenStaff);
export { router as staffRoute };
