import { Staff } from "../Models/staff.Model.js";
import { StaffAttendance } from "../Models/staffAttendence.Model.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
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
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                staffAttendance,
                "Staff Attendance Added Successfully"
            )
        );
});

export const createMultipleStaffAttendenceInBulk = wrapAsync(
    async (req, res) => {
        const attendenceData = req.body;

        if (!Array.isArray(attendenceData) || attendenceData.length === 0) {
            return res.status(400).json({ message: "Invalid data provided." });
        }

        const savedAttendence = await StaffAttendance.insertMany(
            attendenceData
        );

        for (const attendance of savedAttendence) {
            await Staff.findByIdAndUpdate(attendance.staffId, {
                $push: { staffAttendance: attendance._id },
            });
        }
        res.status(201).json(new ApiResponse(201, savedAttendence));
    }
);

export const getStaffAttendanceSummary = wrapAsync(async (req, res) => {
    const { staffId } = req.params;

    const staff = await Staff.findById(staffId).populate("staffAttendance");

    if (!staff) {
        return res.status(404).json({ message: "Staff not found." });
    }

    const attendanceRecords = staff.staffAttendance;

    if (!attendanceRecords || attendanceRecords.length === 0) {
        return res
            .status(404)
            .json({ message: "No attendance records found for this staff." });
    }

    const totalRecords = attendanceRecords.length;

    const presentCount = attendanceRecords.filter(
        (record) => record.status === "Present"
    ).length;
    const absentCount = attendanceRecords.filter(
        (record) => record.status === "Absent"
    ).length;

    const percentage = (presentCount / totalRecords) * 100;

    const summary = {
        total: totalRecords,
        present: presentCount,
        absent: absentCount,
        percentage: percentage.toFixed(2),
    };
    res.status(200).json(new ApiResponse(200, summary)); // Change 201 to 200 for successful responses
});

export const getStaffAttendance = wrapAsync(async (req, res) => {
    const staff = await Staff.findById(req.params.staffId).populate(
        "staffAttendance"
    );
    if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
    }
    return res.status(200).json(new ApiResponse(200, staff.staffAttendance));
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
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                staffAttendance,
                "Staff attendance Updated Successfully"
            )
        );
});

export const updateStaffAttendanceByStaffId = wrapAsync(
    async (req, res) => {
        const { staffId } = req.params;
        const { date, status } = req.body;
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0); // Start of the day (00:00:00)

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999); // End of the day (23:59:59)

        const staff = await Staff.findById(staffId);

        if (!staff) {
            return res.status(404).json({ message: "staff not found 404" });
        }

        // Find the attendance record between the start and end of the given day
        const attendanceRecord = await StaffAttendance.findOne({
            staffId: staffId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });

        if (attendanceRecord) {
            attendanceRecord.status = status;
            await attendanceRecord.save();
            return res
                .status(200)
                .json(new ApiResponse(200, "Attendance updated successfully"));
        }
        return res
            .status(404)
            .json(new ApiResponse(404, "Attendance record not found"));
    }
);

export const deleteStaffAttendance = wrapAsync(async (req, res) => {
    const staffAttendance = await StaffAttendance.findByIdAndDelete(
        req.params.attendanceId
    );
    if (!staffAttendance) {
        return res.status(404).json({ message: "Staff Attendance not found" });
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                staffAttendance,
                "Staff Attendance Deleted Successfully"
            )
        );
});

export const getStaffAttendanceByAdmin = wrapAsync(async (req, res) => {
    const staffId = req.params.staffId;

    const staff = await Staff.findById(staffId)
        .populate("staffAttendance")
        .lean();

    if (!staff) {
        return res.status(404).json({ error: "staff not found." });
    }

    const attendanceResponse = {};
    staff.staffAttendance.forEach((record) => {
        const date = record.date.toISOString().split("T")[0];
        attendanceResponse[date] = record.status;
    });

    res.status(200).json(new ApiResponse(200, attendanceResponse));
});

