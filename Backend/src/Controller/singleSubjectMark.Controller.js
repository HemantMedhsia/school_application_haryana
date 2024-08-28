import Marks from "../Models/marks.Model.js";
import { SingleSubjectMark } from "../Models/singleSubjectMark.Model.js";
import wrapAsync from "../utils/wrapAsync.js";

export const createSingleSubjectMark = wrapAsync(async (req, res) => {
    const marks = await Marks.findById(req.params.marksId);
    if (!marks) {
        return res.status(404).json({ message: "Marks not found" });
    }
    const singleSubjectMark = new SingleSubjectMark(req.body);
    await singleSubjectMark.save();
    marks.subjectMarks.push(singleSubjectMark._id);
    await marks.save();
    res.status(201).json({
        success: true,
        data: singleSubjectMark,
    });
});

export const getSingleSubjectMarks = wrapAsync(async (req, res) => {
    const singleSubjectMarks = await SingleSubjectMark.find({
        subjectName: req.params.subjectName,
    });
    res.status(200).json({ singleSubjectMarks });
});

export const getSingleSubjectMarksById = wrapAsync(async (req, res) => {
    const singleSubjectMark = await SingleSubjectMark.findById(req.params.id);
    if (!singleSubjectMark) {
        return res.status(404).json({ message: "SingleSubjectMark not found" });
    }
    res.status(200).json({ singleSubjectMark });
});

export const updateSingleSubjectMark = wrapAsync(async (req, res) => {
    const singleSubjectMark = await SingleSubjectMark.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (!singleSubjectMark) {
        return res.status(404).json({ message: "SingleSubjectMark not found" });
    }
    res.status(200).json({ singleSubjectMark });
});

export const deleteSingleSubjectMark = wrapAsync(async (req, res) => {
    const singleSubjectMark = await SingleSubjectMark.findByIdAndDelete(
        req.params.id
    );
    if (!singleSubjectMark) {
        return res.status(404).json({ message: "Marks not found" });
    }
    res.status(200).json({
        message: "Marks Deleted Sucessfully",
        Deleted_data: singleSubjectMark,
    });
});
