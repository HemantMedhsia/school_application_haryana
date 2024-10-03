import wrapAsync from "../Utils/wrapAsync.js";
import { Student } from "../Models/student.model.js";
import { Teacher } from "../Models/teacher.model.js";
import { StudentAttendance } from "../Models/studentAttendence.Model.js";
import { attendanceValidationSchema } from "../Validation/studentAttendence.validation.js";
import { ApiResponse } from "../Utils/responseHandler.js";

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
    const attendanceRecords = await StudentAttendance.find({
        studentId: req.params.studentId,
    });

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

export const updateStudentAttendanceByStudentId = wrapAsync(
    async (req, res) => {
        const { studentId } = req.params;
        const { date, status } = req.body;
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0); // Start of the day (00:00:00)

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999); // End of the day (23:59:59)

        console.log(startOfDay, endOfDay);

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found 404" });
        }

        // Find the attendance record between the start and end of the given day
        const attendanceRecord = await StudentAttendance.findOne({
            studentId: studentId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });
        console.log("123", attendanceRecord);

        if (attendanceRecord) {
            attendanceRecord.status = status;
            await attendanceRecord.save();
            return res
                .status(200)
                .json({ message: "Attendance updated successfully" });
        }
        return res.status(404).json({ message: "Attendance record not found" });
    }
);

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

export const createMultipleStudentAttendenceInBulk = wrapAsync(
    async (req, res) => {
        const attendenceData = req.body;

        if (!Array.isArray(attendenceData) || attendenceData.length === 0) {
            return res.status(400).json({ message: "Invalid data provided." });
        }
        for (const attendance of attendenceData) {
            const attendanceDate = new Date(attendance.date);
            const startOfDay = new Date(attendanceDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(attendanceDate.setHours(23, 59, 59, 999));

            const existingAttendance = await StudentAttendance.findOne({
                studentId: attendance.studentId,
                date: {
                    $gte: startOfDay,
                    $lt: endOfDay,
                },
            });

            if (existingAttendance) {
                return res.status(400).json({
                    AttendenceErr: true,
                    message: `Attendance for student ${attendance.studentId} on date ${attendance.date} already exists.`,
                });
            }
        }

        const savedAttendence = await StudentAttendance.insertMany(
            attendenceData
        );

        for (const attendance of savedAttendence) {
            await Student.findByIdAndUpdate(attendance.studentId, {
                $push: { StudentAttendance: attendance._id },
            });
        }
        res.status(201).json({ success: true, data: savedAttendence });
    }
);

export const getAllStudentAttendance = wrapAsync(async (req, res) => {
    const attendanceRecords = await StudentAttendance.find();

    if (!attendanceRecords || attendanceRecords.length === 0) {
        return res
            .status(404)
            .json({ message: "No attendance records found." });
    }

    res.status(200).json({ success: true, data: attendanceRecords });
});

export const getStudentAttendanceByStudentId = wrapAsync(async (req, res) => {
    const studentId = req.user.id;

    const student = await Student.findById(studentId)
        .populate("StudentAttendance")
        .lean();

    if (!student) {
        return res.status(404).json({ error: "Student not found." });
    }

    const attendanceResponse = {};
    student.StudentAttendance.forEach((record) => {
        const date = record.date.toISOString().split("T")[0];
        attendanceResponse[date] = record.status;
    });

    res.status(200).json(new ApiResponse(200, attendanceResponse));
});

export const getStudentAttendanceByParentId = wrapAsync(async (req, res) => {
    const parentId = req.user.id;

    const students = await Student.find({ parent: parentId })
        .populate("StudentAttendance")
        .lean();

    if (!students || students.length === 0) {
        return res
            .status(404)
            .json({ error: "No students found for this parent." });
    }

    const attendanceResponse = {};

    students.forEach((student) => {
        console.log(student.StudentAttendance);
        student.StudentAttendance.forEach((record) => {
            const date = record.date.toISOString().split("T")[0];
            attendanceResponse[date] = record.status;
        });
    });

    res.status(200).json(new ApiResponse(200, attendanceResponse));
});

export const getStudentAttendanceByStudentId_Admin = wrapAsync(
    async (req, res) => {
        const studentId = req.params.studentId;

        const student = await Student.findById(studentId)
            .populate("StudentAttendance")
            .lean();

        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }

        const attendanceResponse = {};
        student.StudentAttendance.forEach((record) => {
            const date = record.date.toISOString().split("T")[0];
            attendanceResponse[date] = record.status;
        });

        res.status(200).json(new ApiResponse(200, attendanceResponse));
    }
);
