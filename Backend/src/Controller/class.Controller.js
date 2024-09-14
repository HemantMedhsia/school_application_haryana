import mongoose from "mongoose";
import { Class } from "../Models/class.Model.js";
import { Section } from "../Models/section.Model.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { classValidationSchema } from "../Validation/class.Validation.js";

// export const createClass = wrapAsync(async (req, res) => {
//     const { error } = classValidationSchema.validate(req.body);

//     if (error) {
//         return res.status(400).json({ message: error.details[0].message });
//     }

//     const { name } = req.body;

//     const existingClass = await Class.findOne({ name });
//     if (existingClass) {
//         return res.status(409).json({ message: "Class already exists." });
//     }

//     const newClass = new Class({ name });
//     await newClass.save();
//     return res
//         .status(201)
//         .json(new ApiResponse(201, newClass, "Class Add Successfully"));
// });

export const createClass = wrapAsync(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { error } = classValidationSchema.validate(req.body);
        if (error) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, error.details[0].message));
        }

        const { name, sections } = req.body;

        const existingClass = await Class.findOne({ name }).session(session);
        if (existingClass) {
            return res
                .status(409)
                .json(new ApiResponse(409, null, "Class already exists."));
        }

        const newClass = new Class({ name });
        await newClass.save({ session });

        const existingSections = await Section.find({
            name: { $in: sections },
        }).session(session);
        const sectionMap = existingSections.reduce((acc, section) => {
            acc[section.name] = section;
            return acc;
        }, {});

        const updatePromises = existingSections.map(async (section) => {
            if (!section.classIds.includes(newClass._id)) {
                section.classIds.push(newClass._id);
                return section.save({ session });
            }
            return null;
        });

        await Promise.all(updatePromises);

        await session.commitTransaction();
        return res
            .status(201)
            .json(new ApiResponse(201, newClass, "Class added successfully"));
    } catch (err) {
        await session.abortTransaction();
        console.error("Error creating class:", err);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Internal server error"));
    } finally {
        session.endSession();
    }
});

export const getAllClasses = wrapAsync(async (req, res) => {
    const classes = await Class.find().populate("subjectGroups");
    return res.status(200).json(new ApiResponse(200, classes));
});

export const getClassById = wrapAsync(async (req, res) => {
    const { classId } = req.params;
    const classData = await Class.findById(classId);

    if (!classData) {
        return res.status(404).json({ message: "Class not found." });
    }
    return res.status(200).json(new ApiResponse(200, classData));
});

// export const updateClass = wrapAsync(async (req, res) => {
//     const { error } = classValidationSchema.validate(req.body);

//     if (error) {
//         return res.status(400).json({ message: error.details[0].message });
//     }

//     const { classId } = req.params;
//     const { name } = req.body;

//     const updatedClass = await Class.findByIdAndUpdate(
//         classId,
//         { name },
//         { new: true }
//     );

//     if (!updatedClass) {
//         return res.status(404).json({ message: "Class not found." });
//     }
//     return res
//         .status(200)
//         .json(new ApiResponse(200, updatedClass, "Class Updated Successfully"));
// });

export const updateClass = wrapAsync(async (req, res) => {
    const { classId } = req.params;
    const { name, sections } = req.body;
    const existingClass = await Class.findOne({ name, _id: { $ne: classId } });
    if (existingClass) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Class name already exists."));
    }

    const updatedClass = await Class.findByIdAndUpdate(
        classId,
        { name },
        { new: true }
    );

    if (!updatedClass) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Class not found."));
    }
    await Section.updateMany(
        { classIds: updatedClass._id, name: { $nin: sections } },
        { $pull: { classIds: updatedClass._id } }
    );

    await Section.updateMany(
        { name: { $in: sections } },
        { $addToSet: { classIds: updatedClass._id } }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedClass, "Class updated successfully.")
        );
});

export const deleteClass = wrapAsync(async (req, res) => {
    const { classId } = req.params;
    const deletedClass = await Class.findByIdAndDelete(classId);

    if (!deletedClass) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Class not found."));
    }

    await Section.updateMany(
        { classIds: deletedClass._id },
        { $pull: { classIds: deletedClass._id } }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, deletedClass, "Class deleted successfully"));
});

export const bulkCreateClasses = wrapAsync(async (req, res) => {
    const classesData = req.body.classes;

    const validationResults = classesData.map((classData) =>
        classValidationSchema.validate(classData)
    );
    const errors = validationResults
        .filter((result) => result.error)
        .map((result) => result.error.details[0].message);

    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation errors", errors });
    }

    const existingClasses = await Class.find({
        name: { $in: classesData.map((c) => c.name) },
    });
    const existingClassNames = existingClasses.map((c) => c.name);

    const newClasses = classesData.filter(
        (c) => !existingClassNames.includes(c.name)
    );

    if (newClasses.length === 0) {
        return res.status(409).json({
            message: "All classes already exist.",
            existingClassNames,
        });
    }

    const createdClasses = await Class.insertMany(newClasses);
    return res
        .status(201)
        .json(
            new ApiResponse(201, createdClasses, "Class Created successfully.")
        );
});

//     const classes = await Class.find();

//     const classesWithSections = await Promise.all(
//         classes.map(async (classItem) => {
//             const sections = await Section.find({ classId: classItem._id });
//             return {
//                 className: classItem.name,
//                 sections: sections.map((section) => section.name),
//             };
//         })
//     );

//     return res
//         .status(200)
//         .json(new ApiResponse(200, classesWithSections, "Success"));
// });

export const getAllClassesWithSections = wrapAsync(async (req, res) => {
    const classes = await Class.find();

    const sections = await Section.find();

    const classSectionMap = {};

    sections.forEach((section) => {
        section.classIds.forEach((classId) => {
            if (!classSectionMap[classId]) {
                classSectionMap[classId] = [];
            }
            classSectionMap[classId].push(section.name);
        });
    });

    const classWithSections = classes.map((classItem) => {
        return {
            id: classItem._id,
            className: classItem.name,
            sections: classSectionMap[classItem._id] || [],
        };
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                classWithSections,
                "Classes with sections retrieved successfully"
            )
        );
});
