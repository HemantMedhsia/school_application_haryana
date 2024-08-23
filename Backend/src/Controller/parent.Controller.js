import { Parent } from "../Models/parents.model.js";
import { Student } from "../Models/student.model.js";
import wrapAsync from "../Utils/wrapAsync.js";

export const createParent = wrapAsync(async (req, res) => {
    const parent = new Parent(req.body);
    const parentData = await parent.save();

    // Find the student by student id
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);
    if (!student) {
        throw new NotFoundError(`Student with id ${studentId} not found`);
    }

    // Assign parent id to the student schema
    student.parent = parentData._id;
    await student.save();

    res.status(201).json({
        success: true,
        data: parent,
    });
});

export const getParents = wrapAsync(async (req, res) => {
    const parents = await Parent.find();
    res.status(200).json({
        success: true,
        data: parents,
    });
});

export const getParent = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const parent = await Parent.findById(id);
    if (!parent) {
        throw new NotFoundError(`Parent with id ${id} not found`);
    }
    res.status(200).json({
        success: true,
        data: parent,
    });
});

export const updateParent = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const parent = await Parent.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!parent) {
        throw new NotFoundError(`Parent with id ${id} not found`);
    }
    res.status(200).json({
        success: true,
        data: parent,
    });
});

export const deleteParent = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const parent = await Parent.findByIdAndDelete(id);
    if (!parent) {
        throw new NotFoundError(`Parent with id ${id} not found`);
    }
    res.status(200).json({
        success: true,
        data: {},
    });
});
