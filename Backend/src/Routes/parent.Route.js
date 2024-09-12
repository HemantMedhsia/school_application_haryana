import express from "express";
import {
    createParent,
    deleteParent,
    getParent,
    getParents,
    getParentStudents,
    loginParent,
    refreshAccessTokenParent,
    updateParent,
} from "../Controller/parent.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRoles.js";

const router = express.Router();

router.post("/create-parent/:studentId", createParent);
router.get("/get-all-parents",authenticateToken,authorizeRoles("Admin"), getParents);
router.get("/get-parent/:id", getParent);
router.put("/update-parent/:id", updateParent);
router.delete("/delete-parent/:id", deleteParent);
router.get("/get-parent-student/:studentId", getParentStudents);

router.post("/login-parent",loginParent);
router.post("/refresh-token-parent",refreshAccessTokenParent);

export { router as parentRoute };
