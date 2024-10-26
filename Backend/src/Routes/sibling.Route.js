import express from "express";
import {
    addOrCreateSiblingGroup,
    getSiblingGroup,
    removeSiblingFromGroup,
} from "../Controller/sibling.Controller.js";

const router = express.Router();

router.put("/add-or-update-sibling", addOrCreateSiblingGroup);
router.put("/remove-sibling-from-group", removeSiblingFromGroup);
router.get("/get-sibling-group/:siblingGroupId", getSiblingGroup);

export { router as siblingRouter };
