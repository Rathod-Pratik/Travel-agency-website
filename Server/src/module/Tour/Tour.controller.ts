import { Request, Response } from 'express';
import { TourModel } from './Tour.model';
import { getCache, getCacheVersion, getMultipleUploadedFiles, incrementCacheVersion, setCache, TourCacheKeys, uploadFileToS3 } from '@utils/index';

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
            return res.status(200).json({
                success: true,
                message: "Tours retrieved successfully",
                data: cachedData,
            });
        }
        const tours = await TourModel.find()
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const totalTours = await TourModel.countDocuments();
        const totalPages = Math.ceil(totalTours / Number(limit));

        await setCache(cacheKey, tours, 3600);
        return res.status(200).json({
            success: true,
            message: "Tours retrieved successfully",
            data: tours,
            totalPages: totalPages,
            currentPage: Number(page)
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving tours",
            data: err
        });
    }
}
export const GetToursDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const version = await getCacheVersion(TourCacheKeys.detailsVersion(id as string));
        const cacheKey = TourCacheKeys.details(id as string, version);
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                message: "Tour retrieved successfully",
                source: "cache",
                deata: cachedData
            })
        }
        const tour = await TourModel.findById(id);
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found"
            });
        }

        await setCache(cacheKey, tour, 3600);
        return res.status(200).json({
            success: true,
            message: "Tour retrieved successfully",
            data: tour
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving tour",
            data: err
        });
    }
}
export const CreateTour = async (req: Request, res: Response) => {
    const { title, slug, description, country, city, duration, price, discountPrice, currency, category, included, notIncluded, itinerary, hotel, food, maxSeats, availableSeats, rating, totalReviews, status, featured, startDate, endDate } = req.body;

    const files = getMultipleUploadedFiles(req);
    try {
        if (!files.length) {
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
            return res.status(400).json({
                success: false,
                message: "Error creating tour"
            });
        } else {
            await incrementCacheVersion(TourCacheKeys.listVersion());
            return res.status(201).json({
                success: true,
                message: "Tour created successfully",
                data: tour,
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error creating tour",
            data: err,
        });

    }
}
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
            return res.status(500).json({
                success: false,
                message: "Error uploading images",
                data: err
            });
        }
    }
    const updateData = req.body;
    try {
        const tour = await TourModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found"
            });
        }
        await incrementCacheVersion(TourCacheKeys.listVersion());
        await incrementCacheVersion(TourCacheKeys.detailsVersion(id as string));

        return res.status(200).json({
            success: true,
            message: "Tour updated successfully",
            data: tour
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error updating tour",
            data: err
        });
    }
}
export const DeleteTour = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const tour = await TourModel.findByIdAndDelete(id);
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found"
            });
        }

        await incrementCacheVersion(TourCacheKeys.detailsVersion(id as string));
        await incrementCacheVersion(TourCacheKeys.listVersion());
        return res.status(200).json({
            success: true,
            message: "Tour deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error deleting tour",
            data: err
        });
    }
}