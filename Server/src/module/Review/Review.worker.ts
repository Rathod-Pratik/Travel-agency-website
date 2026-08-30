import { Worker } from 'bullmq';
import ReviewModel from './Review.model';
import { logger } from '@modules/log/logger';
import { incrementCacheVersion, ReviewCacheKeys } from '@utils/index';
import { bellmqConnection } from '@config/redis';
import { CreateReviewJobData, DeleteReviewJobData, UpdateReviewJobData } from './Review.types';
import { TourModel } from '@modules/Tour/Tour.model';

export const reviewCreateWorker = new Worker<CreateReviewJobData>(
    'review-creation',
    async (job) => {
        const { userId, TourId, rating, reviewText, requestId } = job.data;

        const existingTour = await TourModel.findById(TourId);
        if (!existingTour) {
            logger.warn("Review creation failed: Tour not found", {
                metadata: {
                    userId,
                    TourId,
                    rating,
                    requestId
                }
            });
           return;
        }

        const existingReview = await ReviewModel.findOne({ requestId });
        if (existingReview) {
            logger.warn("Review creation failed: Duplicate requestId", {
                metadata: {
                    userId,
                    TourId,
                    rating,
                    requestId
                }
            });
            return;
        }

        const existingReviewByUserAndTour = await ReviewModel.findOne({ userId, TourId });
        if (existingReviewByUserAndTour) {
            logger.warn("Review creation failed: User has already reviewed this tour", {
                metadata: {
                    userId,
                    TourId,
                    rating,
                    requestId
                }
            });
            return;
        }


        try {
            const review = await ReviewModel.create({
                userId,
                TourId,
                rating,
                reviewText,
                requestId
            });

            if (!review) {
                logger.warn("Review creation failed", {
                    metadata: {
                        userId,
                        TourId,
                        rating,
                        requestId
                    }
                });
                throw new Error("Review creation failed");
            } else {
                await incrementCacheVersion(
                    ReviewCacheKeys.listVersion()
                );

                logger.info("Review added successfully", {
                    metadata: {
                        reviewId: review._id.toString(),
                        userId,
                        TourId,
                        rating,
                        requestId
                    }
                });
            }
        } catch (err) {

            logger.error("Error adding review", {
                metadata: {
                    userId,
                    TourId,
                    rating,
                    requestId,
                    error: err instanceof Error
                        ? err.message
                        : String(err)
                }
            });
            throw err;
        }
    },{
        connection: bellmqConnection,
        concurrency: 5,
    })

export const UpdateReviewWorker = new Worker<UpdateReviewJobData>(
    "review-update", async (job) => {
        const { id, userId, TourId, rating, reviewText, requestId } = job.data;

        const existingReview = await ReviewModel.findById(id);
        if (!existingReview) {
            logger.warn("Review update failed: Review not found", {
                metadata: {
                    id,
                    userId,
                    TourId,
                    rating,
                    requestId
                }
            });
            return;
        }

        if(existingReview.userId.toString() !== userId) {
            logger.warn("Review update failed: User is not the owner of the review", {
                metadata: {
                    id,
                    userId,
                    TourId,
                    rating,
                    requestId
                }
            });
            return;
        }

        const existingTour = await TourModel.findById(TourId);
        if (!existingTour) {
            logger.warn("Review update failed: Tour not found", {
                metadata: {
                    id,
                    userId,
                    TourId,
                    rating,
                    requestId
                }
            });
            return;
        }

        try {
            const updatedReview = await ReviewModel.findByIdAndUpdate(
                id,
                {
                    rating,
                    reviewText,
                    requestId
                },
                {
                    new: true,
                    runValidators: true
                }
            );
            if (!updatedReview) {
                logger.warn("Review update failed", {
                    metadata: {
                        id,
                        userId,
                        TourId,
                        rating,
                        reviewText,
                        requestId
                    }
                });
                throw new Error("Review update failed");
            }
            await incrementCacheVersion(
                ReviewCacheKeys.detailsVersion(id as string)
            );
            logger.info("Review updated successfully", {
                metadata: {
                    reviewId: updatedReview._id.toString(),
                    userId,
                    TourId,
                    rating,
                    reviewText,
                    requestId
                }
            });

        } catch (err) {
            logger.error("Error updating review", {
                metadata: {
                    id,
                    requestId,
                    rating,
                    reviewText,
                    error: err instanceof Error
                        ? err.message
                        : String(err)
                }
            });
            throw err;
        }
    },{
        connection: bellmqConnection,
        concurrency: 5,
    })

export const reviewDeleteWorker = new Worker<DeleteReviewJobData>(
    'review-deletion',
    async (job) => {
        const { id, requestId, userId } = job.data;
        const existingReview = await ReviewModel.findById(id);
        if (!existingReview) {
            logger.warn("Review deletion failed: Review not found", {
                metadata: {
                    id,
                    requestId
                }
            });
          return;
        }
        if(existingReview.userId.toString() !== userId) {
            logger.warn("Review deletion failed: User is not the owner of the review", {
                metadata: {
                    id,
                    userId,
                    requestId
                }
            });
            return;
        }
        try {
           const updatedReview = await ReviewModel.findOneAndUpdate({ _id: id,userId }, { $set: { isDeleted: true, DeletedAt: new Date() } });

           if (!updatedReview) {
                logger.warn("Review deletion failed", {
                    metadata: {
                        id,
                        requestId
                    }
                });
                throw new Error("Review deletion failed");
           }

            await incrementCacheVersion(
                ReviewCacheKeys.detailsVersion(id)
            );
            logger.info("Review deleted successfully", {
                metadata: {
                    reviewId: id,
                    requestId
                }
            });
        } catch (err) {
            logger.error("Error deleting review", {
                metadata: {
                    reviewId: id,
                    requestId,
                    error: err instanceof Error
                        ? err.message
                        : String(err)
                }
            });
            throw err;
        }
    },{
        connection: bellmqConnection,
        concurrency: 5,
    })