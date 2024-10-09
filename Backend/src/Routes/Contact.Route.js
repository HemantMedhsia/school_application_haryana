import express from "express";
import {
    addContact,
    deleteContact,
    getContact,
    getContacts,
    updateContact,
} from "../Controller/Contact.Controller.js";

const router = express.Router();

router.post("/add-contact", addContact);
router.get("/get-contacts", getContacts);
router.get("/get-contact/:id", getContact);
router.put("/update-contact/:id", updateContact);
router.delete("/delete-contact/:id", deleteContact);

export { router as ContactRoute };
