import { StudentHistory } from "../Models/studentHistory.Model.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";

export const getStudentHistory = wrapAsync(async (req, res) => {
        const studentHistory = await StudentHistory.find().populate("session class classSection");
        res.status(200).json(new ApiResponse(true, studentHistory));
});

export const addStudentHistory = wrapAsync(async (req, res) => {
        const studentHistory = await StudentHistory.create(req.body);
        return res.status(201).json(new ApiResponse(201, studentHistory , "Student history created", true));
});

export const getSingleStudentHistory = wrapAsync(async (req, res) => {
        const studentHistory = await StudentHistory.find({studentId:req.params.studentId}).populate("session class classSection");
        if (!studentHistory) {
            return res.status(404).json(new ApiResponse(false, "Student history not found"));
        }
        res.status(200).json(new ApiResponse(200, studentHistory , "Student history found", true));
});

export const updateStudentHistory = wrapAsync(async (req, res) => {
        const studentHistory = await StudentHistory.findByIdAndUpdate(
            req.params.studentId,
            req.body,
            { new: true }
        );
        if (!studentHistory) {
            return res.status(404).json(
                new ApiResponse(false, "Student history not found")
            );
        }
        res.status(200).json(new ApiResponse(true, studentHistory));
});

export const deleteStudentHistory = wrapAsync(async (req, res) => {
        const studentHistory = await StudentHistory.findByIdAndDelete(req.params.studentHistoryId);
        if (!studentHistory) {
            return res.status(404).json(new ApiResponse(404,null, "Student history not found", false));
        }
        res.status(200).json(new ApiResponse(200, studentHistory, "Student history deleted", true));
});