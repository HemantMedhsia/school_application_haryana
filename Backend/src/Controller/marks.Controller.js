import Marks from "../Models/marks.Model.js";
import { Student } from "../Models/student.model.js";
import { Teacher } from "../Models/teacher.model.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { markValidationSchema } from "../Validation/marks.Validation.js";

export const createMark = wrapAsync(async (req, res) => {
    const student = await Student.findById(req.params.studentId);
    const teacher = await Teacher.findById(req.params.teacherId);
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
    }
    const markData = {
        studentId: student._id.toString(),
        teacherId: teacher._id.toString(),
        ...req.body,
    };
    markData.studentId = markData.studentId.toString();
    await markValidationSchema.validateAsync(markData);
    const mark = await Marks.create(markData);
    student.marks.push(mark._id);
    await student.save();
    res.status(201).json({ mark });
});

export const updateMark = wrapAsync(async (req, res) => {
    const { studentId } = req.params;
    const { subjectMarks: newSubjectMarks } = req.body;

    // Find the marks document by studentId
    const mark = await Marks.findOne({ studentId });
    if (!mark) {
        return res.status(404).json({ message: "Marks not found for the student" });
    }

    // Merge new subjects with existing subjects
    const existingSubjectMarks = mark.subjectMarks;
    const updatedSubjectMarks = [...existingSubjectMarks, ...newSubjectMarks];

    // Update the subjectMarks
    mark.subjectMarks = updatedSubjectMarks;

    // Calculate totalObtainedMarks and grandTotal
    let totalObtainedMarks = 0;
    let grandTotal = 0;
    updatedSubjectMarks.forEach(subject => {
        totalObtainedMarks += subject.marksObtained;
        grandTotal += subject.maxMarks;
    });

    // Calculate percentage
    const percentage = (totalObtainedMarks / grandTotal) * 100;

    // Determine division
    let division;
    if (percentage >= 60) {
        division = "First";
    } else if (percentage >= 50) {
        division = "Second";
    } else if (percentage >= 40) {
        division = "Third";
    } else {
        division = "Fail";
    }

    // Update the calculated fields
    mark.totalObtainedMarks = totalObtainedMarks;
    mark.grandTotal = grandTotal;
    mark.percentage = percentage;
    mark.division = division;

    // Validate the updated mark data
    // await markValidationSchema.validateAsync(mark.toObject());

    // Save the updated mark document
    await mark.save();

    res.status(200).json({ mark });
});