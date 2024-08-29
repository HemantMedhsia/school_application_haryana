import { Session } from "../Models/session.Model.js";
import wrapAsync from "../utils/wrapAsync.js";

export const createSession = wrapAsync(async (req, res) => {
    const session = await Session.create(req.body);
    res.status(201).json({ session });
});

export const createManySessions = wrapAsync(async (req, res) => {
    const sessions = await Session.insertMany(req.body);
    res.status(201).json({ sessions });
});

export const getSessions = wrapAsync(async (req, res) => {
    const sessions = await Session.find();
    res.status(200).json({ sessions });
});

export const getSessionById = wrapAsync(async (req, res) => {
    const session = await Session.findById(req.params.id);
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json({ session });
});

export const updateSession = wrapAsync(async (req, res) => {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json({ session });
});

export const deleteSession = wrapAsync(async (req, res) => {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json({ message: "Session deleted successfully" });
});

export const deleteManySessions = wrapAsync(async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid or empty IDs array" });
        }

        const sessions = await Session.deleteMany({ _id: { $in: ids } });
        if (sessions.deletedCount === 0) {
            return res.status(404).json({ message: "No sessions found to delete" });
        }

        res.status(200).json({
            message: "Sessions deleted successfully",
            sessions,
        });
    } catch (error) {
        console.error("Error deleting sessions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const getSessionByYear = wrapAsync(async (req, res) => {
    const { year } = req.params;
    const sessions = await Session.find({ sessionYear: year });
    res.status(200).json({ sessions });
});
