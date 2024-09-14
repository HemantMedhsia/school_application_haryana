import { Class } from "../Models/class.Model.js";
import { Section } from "../Models/section.Model.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { validateSection } from "../Validation/section.Validation.js";

export const createSection = wrapAsync(async (req, res) => {
    const { error } = validateSection(req.body);
    if (error)
        return res
            .status(400)
            .json(new ApiResponse(400, null, error.details[0].message, false));

    const { name, description } = req.body;
    const existingSection = await Section.findOne({ name });
    if (existingSection) {
        return res.status(400).json({ message: "Section already exists" });
    }

    const newSection = new Section({ name, description });
    await newSection.save();
    res.status(201).json(
        new ApiResponse(201, newSection, "Section created", true)
    );
});

// export const createManySections = wrapAsync(async (req, res) => {
//     const { sections } = req.body;
//     if (!Array.isArray(sections) || sections.length === 0) {
//         return res
//             .status(400)
//             .json(new ApiResponse(400, null, "Invalid or empty sections array", false));
//     }

//     const existingSections = await Section.find({
//         name: { $in: sections.map((section) => section.name) },
//     });
//     const existingSectionNames = existingSections.map(
//         (section) => section.name
//     );

//     const newSectionsToCreate = sections.filter(
//         (section) => !existingSectionNames.includes(section.name)
//     );

//     if (newSectionsToCreate.length === 0) {
//         return res.status(400).json({ message: "All sections already exist" });
//     }

//     const newSections = await Section.insertMany(newSectionsToCreate);
//     res.status(201).json(new ApiResponse(201, newSections, "Sections created", true));
// });

export const getAllSections = wrapAsync(async (req, res) => {
    const sections = await Section.find().populate("classIds subjects");
    res.status(200).json(new ApiResponse(200, sections, "All sections", true));
});

export const getSectionById = wrapAsync(async (req, res) => {
    const { sectionId } = req.params;
    const section = await Section.findById(sectionId);

    if (!section) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Section not found", false));
    }
    res.status(200).json(new ApiResponse(200, section, "Section found", true));
});

export const updateSection = wrapAsync(async (req, res) => {
    const { sectionId } = req.params;
    const { error } = validateSection(req.body);
    if (error)
        return res
            .status(400)
            .json(new ApiResponse(400, null, error.details[0].message, false));

    const updates = req.body;
    const updatedSection = await Section.findByIdAndUpdate(sectionId, updates, {
        new: true,
    });
    if (!updatedSection) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Section not found", false));
    }
    res.status(200).json(
        new ApiResponse(200, updatedSection, "Section updated", true)
    );
});

export const deleteSection = wrapAsync(async (req, res) => {
    const { sectionId } = req.params;

    const deletedSection = await Section.findByIdAndDelete(sectionId);
    if (!deletedSection) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Section not found", false));
    }
    res.status(200).json(
        new ApiResponse(200, deletedSection, "Section deleted", true)
    );
});

export const deleteManySections = wrapAsync(async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    "Invalid or empty section ids array",
                    false
                )
            );
    }

    const sections = await Section.deleteMany({ _id: { $in: ids } });
    if (sections.deletedCount === 0) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Sections not found", false));
    }

    res.status(200).json(new ApiResponse(200, null, "Sections deleted", true));
});

export const getSectionsByClass = wrapAsync(async (req, res) => {
    const { classId } = req.params;
    const sections = await Section.find({ classId });
    res.status(200).json(
        new ApiResponse(200, sections, "Sections found", true)
    );
});
