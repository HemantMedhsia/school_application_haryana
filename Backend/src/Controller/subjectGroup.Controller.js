import { Class } from "../Models/class.Model.js";
import { Section } from "../Models/section.Model.js";
import { Subject } from "../Models/subject.Model.js";
import { SubjectGroup } from "../Models/subjectGroup.Model.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";

export const addSubjectGroup = wrapAsync(async (req, res) => {
    const { name, description, subjectIds, classId, sectionIds } = req.body;

    if (!name || !subjectIds || !classId || !sectionIds) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const existingSubjectGroup = await SubjectGroup.findOne({ name });
    if (existingSubjectGroup) {
        return res
            .status(409)
            .json({ message: "Subject Group already exists." });
    }

    const [subjectsCount, classCount, sectionsCount] = await Promise.all([
        Subject.countDocuments({ _id: { $in: subjectIds } }),
        Class.countDocuments({ _id: classId }),
        Section.countDocuments({ _id: { $in: sectionIds } }),
    ]);

    if (subjectsCount !== subjectIds.length) {
        return res
            .status(400)
            .json({ message: "One or more subject IDs are invalid." });
    }

    if (classCount === 0) {
        return res.status(400).json({ message: "Invalid class ID provided." });
    }

    if (sectionsCount !== sectionIds.length) {
        return res
            .status(400)
            .json({ message: "One or more section IDs are invalid." });
    }

    const newSubjectGroup = new SubjectGroup({
        name,
        description,
        subjects: subjectIds,
        classes: [classId],
        sections: sectionIds,
    });

    await newSubjectGroup.save();
    await Section.updateMany(
        { _id: { $in: sectionIds } },
        { $addToSet: { subjects: { $each: subjectIds } } }
    );
    await Class.updateOne(
        { _id: classId },
        { $addToSet: { subjectGroups: newSubjectGroup._id } }
    );
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newSubjectGroup,
                "Subject Group added successfully"
            )
        );
});

export const getAllSubjectGroups = wrapAsync(async (req, res) => {
    const subjectGroups = await SubjectGroup.find()
        .populate("subjects")
        .populate("classes")
        .populate("sections");
    return res.status(200).json(new ApiResponse(200, subjectGroups));
});


export const getSubjectGroupById = wrapAsync
(async (req, res) => {
    const subjectGroup = await SubjectGroup.findById(req.params.id)
        .populate("subjects")
        .populate("classes")
        .populate("sections");
    if (!subjectGroup) {
        return res.status(404).json({ message: "Subject Group not found" });
    }
    return res.status(200).json(new ApiResponse(200, subjectGroup));
});



export const updateSubjectGroup = wrapAsync(async (req, res) => {
    const { name, description, subjectIds, classId, sectionIds } = req.body;

    if (!name || !subjectIds || !classId || !sectionIds) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const subjectGroup = await SubjectGroup.findByIdAndUpdate(
        req.params.id,
        {
            name,
            description,
            subjects: subjectIds,
            classes: [classId],
            sections: sectionIds,
        },
        { new: true }
    );

    if (!subjectGroup) {
        return res.status(404).json({ message: "Subject Group not found" });
    }

    await Section.updateMany(
        { _id: { $in: sectionIds } },
        { $addToSet: { subjects: { $each: subjectIds } } }
    );
    await Class.updateOne(
        { _id: classId },
        { $addToSet: { subjectGroups: subjectGroup._id } }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subjectGroup,
                "Subject Group updated successfully"
            )
        );
}); 



export const deleteSubjectGroup = wrapAsync(async (req, res) => {
    const subjectGroup = await SubjectGroup.findByIdAndDelete(req.params.id);
    if (!subjectGroup) {
        return res.status(404).json({ message: "Subject Group not found" });
    }

    await Section.updateMany(
        { _id: { $in: subjectGroup.sections } },
        { $pull: { subjects: { $in: subjectGroup.subjects } } }
    );
    await Class.updateOne(
        { _id: subjectGroup.classes[0] },
        { $pull: { subjectGroups: subjectGroup._id } }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subjectGroup,
                "Subject Group deleted successfully"
            )
        );
}       
);
