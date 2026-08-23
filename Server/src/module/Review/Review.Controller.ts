import {Request,Response} from 'express';
import ReviewModel from './Review.model';
import { getCache, getCacheVersion, incrementCacheVersion, ReviewCacheKeys, setCache } from '@utils/index';

export const AddReview = async (req: Request, res: Response) => {
    const { userId, TourId, rating, reviewText } = req.body;
    try {
        const version = await getCacheVersion(ReviewCacheKeys.listVersion());
        const review = await ReviewModel.create({ userId, TourId, rating, reviewText });
        if (!review) {
            return res.status(400).json({ message: "Failed to add review" });
        } else {

            await incrementCacheVersion(ReviewCacheKeys.listVersion());
            return res.status(201).json({
                success: true,
                message: "Review added successfully",
                data: review,
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error adding review",
            data: err,
        });
    }
}
export const GetReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        let page = parseInt(req.query.page as string) || 1;
        let limit = parseInt(req.query.limit as string) || 10;
        if (page < 1) {
            page = 1;
        }
        if (limit < 1) {
            limit = 10;
        }
        if (limit > 100) {
            limit = 100;
        }
        const version = await getCacheVersion(ReviewCacheKeys.detailsVersion(id as string));

        const cacheKey =
            ReviewCacheKeys.details(id as string, version);
        const cachedReview =
            await getCache(cacheKey);
        if (cachedReview) {
            return res.status(200).json({
                success: true,
                data: cachedReview
            });
        }
        const review = await ReviewModel.findById(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        await setCache(cacheKey, review, 1800); // Cache for 30 minutes
        return res.status(200).json({
            success: true,
            message: "Review retrieved successfully",
            data: review,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving review",
            data: err,
        });
    }
}
export const EditReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, TourId, rating, reviewText } = req.body;
    try {
        const review = await ReviewModel.findByIdAndUpdate(
            id,
            { userId, TourId, rating, reviewText },
            { new: true }
        );
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        await incrementCacheVersion(ReviewCacheKeys.detailsVersion(id as string));
        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error updating review",
            data: err,
        });
    }
}
export const DeleteReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const review = await ReviewModel.findByIdAndDelete(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        await incrementCacheVersion(ReviewCacheKeys.detailsVersion(id as string));
        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: review,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error deleting review",
            data: err,
        });
    }
}