import express from "express";
import { addContact }from "../Controller/Contact.Controller.js";

const router = express.Router();

router.post("/add-contact", addContact);


export { router as ContactRoute };
