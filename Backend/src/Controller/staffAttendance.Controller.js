import { Staff } from "../Models/staff.Model.js";
import { StaffAttendance } from "../Models/staffAttendence.Model.js";
import wrapAsync from "../utils/wrapAsync.js";
import { staffAttendanceValidationSchema } from "../Validation/staffAttendance.Validation.js";

export const createStaffAttendance = wrapAsync(async (req, res) => {
    const staff = await Staff.findById(req.params.staffId);
    if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
    }
    const staffAttendanceData = {
        staffId: staff._id,
        ...req.body,
    };
    staffAttendanceData.staffId = staffAttendanceData.staffId.toString();
    await staffAttendanceValidationSchema.validateAsync(staffAttendanceData);
    const staffAttendance = await StaffAttendance.create(staffAttendanceData);
    staff.staffAttendance.push(staffAttendance._id);
    await staff.save();
    res.status(201).json({ staffAttendance });
});

export const getStaffAttendance = wrapAsync(async (req, res) => {
    const staff = await Staff.findById(req.params.staffId).populate(
        "staffAttendance"
    );
    if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
    }
    res.status(200).json({ staffAttendance: staff.staffAttendance });
});

export const updateStaffAttendance = wrapAsync(async (req, res) => {
    const staffAttendance = await StaffAttendance.findByIdAndUpdate(
        req.params.attendanceId,
        req.body,
        { new: true }
    );
    if (!staffAttendance) {
        return res.status(404).json({ message: "Staff attendance not found" });
    }
    res.status(200).json({ staffAttendance });
});

export const deleteStaffAttendance = wrapAsync(async (req, res) => {
    const staffAttendance = await StaffAttendance.findByIdAndDelete(
        req.params.attendanceId
    );
    if (!staffAttendance) {
        return res.status(404).json({ message: "Staff attendance not found" });
    }
    res.status(200).json({
        message: "Staff attendance deleted successfully",
    });
});
