import { Teacher } from "../Models/teacher.model.js";
import { TeacherAttendance } from "../Models/teacherAttendence.model.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { teacherAttendanceValidationSchema } from "../Validation/teacherAttendence.Validation.js";

export const createTeacherAttendance = wrapAsync(async (req, res) => {
    const teacher = await Teacher.findById(req.params.teacherId);
    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }
    const teacherAttendanceData = {
        teacherId: teacher._id,
        ...req.body,
    };
    teacherAttendanceData.teacherId =
        teacherAttendanceData.teacherId.toString();
    await teacherAttendanceValidationSchema.validateAsync(
        teacherAttendanceData
    );
    const teacherAttendance = await TeacherAttendance.create(
        teacherAttendanceData
    );
    teacher.teacherAttendance.push(teacherAttendance._id);
    await teacher.save();
    return res.status(201).json(new ApiResponse(201, teacherAttendance));
});

export const createMultipleTeacherAttendenceInBulk = wrapAsync(
    async (req, res) => {
        const attendenceData = req.body;

        if (!Array.isArray(attendenceData) || attendenceData.length === 0) {
            return res.status(400).json({ message: "Invalid data provided." });
        }

        const savedAttendence = await TeacherAttendance.insertMany(
            attendenceData
        );

        for (const attendance of savedAttendence) {
            await Teacher.findByIdAndUpdate(attendance.teacherId, {
                $push: { TeacherAttendance: attendance._id },
            });
        }
        res.status(201).json(new ApiResponse(201, savedAttendence));
    }
);

export const getAttendanceSummary = wrapAsync(async (req, res) => {
    const { teacherId } = req.params;

    const teacher = await Teacher.findById(teacherId).populate(
        "TeacherAttendance"
    );

    if (!teacher) {
        return res.status(404).json({ message: "Student not found." });
    }

    const attendanceRecords = teacher.TeacherAttendance;

    if (!attendanceRecords || attendanceRecords.length === 0) {
        return res
            .status(404)
            .json({ message: "No attendance records found for this teacher." });
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
    res.status(201).json(new ApiResponse(201, summary));
});

export const getTeacherAttendance = wrapAsync(async (req, res) => {
    const teacher = await Teacher.findById(req.params.teacherId).populate(
        "teacherAttendance"
    );
    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ teacherAttendance: teacher.teacherAttendance });
    return res.status(200).json(new ApiResponse(200, teacher));
});

export const updateTeacherAttendance = wrapAsync(async (req, res) => {
    const teacherAttendance = await TeacherAttendance.findByIdAndUpdate(
        req.params.attendanceId,
        req.body,
        { new: true }
    );
    if (!teacherAttendance) {
        return res
            .status(404)
            .json({ message: "Teacher attendance not found" });
    }
    return res
        .status(200)
        .json(new ApiResponse(200, teacherAttendance, "Update Successfully"));
});

export const deleteTeacherAttendance = wrapAsync(async (req, res) => {
    const teacherAttendance = await TeacherAttendance.findByIdAndDelete(
        req.params.attendanceId
    );
    if (!teacherAttendance) {
        return res
            .status(404)
            .json({ message: "Teacher attendance not found" });
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                teacherAttendance,
                "Teacher attendance deleted successfully"
            )
        );
});

export const getTeacherAttendanceByTeacherId = wrapAsync(async (req, res) => {
    const teacherId = req.user.id;

    const teacher = await Teacher.findById(teacherId)
        .populate("TeacherAttendance")
        .lean();

    if (!teacher) {
        return res.status(404).json({ error: "Teacher not found." });
    }

    const attendanceResponse = {};
    teacher.TeacherAttendance.forEach((record) => {
        const date = record.date.toISOString().split("T")[0];
        attendanceResponse[date] = record.status;
    });
    // hello

    res.status(200).json(new ApiResponse(200, attendanceResponse));
});


export const getTeacherAttendanceByAdmin = wrapAsync(async (req, res) => {
    const teacherId = req.params.teacherId;

    const teacher = await Teacher.findById(teacherId)
        .populate("TeacherAttendance")
        .lean();

    if (!teacher) {
        return res.status(404).json({ error: "Teacher not found." });
    }

    const attendanceResponse = {};
    teacher.TeacherAttendance.forEach((record) => {
        const date = record.date.toISOString().split("T")[0];
        attendanceResponse[date] = record.status;
    });
    

    res.status(200).json(new ApiResponse(200, attendanceResponse));
});