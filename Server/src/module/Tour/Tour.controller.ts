import { Request, Response } from 'express';
import { TourModel } from './Tour.model';
import { Get_Signed_Url, getCache, getCacheVersion, getMultipleUploadedFiles, incrementCacheVersion, setCache, TourCacheKeys, uploadWithRetry } from '@utils/index';
import { logger } from '@modules/log/logger';
import { ITour } from './Tour.types';
import { tourCreationQueue, TourDeleteQueue, TourUpdateQueue } from './Tour.queue';


const GetSignedImages = async (images: string[]) => {
    return Promise.all(
        images.map(async (key) => {
            const url = await Get_Signed_Url({ key });
            return url;
        })
    );
};

export const TourResponse = async (tour: ITour) => {
    return {
        ...tour,
        image: await GetSignedImages(tour.image),
    };
};

export const ToursResponse = async (tours: ITour[]) => {
    return Promise.all(
        tours.map(async (tour) => ({
            ...tour,
            image: await GetSignedImages(tour.image.slice(0, 1)),
        }))
    );
};

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

export const CreateTour = async (
    req: Request,
    res: Response
) => {
    const {
        title,
        slug,
        description,
        country,
        city,
        days,
        nights,
        price,
        discountPrice,
        currency,
        category,
        included,
        notIncluded,
        itinerary,
        hotel,
        maxSeats,
        availableSeats,
        rating,
        totalReviews,
        status,
        featured,
        startDate,
        endDate
    } = req.body;

    const requestId = crypto.randomUUID();
    const files = getMultipleUploadedFiles(req);

    try {
        if (!files.length) {
            logger.warn("Tour creation failed - images missing", {
                metadata: {
                    title,
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

        const tourData = {
            title,
            slug,
            description,
            destination: {
                country,
                city
            },
            duration: {
                days,
                nights
            },
            price,
            discountPrice,
            currency,
            category,
            included,
            notIncluded,
            itinerary,
            hotel,
            maxSeats,
            availableSeats,
            rating,
            totalReviews,
            status,
            featured,
            startDate,
            endDate
        };

        const job = await tourCreationQueue.add(
            "tour-creation",
            {
                tourData,
                requestId,
                imagekeys
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

        logger.info("Tour creation job added to queue", {
            metadata: {
                title,
                requestId,
                jobId: job.id,
                city,
                country
            }
        });

        return res.status(202).json({
            success: true,
            message: "Tour creation has been queued",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (err) {
        logger.error("Error creating tour", {
            metadata: {
                title,
                city,
                country,
                requestId,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Failed to process tour creation"
        });
    }
};

export const UpdateTour = async (
    req: Request,
    res: Response
) => {
    const {
        title,
        slug,
        description,
        country,
        city,
        days,
        nights,
        price,
        discountPrice,
        currency,
        category,
        included,
        notIncluded,
        itinerary,
        hotel,
        maxSeats,
        availableSeats,
        rating,
        totalReviews,
        status,
        featured,
        startDate,
        endDate
    } = req.body;

    const { id } = req.params as { id: string };
    const requestId = crypto.randomUUID();

    try {
        const existingTour = await TourModel.findById(id);

        if (!existingTour) {
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

        const tourData = {
            title,
            slug,
            description,
            destination: {
                country,
                city
            },
            duration: {
                days,
                nights
            },
            price,
            discountPrice,
            currency,
            category,
            included,
            notIncluded,
            itinerary,
            hotel,
            maxSeats,
            availableSeats,
            rating,
            totalReviews,
            status,
            featured,
            startDate,
            endDate
        };

        const job = await TourUpdateQueue.add(
            "tour-update",
            {
                requestId,
                tourData,
                imagekeys,
                id
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

        logger.info("Tour update job added to queue", {
            metadata: {
                tourId: id,
                requestId,
                jobId: job.id,
                hasImages: Boolean(imagekeys?.length)
            }
        });

        return res.status(202).json({
            success: true,
            message: "Tour update is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (err) {
        logger.error("Error updating tour", {
            metadata: {
                tourId: id,
                requestId,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error updating tour"
        });
    }
};

export const DeleteTour = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params as { id: string };
    const requestId = crypto.randomUUID();

    try {
        const existingTour = await TourModel.findById(id);

        if (!existingTour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found"
            });
        }

        if (existingTour.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Tour is already deleted"
            });
        }

        const job = await TourDeleteQueue.add(
            "tour-delete",
            {
                requestId,
                id
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

        logger.info("Tour delete job added to queue", {
            metadata: {
                tourId: id,
                requestId,
                jobId: job.id
            }
        });

        return res.status(202).json({
            success: true,
            message: "Tour deletion is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (err) {
        logger.error("Error deleting tour", {
            metadata: {
                tourId: id,
                requestId,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error deleting tour"
        });
    }
};