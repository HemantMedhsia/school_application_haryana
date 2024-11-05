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

// export const createMultipleTeacherAttendenceInBulk = wrapAsync(
//     async (req, res) => {
//         const attendenceData = req.body;

//         if (!Array.isArray(attendenceData) || attendenceData.length === 0) {
//             return res.status(400).json({ message: "Invalid data provided." });
//         }

//         const savedAttendence = await TeacherAttendance.insertMany(
//             attendenceData
//         );

//         for (const attendance of savedAttendence) {
//             await Teacher.findByIdAndUpdate(attendance.teacherId, {
//                 $push: { TeacherAttendance: attendance._id },
//             });
//         }
//         res.status(201).json(new ApiResponse(201, savedAttendence));
//     }
// );

export const createMultipleTeacherAttendenceInBulk = wrapAsync(
    async (req, res) => {
        const attendenceData = req.body;

        if (!Array.isArray(attendenceData) || attendenceData.length === 0) {
            return res
                .status(400)
                .json(new ApiResponse(400, "Invalid data provided."));
        }

        for (const attendance of attendenceData) {
            const attendanceDate = new Date(attendance.date);
            const startOfDay = new Date(attendanceDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(attendanceDate.setHours(23, 59, 59, 999));

            const existingAttendance = await TeacherAttendance.findOne({
                teacherId: attendance.teacherId,
                date: {
                    $gte: startOfDay,
                    $lt: endOfDay,
                },
            });

            if (existingAttendance) {
                // Fetch the teacher's name to provide a clearer error message
                const teacher = await Teacher.findById(attendance.teacherId);
                const teacherName = teacher
                    ? teacher.name
                    : attendance.teacherId;

                return res
                    .status(400)
                    .json(
                        new ApiResponse(
                            400,
                            `Attendance for teacher ${teacherName} on date ${attendance.date} already exists.`
                        )
                    );
            }
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

export const updateTeacherAttendanceByTeacherId = wrapAsync(
    async (req, res) => {
        const { teacherId } = req.params;
        const { date, status } = req.body;
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0); // Start of the day (00:00:00)

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999); // End of the day (23:59:59)

        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({ message: "teacher not found 404" });
        }

        // Find the attendance record between the start and end of the given day
        const attendanceRecord = await TeacherAttendance.findOne({
            teacherId: teacherId,
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
