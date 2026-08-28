import { Worker } from "bullmq"

import { bellmqConnection } from "@config/redis"
import { TourModel } from "./Tour.model"
import { Delete_S3_File, TourCacheKeys } from "@utils/index"
import { logger } from "@modules/log/logger"
import { incrementCacheVersion } from "@utils/index"
import { CreateTourJobData, UpdateTourJobData, DeleteTourJobData } from "./Tour.types"

export const TourCreateWorker = new Worker<CreateTourJobData>(
    "tour-creation", async (job) => {
        const { requestId, tourData, imagekeys } = job.data;
        logger.info("Tour Worker: Proceessing tour creation job", {
            metadata: {
                requestId,
                tourData,
                imagekeys
            }
        })
        const existingTour = await TourModel.findOne({ requestId });

        if (existingTour) {
            logger.info("Tour Worker:Tour with requestId already exists. skipping creation", {
                metadata: {
                    requestId,
                    tourId: existingTour._id
                }
            })
        }
        const hotel = await TourModel.create({
            ...tourData,
            image: imagekeys,
            requestId
        })

        await incrementCacheVersion(TourCacheKeys.listVersion());
        logger.info("Tour Worker:Tour created successfully", {
            metadata: {
                requestId,
                tourId: hotel._id
            }
        })
        console.log(`Tour created Successfully with requestId: ${requestId}`);

        return {
            tourId: hotel._id,
            alreadyCreated: false
        }
    }, {
    connection: bellmqConnection,
    concurrency: 5
}
)

export const TourUpdateWorker = new Worker<UpdateTourJobData>("tour-update", async (job) => {
    const { requestId, tourData, imagekeys, id } = job.data;

    console.log(`Processing tour update job for requestId: ${requestId} and tourId: ${id}`);
    logger.info("Tour Worker: Processing tour update job", {
        metadata: {
            requestId,
            tourId: id,
            tourData,
            imagekeys,
        }
    });

    const existingTour = await TourModel.findOne({ requestId });

    if (!existingTour) {
        logger.warn("Tour update failed - Tour not found", {
            metadata: {
                requestId,
                tourId: id
            }
        });
        throw new Error("Tour not found");
    }

    let removeImageKeys: string[] = [];

    if (imagekeys !== undefined) {
        removeImageKeys = existingTour.image.filter((key) => !imagekeys.includes(key));
    }
    const updateTour = {
        ...tourData,
        requestId,
        ...(imagekeys !== undefined ? { image: imagekeys } : {}),
    };

    const tour = await TourModel.findByIdAndUpdate(id, {
        updateTour
    }, {
        new: true,
        runValidators: true
    })

    if (!tour) {
        throw new Error("Tour not found");
    }
    await incrementCacheVersion(TourCacheKeys.listVersion());
    await incrementCacheVersion(TourCacheKeys.detailsVersion(id));

    if (removeImageKeys.length > 0) {
        await Promise.all(removeImageKeys.map((key) => Delete_S3_File(key)));
        logger.info("old images deleted from S3", {
            metadata: {
                tourId: id,
                deletedImages: removeImageKeys
            }
        });
    }
    console.log(`Tour updated Successfully with requestId: ${requestId} and tourId: ${id}`);
    logger.info("Tour Worker: Tour updated successfully", {
        metadata: {
            requestId,
            tourId: id,

        }
    })
    return {
        tourId: id,
        alreadyUpdated: false
    }
}, {
    connection: bellmqConnection,
    concurrency: 5
});

export const TourDeleteWorker = new Worker<DeleteTourJobData>("tour-delete", async (job) => {
    const { requestId, id } = job.data;
    console.log(`Processing tour delete job for requestId: ${requestId} and tourId: ${id}`);
    logger.info("Tour Worker: Processing tour delete job", {
        metadata: {
            requestId,
            tourId: id
        }
    });
    const existingTour = await TourModel.findOne({ requestId });
    if (!existingTour) {
        logger.warn("Tour delete failed - Tour not found", {
            metadata: {
                requestId,
                tourId: id
            }
        });
        throw new Error("Tour not found");
    }
    if (existingTour.isDeleted){
        logger.warn("Tour delete failed - Tour already deleted", {
            metadata: {
                requestId,
                tourId: id
            }
        });
        throw new Error("Tour already deleted");
    }

    const tour = await TourModel.findByIdAndUpdate({_id:id}, {isDeleted:true, DeletedAt:new Date()},{new:true, runValidators:true}).lean();
    if (!tour) {
        logger.error("Tour Worker: Tour delete failed",{
            metadata: {
                requestId,
                tourId: id
            }
        })
        throw new Error("Tour not found");
    }
    await incrementCacheVersion(TourCacheKeys.listVersion());
    await incrementCacheVersion(TourCacheKeys.detailsVersion(id));

    return {
        tourId: id,
        alreadyDeleted: false
    }
});

