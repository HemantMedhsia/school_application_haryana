import { School } from "../Models/school.model.js";
import { Student } from "../Models/student.model.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { studentValidationSchema } from "../Validation/student.Validation.js";

export const createStudent = wrapAsync(async (req, res) => {
    await studentValidationSchema.validateAsync(req.body, { abortEarly: false });
    try {
        const school = await School.findById(req.params.schoolId);
        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found",
            });
        }
        const student = new Student(req.body);
        const studentData = await student.save();
        school.students.push(studentData._id);
        await school.save();

        res.status(201).json({
            success: true,
            data: student,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
})

export const getStudents = wrapAsync(async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({
            success: true,
            data: students,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const getStudent = wrapAsync(async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }
        res.status(200).json({
            success: true,
            data: student,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const updateStudent = wrapAsync(async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }
        res.status(200).json({
            success: true,
            data: student,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const deleteStudent = wrapAsync(async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }
        res.status(200).json({
            success: true,
            data: student,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export const getStudentByParent = wrapAsync(async (req, res) => {
    try {
        const student = await Student.find({ parent: req.params.parentId });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }
        res.status(200).json({
            success: true,
            data: student,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

