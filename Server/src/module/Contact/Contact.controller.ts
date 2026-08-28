import { Request, Response } from "express";
import { ContactModel } from "./Contact.model";

import {
    ContactCacheKeys, getCacheVersion, getCache,
    setCache, incrementCacheVersion
} from "@utils/index";

import { logger } from "@modules/log/logger";
import { ContactCreationQueue } from "./Contact.queue";

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

    const requestId = crypto.randomUUID();

    try {

        const job = await ContactCreationQueue.add(
            "contact-creation",
            {
                userid,
                name,
                email,
                mobile,
                message,
                requestId
            },
            {
                attempts: 5,

                backoff: {
                    type: "exponential",
                    delay: 3000
                },
                removeOnComplete: {
                    age: 3600
                },

                removeOnFail: {
                    age: 86400
                }
            }
        );

        logger.info("Contact creation job added to queue", {
            metadata: {
                jobId: job.id,
                name,
                email,
                userid,
                requestId
            }
        });

        return res.status(202).json({
            success: true,
            message: "Contact creation queued",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (err) {

        logger.error("Error adding contact creation job", {
            metadata: {
                userid,
                email,
                requestId,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Failed to queue contact creation"
        });
    }
};

export const GetContact = async (
    req: Request,
    res: Response
) => {

    try {

        let page = Number(req.query.page) || 1;

        let limit = Number(req.query.limit) || 10;

        if (page < 1) {
            page = 1;
        }

        if (limit < 1) {
            limit = 10;
        }

        if (limit > 100) {
            limit = 100;
        }

        const version = await getCacheVersion(
            ContactCacheKeys.listVersion()
        );

        const cacheKey =
            ContactCacheKeys.list(version, page, limit);

        const cachedContacts =
            await getCache(cacheKey);

        if (cachedContacts) {

            logger.info("Contacts retrieved from Redis", {
                metadata: {
                    page,
                    limit,
                    source: "redis"
                }
            });

            return res.status(200).json({
                success: true,
                message: "Contacts retrieved successfully",
                source: "redis",
                data: cachedContacts
            });
        }

        const contacts = await ContactModel
            .find({ isDeleted: false })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        if (!contacts || contacts.length === 0) {

            logger.warn("No contacts found", {
                metadata: {
                    page,
                    limit
                }
            });

            return res.status(404).json({
                success: false,
                message: "No contacts found"
            });
        }

        await setCache(
            cacheKey,
            contacts,
            300
        );

        logger.info("Contacts retrieved from MongoDB", {
            metadata: {
                count: contacts.length,
                page,
                limit,
                source: "mongodb"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Contacts retrieved successfully",
            source: "mongodb",
            data: contacts
        });

    } catch (err) {

        logger.error("Error retrieving contacts", {
            metadata: {
                page: req.query.page,
                limit: req.query.limit,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

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
            await ContactModel.findByIdAndUpdate(
                id,
                {
                    isDeleted: true,
                    DeletedAt: new Date()
                },
                {
                    new: true
                }
            );

        if (!contact) {

            logger.warn("Contact deletion failed - contact not found", {
                metadata: {
                    contactId: id
                }
            });

            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        await incrementCacheVersion(
            ContactCacheKeys.listVersion()
        );

        logger.info("Contact deleted successfully", {
            metadata: {
                contactId: id,
                userid: contact.userid
            }
        });

        return res.status(200).json({
            success: true,
            message: "Contact deleted successfully"
        });

    } catch (err) {

        logger.error("Error deleting contact", {
            metadata: {
                contactId: id,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error deleting contact",
            data: err
        });
    }
};