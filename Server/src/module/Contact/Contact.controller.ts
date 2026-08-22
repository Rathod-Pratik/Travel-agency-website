import { Request, Response } from "express";
import { ContactModel } from "./Contact.model";

import {
    getCache,
    setCache,
    getCacheVersion,
    incrementCacheVersion
} from "@utils/cache";

export const AddContact = async (
    req: Request,
    res: Response
) => {

    const {
        userid,
        name,
        email,
        mobile,
        message
    } = req.body;

    try {

        // Create contact in MongoDB
        const contact = await ContactModel.create({
            userid,
            name,
            email,
            mobile,
            message
        });

        if (!contact) {

            return res.status(400).json({
                success: false,
                message: "Failed to add contact"
            });
        }

        await incrementCacheVersion("contact");


        return res.status(201).json({
            success: true,
            message: "Contact added successfully",
            data: contact
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Error adding contact",
            data: err
        });
    }
};

export const GetContact = async (
    req: Request,
    res: Response
) => {

    try {

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const version = await getCacheVersion(
            "contact"
        );

        const cacheKey =
            `contact:list:v${version}:page:${page}:limit:${limit}`;

        const cachedContacts =
            await getCache(cacheKey);


        if (cachedContacts) {

            return res.status(200).json({
                success: true,
                message: "Contacts retrieved successfully",
                source: "redis",
                data: cachedContacts
            });
        }

        const contacts = await ContactModel
            .find()
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();


        if (!contacts || contacts.length === 0) {

            return res.status(404).json({
                success: false,
                message: "No contacts found"
            });
        }

        await setCache(
            cacheKey,
            contacts,
            300 // 5 minutes
        );


        return res.status(200).json({
            success: true,
            message: "Contacts retrieved successfully",
            source: "mongodb",
            data: contacts
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Error retrieving contacts",
            data: err
        });
    }
};

export const DeleteContact = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params;

    try {

        const contact =
            await ContactModel.findByIdAndDelete(id);


        if (!contact) {

            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        await incrementCacheVersion(
            "contact"
        );


        return res.status(200).json({
            success: true,
            message: "Contact deleted successfully"
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Error deleting contact",
            data: err
        });
    }
};