import { Request, Response } from "express";
import { HotelModel } from "./Hotel.model";
import { getMultipleUploadedFiles, HotelCacheKeys, uploadFileToS3 } from "@utils/index";
import { getCache, getCacheVersion, incrementCacheVersion, setCache } from "@utils/index";
import { logger } from "@modules/log/logger";

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
            await setCache(cacheKey, hotels, 1800);
            res.status(200).json(hotels);
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
        await setCache(cacheKey, hotel, 1800);
        res.status(200).json(hotel);
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

export const CreateHotel = async (req: Request, res: Response) => {
    const { name, rating, address, roomType, meal, pricePerPerson, availableRooms, isActive } = req.body;

    const files = getMultipleUploadedFiles(req);
    try {
        if (!files.length) {
            logger.warn("Hotel creation failed - images missing", {
                metadata: {
                    name,
                },
            });

            return res.status(400).json({ message: "Images are required" });
        }
        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                return await uploadFileToS3({
                    buffer: file.buffer,
                    fileName: file.originalname,
                    fileType: file.mimetype,
                    folderType: "Blog",
                });
            })
        );
        const hotel = await HotelModel.create({
            images: uploadedFiles.map((file) => file.url),
            name,
            rating,
            address,
            roomType,
            meal,
            pricePerPerson,
            availableRooms,
            isActive
        });
        if (!hotel) {
            logger.error("Hotel creation failed", {
                metadata: {
                    name,
                },
            });
            return res.status(400).json({ message: "Error creating hotel" });
        } else {

            await incrementCacheVersion(HotelCacheKeys.listVersion());
            logger.info("Hotel created successfully", {
                metadata: {
                    hotelId: hotel._id.toString(),
                    name: hotel.name,
                    imagesCount: uploadedFiles.length,
                },
            });
            res.status(201).json(hotel);
        }
    } catch (error) {
        res.status(500).json({ message: "Error creating hotel" });
    }
};

export const UpdateHotel = async (req: Request, res: Response) => {
    const { id } = req.params;
    const files = getMultipleUploadedFiles(req);
    if (files.length) {
        try {
            const uploadedFiles = await Promise.all(
                files.map(async (file) => {
                    return await uploadFileToS3({
                        buffer: file.buffer,
                        fileName: file.originalname,
                        fileType: file.mimetype,
                        folderType: "Blog",
                    });
                })
            );
            req.body.images = uploadedFiles.map((file) => file.url);
        } catch (error) {
            logger.error("Hotel image upload failed", {
                metadata: {
                    hotelId: id,
                    error: error instanceof Error
                        ? error.message
                        : String(error),
                },
            });


            return res.status(500).json({
                success: false,
                message: "Error uploading images",
                data: error
            });
        }
    }
    const updateData = req.body;
    try {

        const hotel = await HotelModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
        if (!hotel) {
            logger.warn("Hotel update failed - hotel not found", {
                metadata: {
                    hotelId: id,
                },
            });
            return res.status(404).json({ message: "Hotel not found" });
        }
        await incrementCacheVersion(HotelCacheKeys.listVersion());
        await incrementCacheVersion(HotelCacheKeys.detailsVersion(id as string));
        res.status(200).json(hotel);
    } catch (error) {
        logger.error("Error updating hotel", {
            metadata: {
                hotelId: id,
                error: error instanceof Error
                    ? error.message
                    : String(error),
            },
        });
        res.status(500).json({ message: "Error updating hotel" });
    }
};

export const DeleteHotel = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const hotel = await HotelModel.findByIdAndUpdate(id, { isDeleted: true, DeletedAt: new Date() }, { new: true });
        if (!hotel) {
            logger.warn("Hotel deletion failed - hotel not found", {
                metadata: {
                    hotelId: id,
                },
            });
            return res.status(404).json({ message: "Hotel not found" });
        }
        await incrementCacheVersion(HotelCacheKeys.listVersion());
        await incrementCacheVersion(HotelCacheKeys.detailsVersion(id as string));
        logger.info("Hotel deleted successfully", {
            metadata: {
                hotelId: id,
            },
        });
        res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
        logger.error("Error deleting hotel", {
            metadata: {
                hotelId: id,
                error: error instanceof Error
                    ? error.message
                    : String(error),
            },
        });
        res.status(500).json({ message: "Error deleting hotel" });
    }
};