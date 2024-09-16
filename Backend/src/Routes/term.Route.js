import express from "express";
import {
    createTerm,
    deleteTerm,
    getTermById,
    getTerms,
    updateTerm,
} from "../Controller/term.Controller.js";

const router = express.Router();

router.post("/create-examgroup", createTerm);
router.get("/get-examgroup", getTerms);
router.get("/get-examgroup/:id", getTermById);
router.put("/update-examgroup/:id", updateTerm);
router.delete("/delete-examgroup/:id", deleteTerm);

export { router as termRoute };
