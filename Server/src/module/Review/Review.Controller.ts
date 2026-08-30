import { Request, Response } from 'express';
import ReviewModel from './Review.model';
import { getCache, getCacheVersion, incrementCacheVersion, ReviewCacheKeys, setCache } from '@utils/index';
import { logger } from '@modules/log/logger';
import { reviewCreationQueue, reviewDeleteQueue, reviewUpdateQueue } from './Review.queue';

export const AddReview = async (req: Request, res: Response) => {
    const { userId, TourId, rating, reviewText } = req.body;
const requestId =crypto.randomUUID();

    try {
const job = await reviewCreationQueue.add(
            'review-creation',
            {
                userId,
                TourId,
                rating,
                reviewText,
                requestId
            },
            {
                attempts: 5,
                backoff: {
                    type: 'exponential',
                    delay: 3000
            },
                removeOnComplete: {
                    age: 3600
                },
                removeOnFail: {
                    age: 86400
                }
            }
        )
        logger.info('Review creation job added to queue', {
            metadata: {
                jobId: job.id,
                userId,
                TourId,
                rating,
                requestId
            }
        });

        return res.status(202).json({
            success: true,
            message: 'Review creation job added to queue',
            data: {
                jobId: job.id,
                requestId
            }
        })

    } catch (err) {

        logger.error("Error adding review", {
            metadata: {
                userId,
                TourId,
                rating,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error adding review",
            data: err,
        });
    }
};

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

        const version = await getCacheVersion(
            ReviewCacheKeys.detailsVersion(id as string)
        );

        const cacheKey =
            ReviewCacheKeys.details(id as string, version);

        const cachedReview =
            await getCache(cacheKey);

        if (cachedReview) {

            logger.info("Review retrieved from cache", {
                metadata: {
                    reviewId: id,
                    source: "cache"
                }
            });

            return res.status(200).json({
                success: true,
                data: cachedReview
            });
        }

        const review = await ReviewModel.findById(id);

        if (!review) {

            logger.warn("Review not found", {
                metadata: {
                    reviewId: id
                }
            });

            return res.status(404).json({
                message: "Review not found"
            });
        }

        await setCache(
            cacheKey,
            review,
            1800
        );

        logger.info("Review retrieved from database", {
            metadata: {
                reviewId: id,
                source: "database"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Review retrieved successfully",
            data: review,
        });

    } catch (err) {

        logger.error("Error retrieving review", {
            metadata: {
                reviewId: id,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error retrieving review",
            data: err,
        });
    }
};

export const EditReview = async (req: Request, res: Response) => {

    const { id } = req.params as { id: string };
    const { userId, TourId, rating, reviewText } = req.body;
const requestId =crypto.randomUUID();
    try {

       const job = await reviewUpdateQueue.add(
            'review-update',
            {
                id,
                userId,
                TourId,
                reviewText,
                rating,
                requestId
            },{
                attempts: 5,
                backoff: {
                    type: 'exponential',
                    delay: 3000
                },
                removeOnComplete: {
                    age: 3600
                },
                removeOnFail: {
                    age: 86400
                }
            })
        logger.info("Review update job added to queue", {
            metadata: {
                requestId,
                reviewId: id,
                userId,
                TourId,
                rating
            }
        });

        return res.status(202).json({
            success: true,
            message: "Review update job added to queue",
            data: job,
        });

    } catch (err) {

        logger.error("Error updating review", {
            metadata: {
                reviewId: id,
                userId,
                TourId,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error updating review",
            data: err,
        });
    }
};

export const DeleteReview = async (req: Request, res: Response) => {

    const { id } = req.params as { id: string };
    const { userId } = req.body;
    const requestId = crypto.randomUUID();

    try {

        const job = await reviewDeleteQueue.add(
            'review-delete',
            {
                id,
                requestId,
                userId
            },{
                attempts: 5,
                backoff: {
                    type: 'exponential',
                    delay: 3000
                },
                removeOnComplete: {
                    age: 3600
                },
                removeOnFail: {
                    age: 86400
                }
            })

        logger.info("Review delete job added to queue", {
            metadata: {
                requestId,
                reviewId: id
            }
        });

        return res.status(202).json({
            success: true,
            message: "Review delete job added to queue",
            data: job,
        });

    } catch (err) {

        logger.error("Error deleting review", {
            metadata: {
                reviewId: id,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error deleting review",
            data: err,
        });
    }
};