import { Request, Response } from 'express';
import { TourModel } from './Tour.model';
import { getMultipleUploadedFiles, uploadFileToS3 } from '@utils/index';

export const GetTours = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const tours = await TourModel.find()
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const totalTours = await TourModel.countDocuments();
        const totalPages = Math.ceil(totalTours / Number(limit));
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
        const tour = await TourModel.findById(id);
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found"
            });
        }
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