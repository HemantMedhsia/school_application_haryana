import express from "express";
import {
    addOrCreateSiblingGroup,
    deleteSiblingGroup,
    getAllSiblingBystudentId,
    getAllSiblingGroup,
    getSiblingGroup,
    removeSiblingFromGroup,
} from "../Controller/sibling.Controller.js";

const router = express.Router();

router.put("/add-or-update-sibling", addOrCreateSiblingGroup);
router.put("/remove-sibling-from-group", removeSiblingFromGroup);
router.get("/get-sibling-group/:siblingGroupId", getSiblingGroup);
router.delete("/delete-sibling-group/:siblingGroupId", deleteSiblingGroup);
router.get("/get-sibling-group", getAllSiblingGroup);
router.get("/get-sibling-group-studentid/:studentId", getAllSiblingBystudentId);

export { router as siblingRouter };
