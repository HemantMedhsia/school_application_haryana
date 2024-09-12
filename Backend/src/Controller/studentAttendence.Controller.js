import wrapAsync from "../Utils/wrapAsync.js";
import { Student } from "../Models/student.model.js";
import { Teacher } from "../Models/teacher.model.js";
import { StudentAttendance } from "../Models/studentAttendence.Model.js";
import { attendanceValidationSchema } from "../Validation/studentAttendence.validation.js";
import { exec } from "apexcharts";

export const createStudentAttendence = wrapAsync(async (req, res) => {
    const { studentId } = req.params;
    const teacherId = req.user.id;

    const { error } = attendanceValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    const attendance = new StudentAttendance({
        studentId,
        ...req.body,
        teacherId,
    });

    const savedAttendance = await attendance.save();

    await Student.findByIdAndUpdate(
        studentId,
        { $push: { StudentAttendance: savedAttendance._id } },
        { new: true }
    );

    res.status(201).json({ success: true, data: savedAttendance });
});

export const getStudentAttendance = wrapAsync(async (req, res) => {
    const { studentId } = req.params;

    const attendanceRecords = await StudentAttendance.find({ studentId });

    if (!attendanceRecords || attendanceRecords.length === 0) {
        return res
            .status(404)
            .json({ message: "No attendance records found for this student." });
    }

    res.status(200).json({ success: true, data: attendanceRecords });
});

export const updateStudentAttendance = wrapAsync(async (req, res) => {
    const { attendanceId } = req.params;

    const updatedAttendance = await StudentAttendance.findByIdAndUpdate(
        attendanceId,
        req.body,
        { new: true }
    );

    if (!updatedAttendance) {
        return res
            .status(404)
            .json({ message: "Attendance record not found." });
    }

    res.status(200).json({ success: true, data: updatedAttendance });
});

export const deleteStudentAttendance = wrapAsync(async (req, res) => {
    const { attendanceId } = req.params;

    const deletedAttendance = await StudentAttendance.findByIdAndDelete(
        attendanceId
    );

    if (!deletedAttendance) {
        return res
            .status(404)
            .json({ message: "Attendance record not found." });
    }

    await Student.findByIdAndUpdate(
        deletedAttendance.studentId,
        { $pull: { StudentAttendance: attendanceId } },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: "Attendance record deleted.",
    });
});

export const getAttendanceSummary = wrapAsync(async (req, res) => {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).populate(
        "StudentAttendance"
    );
    
    if (!student) {
        return res.status(404).json({ message: "Student not found." });
    }

    const attendanceRecords = student.StudentAttendance;
    

    if (!attendanceRecords || attendanceRecords.length === 0) {
        return res
            .status(404)
            .json({ message: "No attendance records found for this student." });
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

    res.status(200).json({ success: true, data: summary });
});

export const getAttendanceByDateRange = wrapAsync(async (req, res) => {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    const attendanceRecords = await StudentAttendance.find({
        studentId,
        date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        },
    });

    if (!attendanceRecords || attendanceRecords.length === 0) {
        return res.status(404).json({
            message: "No attendance records found within this date range.",
        });
    }

    res.status(200).json({ success: true, data: attendanceRecords });
});

export const createMultipleStudentAttendenceInBulk = wrapAsync(async (req, res) => {
    const attendenceData = req.body;

    if(!Array.isArray(attendenceData) || attendenceData.length === 0) {
        return res.status(400).json({ message: "Invalid data provided." });
    }

    try {
        const savedAttendence = await StudentAttendance.insertMany(attendenceData);
        res.status(201).json({ success: true, data: savedAttendence });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});

export const getAllStudentAttendance = wrapAsync(async (req, res) => {
    const attendanceRecords = await StudentAttendance.find();

    if (!attendanceRecords || attendanceRecords.length === 0) {
        return res
            .status(404)
            .json({ message: "No attendance records found." });
    }

    res.status(200).json({ success: true, data: attendanceRecords });
});