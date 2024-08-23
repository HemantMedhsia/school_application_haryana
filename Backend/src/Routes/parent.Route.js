import express from "express";
import {
    createParent,
    deleteParent,
    getParent,
    getParents,
    updateParent,
} from "../Controller/parent.Controller.js";

const router = express.Router();

router.post("/create-parent/:studentId", createParent);
router.get("/get-all-parents", getParents);
router.get("/get-parent/:id", getParent);
router.put("/update-parent/:id", updateParent);
router.delete("/delete-parent/:id", deleteParent);

export { router as parentRoute };
