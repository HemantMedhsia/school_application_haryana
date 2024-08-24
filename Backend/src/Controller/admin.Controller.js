import { Admin } from "../Models/admin.Model.js";
import { School } from "../Models/school.model.js";
import wrapAsync from "../Utils/wrapAsync.js";
import {adminValidationSchema} from "../Validation/admin.Validation.js";

export const createAdmin = wrapAsync(async (req, res) => {
    const school = await School.findById(req.params.schoolId);
    if (!school) {
        return res.status(404).json({ error: "School not found" });
    }

    // Add schoolId to req.body
    const adminData = { ...req.body, school: req.params.schoolId };
    await adminValidationSchema.validateAsync(adminData, {
        abortEarly: false,
    });

    const admin = new Admin(adminData);
    const savedAdmin = await admin.save();
    school.admin = savedAdmin._id;
    await school.save();
    res.status(201).json(savedAdmin);
});

export const getAdmins = wrapAsync(async (req, res) => {
    const admins = await Admin.find();
    res.status(200).json(admins);
});

export const getAdminById = wrapAsync(async (req, res) => {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json(admin);
});

export const updateAdmin = wrapAsync(async (req, res) => {
    const { id } = req.params;

    const admin = await Admin.findByIdAndUpdate(id, req.body, { new: true });
    if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json(admin);
});

export const deleteAdmin = wrapAsync(async (req, res) => {
    const { id } = req.params;

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json({
        message: "Admin deleted successfully",
        data: admin,
    });
});
