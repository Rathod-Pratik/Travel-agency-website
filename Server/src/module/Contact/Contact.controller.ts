import { Request, Response } from 'express';
import { ContactModel } from './Contact.model';

export const AddContact = async (req: Request, res: Response) => {
    const { userid, name, email, mobile, message } = req.body;
    try {
        const contact = await ContactModel.create({ userid, name, email, mobile, message });
        if (!contact) {
            return res.status(400).json({ message: "Failed to add contact" });
        } else {

            return res.status(201).json({
                success: true,
                message: "Contact added successfully",
                data: contact,
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error adding contact",
            data: err,
        });
    }
}
export const GetContact = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const contacts = await ContactModel.find()
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        if (!contacts || contacts.length === 0) {
            return res.status(404).json({ message: "No contacts found" });
        }
        return res.status(200).json({
            success: true,
            message: "Contacts retrieved successfully",
            data: contacts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving contacts",
            data: err,
        });
    }
}
export const DeleteContact = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const contact = await ContactModel.findById({ _id: id });
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        await ContactModel.findByIdAndDelete({ _id: id });
        return res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error deleting contact",
            data: err,
        });
    }
}