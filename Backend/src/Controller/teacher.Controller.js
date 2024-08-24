import wrapAsync from "../utils/wrapAsync.js";
import { Teacher } from "../Models/teacher.model.js";
import { teacherValidationSchema } from "../Validation/teacher.Validation.js";
import { School } from "../Models/school.model.js";

export const createTeacher = wrapAsync(async (req, res) => {
    const { error } = teacherValidationSchema.validate(req.body);
    const school = await School.findById(req.params.schoolId);
    if (!school) {
        return res.status(400).json({ message: "School not found" });
    }
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    const teacher = await Teacher.create(req.body);
    school.teachers.push(teacher._id);
    await school.save();
    res.status(201).json({ teacher });
});

export const getTeachers = wrapAsync(async (req, res) => {
    const teachers = await Teacher.find();
    res.status(200).json({ teachers });
});

export const getTeacher = wrapAsync(async (req, res) => {
    const teacher = await Teacher.findById(req.params.teacherId);
    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ teacher });
});

export const updateTeacher = wrapAsync(async (req, res) => {
    const teacher = await Teacher.findByIdAndUpdate(
        req.params.teacherId,
        req.body,
        {
            new: true,
        }
    );
    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ teacher });
});

export const deleteTeacher = wrapAsync(async (req, res) => {
    const teacher = await Teacher.findByIdAndDelete(req.params.teacherId);
    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({
        message: "Teacher deleted successfully",
        data: teacher,
    });
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
