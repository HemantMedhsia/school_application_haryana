import express from 'express';
import { createManySessions, createSession, deleteManySessions, deleteSession, getSessionById, getSessionByYear, getSessions, updateSession } from '../Controller/session.Controller.js';

const router = express.Router();

router.post("/create-single-session", createSession);
router.post("/create-many-sessions", createManySessions);
router.get("/get-all-sessions", getSessions);
router.get("/get-session-by-id/:id", getSessionById);
router.put("/update-session/:id", updateSession);
router.delete("/delete-session/:id", deleteSession);
router.post("/delete-many-sessions", deleteManySessions);
router.get("/get-session-by-year/:year", getSessionByYear);

export { router as sessionRoute };