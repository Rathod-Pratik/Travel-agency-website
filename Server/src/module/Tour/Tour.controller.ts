import { Request, Response } from 'express';
import { TourModel } from './Tour.model';
import { getCache, getCacheVersion, getMultipleUploadedFiles, incrementCacheVersion, setCache, TourCacheKeys, uploadFileToS3 } from '@utils/index';
import { logger } from '@modules/log/logger';

export const GetTours = async (req: Request, res: Response) => {
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

        const version = await getCacheVersion(TourCacheKeys.listVersion());
        const cacheKey = TourCacheKeys.list(version, page, limit);
        const cachedData = await getCache(cacheKey);

        if (cachedData) {

            logger.info("Tours retrieved from cache", {
                metadata: {
                    page,
                    limit,
                    source: "cache"
                }
            });

            return res.status(200).json({
                success: true,
                message: "Tours retrieved successfully",
                data: cachedData,
            });
        }

        const tours = await TourModel.find({ isDeleted: false })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const totalTours = await TourModel.countDocuments();
        const totalPages = Math.ceil(totalTours / Number(limit));

        await setCache(cacheKey, tours, 3600);

        logger.info("Tours retrieved from database", {
            metadata: {
                count: tours.length,
                page,
                limit,
                source: "database"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Tours retrieved successfully",
            data: tours,
            totalPages: totalPages,
            currentPage: Number(page)
        });

    } catch (err) {

        logger.error("Error retrieving tours", {
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
            message: "Error retrieving tours",
            data: err
        });
    }
};

export const GetToursDetails = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const version = await getCacheVersion(TourCacheKeys.detailsVersion(id as string));
        const cacheKey = TourCacheKeys.details(id as string, version);
        const cachedData = await getCache(cacheKey);

        if (cachedData) {

            logger.info("Tour retrieved from cache", {
                metadata: {
                    tourId: id,
                    source: "cache"
                }
            });

            return res.status(200).json({
                success: true,
                message: "Tour retrieved successfully",
                source: "cache",
                deata: cachedData
            })
        }

        const tour = await TourModel.findById(id);

        if (!tour) {

            logger.warn("Tour not found", {
                metadata: {
                    tourId: id
                }
            });

            return res.status(404).json({
                success: false,
                message: "Tour not found"
            });
        }

        await setCache(cacheKey, tour, 3600);

        logger.info("Tour details retrieved from database", {
            metadata: {
                tourId: id,
                source: "database"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Tour retrieved successfully",
            data: tour
        });

    } catch (err) {

        logger.error("Error retrieving tour", {
            metadata: {
                tourId: id,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error retrieving tour",
            data: err
        });
    }
};

export const CreateTour = async (req: Request, res: Response) => {
    const {
        title,
        slug,
        description,
        country,
        city,
        duration,
        price,
        discountPrice,
        currency,
        category,
        included,
        notIncluded,
        itinerary,
        hotel,
        food,
        maxSeats,
        availableSeats,
        rating,
        totalReviews,
        status,
        featured,
        startDate,
        endDate
    } = req.body;

    const files = getMultipleUploadedFiles(req);

    try {

        if (!files.length) {

            logger.warn("Tour creation failed - images missing", {
                metadata: {
                    title
                }
            });

            return res.status(400).json({
                message: "Images are required"
            });
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

        const newTour = {
            title,
            slug,
            description,
            country,
            city,
            duration,
            price,
            discountPrice,
            currency,
            images: uploadedFiles.map((file) => file.url),
            category,
            included,
            notIncluded,
            itinerary,
            hotel,
            food,
            maxSeats,
            availableSeats,
            rating,
            totalReviews,
            status,
            featured,
            startDate,
            endDate
        };

        const tour = await TourModel.create(newTour);

        if (!tour) {

            logger.error("Tour creation failed", {
                metadata: {
                    title,
                    city,
                    country
                }
            });

            return res.status(400).json({
                success: false,
                message: "Error creating tour"
            });
        } else {

            await incrementCacheVersion(
                TourCacheKeys.listVersion()
            );

            logger.info("Tour created successfully", {
                metadata: {
                    tourId: tour._id.toString(),
                    title: tour.title,
                    city,
                    country,
                    price,
                    availableSeats
                }
            });

            return res.status(201).json({
                success: true,
                message: "Tour created successfully",
                data: tour,
            });
        }

    } catch (err) {

        logger.error("Error creating tour", {
            metadata: {
                title,
                city,
                country,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error creating tour",
            data: err,
        });
    }
};

export const UpdateTour = async (req: Request, res: Response) => {
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

        } catch (err) {

            logger.error("Tour image upload failed", {
                metadata: {
                    tourId: id,
                    error: err instanceof Error
                        ? err.message
                        : String(err)
                }
            });

            return res.status(500).json({
                success: false,
                message: "Error uploading images",
                data: err
            });
        }
    }

    const updateData = req.body;

    try {

        const tour = await TourModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!tour) {

            logger.warn("Tour update failed - tour not found", {
                metadata: {
                    tourId: id
                }
            });

            return res.status(404).json({
                success: false,
                message: "Tour not found"
            });
        }

        await incrementCacheVersion(
            TourCacheKeys.listVersion()
        );

        await incrementCacheVersion(
            TourCacheKeys.detailsVersion(id as string)
        );

        logger.info("Tour updated successfully", {
            metadata: {
                tourId: id,
                title: tour.title,
                price: tour.price,
                availableSeats: tour.availableSeats
            }
        });

        return res.status(200).json({
            success: true,
            message: "Tour updated successfully",
            data: tour
        });

    } catch (err) {

        logger.error("Error updating tour", {
            metadata: {
                tourId: id,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error updating tour",
            data: err
        });
    }
};

export const DeleteTour = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {

        const tour = await TourModel.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                DeletedAt: new Date()
            },
            { new: true }
        );

        if (!tour) {

            logger.warn("Tour deletion failed - tour not found", {
                metadata: {
                    tourId: id
                }
            });

            return res.status(404).json({
                success: false,
                message: "Tour not found"
            });
        }

        await incrementCacheVersion(
            TourCacheKeys.detailsVersion(id as string)
        );

        await incrementCacheVersion(
            TourCacheKeys.listVersion()
        );

        logger.info("Tour deleted successfully", {
            metadata: {
                tourId: id,
                title: tour.title
            }
        });

        return res.status(200).json({
            success: true,
            message: "Tour deleted successfully"
        });

    } catch (err) {

        logger.error("Error deleting tour", {
            metadata: {
                tourId: id,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error deleting tour",
            data: err
        });
    }
};