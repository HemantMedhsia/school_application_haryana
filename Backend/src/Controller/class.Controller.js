import { Class } from "../Models/class.Model.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { classValidationSchema } from "../Validation/class.Validation.js";

export const createClass = wrapAsync(async (req, res) => {
    const { error } = classValidationSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { name } = req.body;

    const existingClass = await Class.findOne({ name });
    if (existingClass) {
        return res.status(409).json({ message: "Class already exists." });
    }

    const newClass = new Class({ name });
    await newClass.save();
    res.status(201).json(newClass);
});

export const getAllClasses = wrapAsync(async (req, res) => {
    const classes = await Class.find();
    res.status(200).json(classes);
});

export const getClassById = wrapAsync(async (req, res) => {
    const { classId } = req.params;
    const classData = await Class.findById(classId);

    if (!classData) {
        return res.status(404).json({ message: "Class not found." });
    }

    res.status(200).json(classData);
});

export const updateClass = wrapAsync(async (req, res) => {
    const { error } = classValidationSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { classId } = req.params;
    const { name } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
        classId,
        { name },
        { new: true }
    );

    if (!updatedClass) {
        return res.status(404).json({ message: "Class not found." });
    }

    res.status(200).json(updatedClass);
});

export const deleteClass = wrapAsync(async (req, res) => {
    const { classId } = req.params;

    const deletedClass = await Class.findByIdAndDelete(classId);

    if (!deletedClass) {
        return res.status(404).json({ message: "Class not found." });
    }

    res.status(200).json({ message: "Class deleted successfully." });
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
    res.status(201).json(createdClasses);
});
