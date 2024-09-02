import { Session } from "../Models/session.Model.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { sessionValidationSchema } from "../Validation/session.Validation.js";

export const createSession = wrapAsync(async (req, res) => {
    await sessionValidationSchema.validateAsync(req.body);
    const session = await Session.create(req.body);
    return res
        .status(201)
        .json(new ApiResponse(201, session, "Session Add Successfully"));
});

export const createManySessions = wrapAsync(async (req, res) => {
    const sessions = await Session.insertMany(req.body);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                sessions,
                "Multiple Session Created Successfully"
            )
        );
});

export const getSessions = wrapAsync(async (req, res) => {
    const sessions = await Session.find();
    return res.status(200).json(new ApiResponse(200, sessions));
});

export const getSessionById = wrapAsync(async (req, res) => {
    const session = await Session.findById(req.params.id);
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }
    return res.status(200).json(new ApiResponse(200, session));
});

export const updateSession = wrapAsync(async (req, res) => {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }
    return res
        .status(200)
        .json(new ApiResponse(200, session, "Session Updated Sucessfully"));
});

export const deleteSession = wrapAsync(async (req, res) => {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }
    return res
        .status(200)
        .json(new ApiResponse(200, session, "Session Deleted Successfully"));
});

export const deleteManySessions = wrapAsync(async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Invalid or empty IDs array" });
    }

    const sessions = await Session.deleteMany({ _id: { $in: ids } });
    if (sessions.deletedCount === 0) {
        return res.status(404).json({ message: "No sessions found to delete" });
    }
    return res
        .status(200)
        .json(new ApiResponse(200, sessions, "Sessions Deleted Successfully"));
});

export const getSessionByYear = wrapAsync(async (req, res) => {
    const { year } = req.params;
    const sessions = await Session.find({ sessionYear: year });
    return res.status(200).json(new ApiResponse(200, sessions));
});
