import express from "express";
import {
    createFeesGroup,
    deleteFeesGroup,
    getAllFeesGroups,
    getFeesGroupById,
    updateFeesGroup,
} from "../Controller/feesGroup.Controller.js";

const router = express.Router();

router.post("/create-fees-group", createFeesGroup);
router.get("/get-all-fees-groups", getAllFeesGroups);
router.get("/get-fees-group-by-id/:id", getFeesGroupById);
router.put("/update-fees-group/:id", updateFeesGroup);
router.delete("/delete-fees-group/:id", deleteFeesGroup);

export { router as feesGroupRouter };
