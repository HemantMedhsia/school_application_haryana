import { Section } from "../Models/section.Model.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { validateSection } from "../Validation/section.Validation.js";

export const createSection = wrapAsync(async (req, res) => {
    const { error } = validateSection(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0].message });

    const { name } = req.body;
    const newSection = new Section({ name });
    await newSection.save();
    res.status(201).json({
        message: "Section created successfully",
        section: newSection,
    });
});

export const createManySections = wrapAsync(async (req, res) => {
    const { sections } = req.body;
    if (!Array.isArray(sections) || sections.length === 0) {
        return res.status(400).json({ message: "Invalid or empty sections array" });
    }

    const newSections = await Section.insertMany(sections);
    res.status(201).json({
        message: "Sections created successfully",
        sections: newSections,
    });
});

export const getAllSections = wrapAsync(async (req, res) => {
    const sections = await Section.find();
    res.status(200).json(sections);
});

export const getSectionById = wrapAsync(async (req, res) => {
    const { sectionId } = req.params;
    const section = await Section.findById(sectionId);
    if (!section) {
        return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).json(section);
});

export const updateSection = wrapAsync(async (req, res) => {
    const { sectionId } = req.params;
    const { error } = validateSection(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0].message });

    const updates = req.body;
    const updatedSection = await Section.findByIdAndUpdate(sectionId, updates, {
        new: true,
    });
    if (!updatedSection) {
        return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).json({
        message: "Section updated successfully",
        section: updatedSection,
    });
});

export const deleteSection = wrapAsync(async (req, res) => {
    const { sectionId } = req.params;

    const deletedSection = await Section.findByIdAndDelete(sectionId);
    if (!deletedSection) {
        return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).json({ message: "Section deleted successfully" });
});

export const deleteManySections = wrapAsync(async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Invalid or empty IDs array" });
    }

    const sections = await Section.deleteMany({ _id: { $in: ids } });
    if (sections.deletedCount === 0) {
        return res.status(404).json({ message: "No sections found to delete" });
    }

    res.status(200).json({
        message: "Sections deleted successfully",
        sections,
    });
});


