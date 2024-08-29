import { StudentHistory } from "../Models/studentHistory.Model.js";
import wrapAsync from "../Utils/wrapAsync.js";

export const getStudentHistory = wrapAsync(async (req, res) => {
    try {
        const studentHistory = await StudentHistory.find().populate("session class classSection");
        res.status(200).json({
            success: true,
            data: studentHistory,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const addStudentHistory = wrapAsync(async (req, res) => {
    try {
        const studentHistory = await StudentHistory.create(req.body);
        res.status(201).json({
            success: true,
            data: studentHistory,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const getSingleStudentHistory = wrapAsync(async (req, res) => {
    try {
        const studentHistory = await StudentHistory.findById(req.params.id).populate("session class classSection");
        if (!studentHistory) {
            return res.status(404).json({
                success: false,
                message: "Student history not found",
            });
        }
        res.status(200).json({
            success: true,
            data: studentHistory,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const updateStudentHistory = wrapAsync(async (req, res) => {
    try {
        const studentHistory = await StudentHistory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!studentHistory) {
            return res.status(404).json({
                success: false,
                message: "Student history not found",
            });
        }
        res.status(200).json({
            success: true,
            data: studentHistory,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const deleteStudentHistory = wrapAsync(async (req, res) => {
    try {
        const studentHistory = await StudentHistory.findByIdAndDelete(req.params.id);
        if (!studentHistory) {
            return res.status(404).json({
                success: false,
                message: "Student history not found",
            });
        }
        res.status(200).json({
            success: true,
            data: studentHistory,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

