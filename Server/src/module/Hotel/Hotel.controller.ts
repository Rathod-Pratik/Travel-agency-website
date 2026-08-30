import { Request, Response } from "express";
import { HotelModel } from "./Hotel.model";
import { Get_Signed_Url, getMultipleUploadedFiles, HotelCacheKeys, uploadWithRetry } from "@utils/index";
import { getCache, getCacheVersion, incrementCacheVersion, setCache } from "@utils/index";
import { logger } from "@modules/log/logger";
import { IHotel } from "./Hotel.types";
import { hotelCreationQueue, hotelDeleteQueue, hotelUpdateQueue } from "./hotel.queue";
import { createNotification } from "@modules/Notification/Notification.service";


const GetSignedImages = async (images: string[]) => {
    return Promise.all(
        images.map(async (key) => {
            const url = await Get_Signed_Url({ key });
            return url;
        })
    );
};

export const HotelResponse = async (hotel: IHotel) => {
    return {
        ...hotel,
        image: await GetSignedImages(hotel.image),
    };
};

export const HotelsResponse = async (hotels: IHotel[]) => {
    return Promise.all(
        hotels.map(async (hotel) => ({
            ...hotel,
            image: await GetSignedImages(hotel.image.slice(0, 1)),
        }))
    );
};

export const GetHotels = async (req: Request, res: Response) => {
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
        const version = await getCacheVersion(HotelCacheKeys.listVersion());

        const cacheKey = HotelCacheKeys.list(version, page, limit);

        const cachedHotels = await getCache(cacheKey);
        if (cachedHotels) {
            logger.info("Hotels fetched from Redis", {
                metadata: {
                    page,
                    limit,
                    source: "redis",
                },
            });

            return res.status(200).json(cachedHotels);
        }

        const hotels = await HotelModel.find({ isDeleted: false })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit)).lean();
        if (!hotels || hotels.length === 0) {
            logger.warn("No hotels found", {
                metadata: {
                    page,
                    limit,
                },
            });
            return res.status(404).json({ message: "No hotels found" });
        } else {
            logger.info("Hotels fetched successfully", {
                metadata: {
                    count: hotels.length,
                    page,
                    limit,
                    source: "mongodb",
                },
            });
            HotelsResponse(hotels).then(async (hotels: IHotel[]) => {
                await setCache(cacheKey, hotels, 3600);
                res.status(200).json(hotels);
            })

        }
    } catch (error) {
        logger.error("Error fetching hotels", {
            metadata: {
                error: error instanceof Error
                    ? error.message
                    : String(error),
                page: req.query.page,
                limit: req.query.limit,
            },
        });
        res.status(500).json({ message: "Error fetching hotels" });
    }
};

export const GetHotelDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const version = await getCacheVersion(HotelCacheKeys.detailsVersion(id as string));

        const cacheKey =
            HotelCacheKeys.details(id as string, version);

        const cachedHotel =
            await getCache(cacheKey);

        if (cachedHotel) {
            logger.info("Hotel details fetched from Redis", {
                metadata: {
                    hotelId: id,
                    source: "redis",
                },
            });
            return res.status(200).json({
                success: true,
                source: "redis",
                data: cachedHotel
            });
        }

        const hotel = await HotelModel.findById(id).lean();
        if (!hotel) {
            logger.warn("Hotel not found", {
                metadata: {
                    hotelId: id,
                },
            });
            return res.status(404).json({ message: "Hotel not found" });
        }
        logger.info("Hotel details fetched successfully", {
            metadata: {
                hotelId: id,
                source: "mongodb",
            },
        });
        HotelResponse(hotel).then(async (hotel: IHotel) => {
            await setCache(cacheKey, hotel, 3600);
            res.status(200).json({ data: hotel });
        })

    } catch (error) {
        logger.error("Error fetching hotel details", {
            metadata: {
                hotelId: id,
                error: error instanceof Error
                    ? error.message
                    : String(error),
            },
        });
        res.status(500).json({ message: "Error fetching hotel details" });
    }
};

