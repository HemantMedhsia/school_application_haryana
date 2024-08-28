import { School } from "../Models/school.model.js";
import { Staff } from "../Models/staff.Model.js";
import wrapAsync from "../utils/wrapAsync.js";

export const createStaff = wrapAsync(async (req, res) => {
    const school = await School.findById(req.params.schoolId);
    if (!school) {
        return res.status(404).json({ message: "School not found" });
    }
    const staff = await Staff.create(req.body);
    school.workingStaffs.push(staff._id);
    await school.save();
    res.status(201).json({ staff });
});

export const getAllStaffs = wrapAsync(async (req, res) => {
    const staff = await Staff.find();
    res.status(200).json({ staff });
});

export const getStaffById = wrapAsync(async (req, res) => {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
    }
    res.status(200).json({ staff });
});

export const updateStaff = wrapAsync(async (req, res) => {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
    }
    res.status(200).json({ staff });
});

export const deleteStaff = wrapAsync(async (req, res) => {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
    }
    res.status(200).json({ message: "Staff deleted successfully" });
});
