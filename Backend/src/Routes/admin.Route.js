import express from "express";
import {
    createAdmin,
    deleteAdmin,
    getAdminById,
    getAdmins,
    loginAdmin,
    refreshAccessTokenAdmin,
    updateAdmin,
} from "../Controller/admin.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRoles.js";

const router = express.Router();

router.post("/create-admin/:schoolId", createAdmin);
router.get(
    "/get-all-admins",
    authenticateToken,
    authorizeRoles("Admin"),
    getAdmins
);
router.get("/admin-single-admin/:id", getAdminById);
router.put("/update-admin/:id", updateAdmin);
router.delete("/delete-admin/:id", deleteAdmin);

router.post("/login-admin", loginAdmin);
router.post("/refresh-token-admin", refreshAccessTokenAdmin);

export { router as adminRoute };