export const CreateHotel = async (
    req: Request,
    res: Response
) => {
    const {
        name,
        rating,
        address,
        city,
        country,
        description,
        roomType,
        meal,
        pricePerPerson,
        availableRooms,
        isActive,
        amenities
    } = req.body;

    const requestId = crypto.randomUUID();
    const files = getMultipleUploadedFiles(req);

    try {
        if (!files.length) {
            logger.warn("Hotel creation failed - images missing", {
                metadata: {
                    name,
                    requestId
                }
            });

            return res.status(400).json({
                success: false,
                message: "Images are required"
            });
        }

        const uploadedFiles = await Promise.all(
            files.map((file) =>
                uploadWithRetry(file, 3)
            )
        );

        const imagekeys = uploadedFiles.map(
            (file) => file.key
        );

        const hotelData = {
            name,
            rating,
            address,
            city,
            country,
            description,
            roomType,
            meal,
            pricePerPerson,
            availableRooms,
            amenities,
            isActive
        };

        const job = await hotelCreationQueue.add(
            "hotel-creation",
            {
                requestId,
                hotelData,
                imagekeys,
                userId: req.body.id
            },
            {
                attempts: 5,
                backoff: {
                    type: "exponential",
                    delay: 5000
                },
                removeOnComplete: {
                    age: 3600
                },
                removeOnFail: {
                    age: 86400
                }
            }
        );

        logger.info("Hotel creation job added to queue", {
            metadata: {
                name,
                requestId,
                jobId: job.id
            }
        });

        await createNotification({
            userId: req.body.id,
            message: `Your request to create hotel "${name}" is being processed.`,
            type: "info"
        });
        return res.status(202).json({
            success: true,
            message: "Hotel creation is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {
        logger.error("Error creating hotel", {
            metadata: {
                name,
                requestId,
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });
 await createNotification({
            userId: req.body?.id,
            message: `Your request to create hotel "${name}" failed.`,
            type: "error"
        });
        return res.status(500).json({
            success: false,
            message: "Error creating hotel"
        });
    }
};

export const UpdateHotel = async (
    req: Request,
    res: Response
) => {
    const {
        name,
        rating,
        address,
        city,
        country,
        description,
        roomType,
        meal,
        pricePerPerson,
        availableRooms,
        isActive,
        amenities
    } = req.body;

    const { id } = req.params as { id: string };
    const requestId = crypto.randomUUID();

    try {
        const existingHotel =
            await HotelModel.findById(id);

        if (!existingHotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        if (existingHotel.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Hotel is already deleted"
            });
        }

        const files = getMultipleUploadedFiles(req);

        let imagekeys: string[] | undefined;

        if (files.length > 0) {
            const uploadedFiles = await Promise.all(
                files.map((file) =>
                    uploadWithRetry(file, 3)
                )
            );

            imagekeys = uploadedFiles.map(
                (file) => file.key
            );
        }

        const hotelData = {
            name,
            rating,
            address,
            city,
            country,
            description,
            roomType,
            pricePerPerson,
            availableRooms,
            meal,
            isActive,
            amenities
        };

        const job = await hotelUpdateQueue.add(
            "hotel-update",
            {
                requestId,
                hotelData,
                imagekeys,
                id,
                userId: req.body.id
            },
            {
                attempts: 5,
                backoff: {
                    type: "exponential",
                    delay: 5000
                },
                removeOnComplete: {
                    age: 3600
                },
                removeOnFail: {
                    age: 86400
                }
            }
        );

        logger.info("Hotel update job added to queue", {
            metadata: {
                hotelId: id,
                requestId,
                jobId: job.id,
                hasNewImages: Boolean(imagekeys?.length)
            }
        });

        await createNotification({
            userId: req.body.id,
            message: `Your request to update hotel "${existingHotel.name}" is being processed.`,
            type: "info"
        });

        return res.status(202).json({
            success: true,
            message: "Hotel update is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {
        logger.error("Error updating hotel", {
            metadata: {
                hotelId: id,
                requestId,
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });
 await createNotification({
            userId: req.body?.id,
            message: `Your request to update hotel "${name}" failed.`,
            type: "error"
        });
        return res.status(500).json({
            success: false,
            message: "Error updating hotel"
        });
    }
};

export const DeleteHotel = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params as { id: string };
    const requestId = crypto.randomUUID();

    try {
        const existingHotel =
            await HotelModel.findById(id);

        if (!existingHotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        if (existingHotel.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Hotel is already deleted"
            });
        }

        const job = await hotelDeleteQueue.add(
            "hotel-delete",
            {
                requestId,
                id,
                userId: req.body.id
            },
            {
                attempts: 5,
                backoff: {
                    type: "exponential",
                    delay: 5000
                },
                removeOnComplete: {
                    age: 3600
                },
                removeOnFail: {
                    age: 86400
                }
            }
        );

        logger.info("Hotel delete job added to queue", {
            metadata: {
                hotelId: id,
                requestId,
                jobId: job.id
            }
        });

        await createNotification({
            userId: req.body.id,
            message: `Your request to delete hotel "${existingHotel.name}" is being processed.`,
            type: "info"
        });
        return res.status(202).json({
            success: true,
            message: "Hotel deletion is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {
        logger.error("Error deleting hotel", {
            metadata: {
                hotelId: id,
                requestId,
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });
 await createNotification({
            userId: req.body?.id,
            message: `Your request to delete hotel failed.`,
            type: "error"
        });
        return res.status(500).json({
            success: false,
            message: "Error deleting hotel"
        });
    }
};