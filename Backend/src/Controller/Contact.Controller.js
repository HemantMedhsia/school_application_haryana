import { Contact } from "../Models/Contact.Model.js";
import { ApiResponse } from "../Utils/responseHandler.js";
import { ApiError } from "../Utils/errorHandler.js";
import wrapAsync from "../Utils/wrapAsync.js";
import { validateContact } from "../Validation/contact.Validation.js";

export const addContact = wrapAsync(async (req, res, next) => {
    const { error } = validateContact(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const contact = new Contact(req.body);

    await contact.save();
    res.status(201).send(
        new ApiResponse("Contact added successfully", contact)
    );
});

export const getContacts = wrapAsync(async (req, res, next) => {
    const contacts = await Contact.find();
    res.status(200).send(
        new ApiResponse("Contacts retrieved successfully", contacts)
    );
});

export const getContact = wrapAsync(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        return next(new ApiError(404, "Contact not found"));
    }
    res.status(200).send(
        new ApiResponse("Contact retrieved successfully", contact)
    );
});

export const updateContact = wrapAsync(async (req, res, next) => {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!contact) {
        return next(new ApiError(404, "Contact not found"));
    }
    res.status(200).send(new ApiResponse("Contact updated successfully", contact));
});

export const deleteContact = wrapAsync(async (req, res, next) => {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
        return next(new ApiError(404, "Contact not found"));
    }
    res.status(200).send( new ApiResponse("Contact deleted successfully", contact));
});
