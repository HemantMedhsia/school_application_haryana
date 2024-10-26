import wrapAsync from "../Utils/wrapAsync.js";
import { SiblingGroup } from "../Models/SiblingGroup.Model.js";
import { Student } from "../Models/student.model.js";
import { Parent } from "../Models/parents.model.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";

export const addOrCreateSiblingGroup = wrapAsync(async (req, res, next) => {
    const { primaryStudentId, studentIds, parentId } = req.body;

    const primaryStudent = await Student.findById(primaryStudentId);

    if (!primaryStudent) {
        return res
            .status(404)
            .json(new ApiResponse(404, "Primary student not found"));
    }

    let siblingGroup;

    if (primaryStudent.siblingGroupId) {
        siblingGroup = await SiblingGroup.findById(
            primaryStudent.siblingGroupId
        );

        if (!siblingGroup) {
            return res
                .status(404)
                .json(new ApiResponse(404, "Sibling group not found"));
        }
    } else {
        siblingGroup = new SiblingGroup({
            students: [primaryStudentId],
            parentId,
        });
        await siblingGroup.save();

        primaryStudent.siblingGroupId = siblingGroup._id;
        await primaryStudent.save();
    }

    for (const studentId of studentIds) {
        const student = await Student.findById(studentId);

        if (!student) {
            return res
                .status(404)
                .json(
                    new ApiResponse(
                        404,
                        `Student with ID ${studentId} not found`
                    )
                );
        }

        if (
            student.siblingGroupId &&
            student.siblingGroupId.toString() !== siblingGroup._id.toString()
        ) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        `Student with ID ${studentId} already belongs to another sibling group`
                    )
                );
        }

        if (!siblingGroup.students.includes(studentId)) {
            siblingGroup.students.push(studentId);
            await siblingGroup.save();

            student.siblingGroupId = siblingGroup._id;
            await student.save();
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, siblingGroup, "Sibling group updated"));
});

export const removeSiblingFromGroup = wrapAsync(async (req, res, next) => {
    const { siblingGroupId, studentId } = req.body;

    const siblingGroup = await SiblingGroup.findById(siblingGroupId);

    if (!siblingGroup) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Sibling group not found", false));
    }

    // Check if the student exists in the sibling group
    if (!siblingGroup.students.includes(studentId)) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    "Student not found in sibling group",
                    false
                )
            );
    }

    // Remove the student from the sibling group
    siblingGroup.students = siblingGroup.students.filter(
        (id) => id.toString() !== studentId
    );

    await siblingGroup.save();

    // Update the student's siblingGroupId to null
    const student = await Student.findById(studentId);
    if (student) {
        student.siblingGroupId = null;
        await student.save();
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                siblingGroup,
                "Student removed from sibling group successfully!",
                true
            )
        );
});

export const getSiblingGroup = wrapAsync(async (req, res, next) => {
    const { siblingGroupId } = req.params;

    const siblingGroup = await SiblingGroup.findById(siblingGroupId).populate(
        "students",
        "firstName lastName currentClass"
    );

    if (!siblingGroup) {
        return res.status(404).json({ message: "Sibling group not found" });
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                siblingGroup.students,
                "Siblings fetched successfully!"
            )
        );
});
