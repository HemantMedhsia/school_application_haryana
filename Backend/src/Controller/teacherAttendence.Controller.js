import { Teacher } from "../Models/teacher.model.js";
import { TeacherAttendance } from "../Models/teacherAttendence.model.js";
import wrapAsync from "../utils/wrapAsync.js";
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
    res.status(201).json({ teacherAttendance });
});

export const getTeacherAttendance = wrapAsync(async (req, res) => {
    const teacher = await Teacher.findById(req.params.teacherId).populate(
        "teacherAttendance"
    );
    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ teacherAttendance: teacher.teacherAttendance });
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
    res.status(200).json({ teacherAttendance });
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
    res.status(200).json({
        message: "Teacher attendance deleted successfully",
    });
});
