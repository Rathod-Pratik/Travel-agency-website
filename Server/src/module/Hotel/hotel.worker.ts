import { Worker } from "bullmq";
import { bellmqConnection } from "@config/redis";
import { HotelModel } from "./Hotel.model";
import { Delete_S3_File, HotelCacheKeys } from "@utils/index";
import { logger } from "@modules/log/logger";
import { incrementCacheVersion } from "@utils/index";
import { CreateHotelJobData, UpdateHotelJobData } from "./Hotel.types";

export const hotelCreateWorker = new Worker<CreateHotelJobData>(
    "hotel-creation", async (job) => {
        const { requestId, hotelData, imagekeys } = job.data;
        console.log(`Processing hotel creation job for requestId: ${requestId}`);

        logger.info("Hotel Worker: Processing hotel creation job", {
            metadata: { requestId, hotelData, imagekeys }
        })
        const existingHotel = await HotelModel.findOne({ requestId });
        if (existingHotel) {
            console.log(`Hotel with requestId: ${requestId} already exists. Skipping creation.`);
            return;
        }

        const hotel = await HotelModel.create({
            image: imagekeys,
            ...hotelData,
            requestId: requestId
        })
        await incrementCacheVersion(HotelCacheKeys.listVersion());
        console.log(`Hotel created Successfully with requestId: ${requestId}`);
        logger.info("Hotel Worker: Hotel created successfully", {
            metadata: { requestId, hotelId: hotel._id }
        })

        return {
            hotelId: hotel._id,
            alreadyCreated: false
        }

    }, {
    connection: bellmqConnection,
    concurrency: 5
})


export const hotelUpdateWorker =
    new Worker<UpdateHotelJobData>(
        "hotel-update",

        async (job) => {
            const {
                requestId,
                hotelData,
                imagekeys,
                id,
            } = job.data;

            logger.info(
                "Hotel Worker: Processing hotel update job",
                {
                    metadata: {
                        requestId,
                        hotelId: id,
                        hotelData,
                        imagekeys,
                    },
                }
            );

            const existingHotel =
                await HotelModel.findById(id);

            if (!existingHotel) {
                logger.warn(
                    "Hotel update failed - hotel not found",
                    {
                        metadata: {
                            requestId,
                            hotelId: id,
                        },
                    }
                );

                return;
            }

            let removedImageKeys: string[] = [];

            if (imagekeys !== undefined) {
                removedImageKeys =
                    existingHotel.image.filter(
                        (oldKey) =>
                            !imagekeys.includes(oldKey)
                    );
            }

            const updateData = {
                ...hotelData,
                requestId,
                ...(imagekeys !== undefined
                    ? { image: imagekeys }
                    : {}),
            };

            const hotel =
                await HotelModel.findByIdAndUpdate(
                    id,
                    updateData,
                    {
                        new: true,
                        runValidators: true,
                    }
                ).lean();

            if (!hotel) {
                throw new Error(
                    "Hotel update failed"
                );
            }

            await incrementCacheVersion(
                HotelCacheKeys.listVersion()
            );

            await incrementCacheVersion(
                HotelCacheKeys.detailsVersion(id)
            );

            if (removedImageKeys.length > 0) {
                await Promise.all(
                    removedImageKeys.map(
                        (key) =>
                            Delete_S3_File(key)
                    )
                );

                logger.info(
                    "Old hotel images deleted",
                    {
                        metadata: {
                            hotelId: id,
                            deletedImages:
                                removedImageKeys,
                        },
                    }
                );
            }

            logger.info(
                "Hotel Worker: Hotel updated successfully",
                {
                    metadata: {
                        requestId,
                        hotelId: id,
                    },
                }
            );

            return {
                hotelId:hotel._id.toString(),
                updated: true,
            };
        },
        {
            connection: bellmqConnection,
            concurrency: 5,
        }
    );

export const hotelDeleteWorker = new Worker(
    "hotel-delete", async (job) => {
        const { id, requestId } = job.data;
        logger.info("Hotel Worker: Processing hotel delete job", {
            metadata: {
                requestId,
                hotelId: id
            }
        });
        const existingHotel = await HotelModel.findById(id);
        if (!existingHotel) {
            logger.warn("Hotel delete failed - hotel not found", {
                metadata: {
                    requestId,
                    hotelId: id
                }
            })
            return;
        }
        if (existingHotel.isDeleted) {
            logger.warn("Hotel delete failed - hotel already deleted", {
                metadata: {
                    requestId,
                    hotelId: id
                }
            })
            return;
        }
        const hotel = await HotelModel.findByIdAndUpdate({ _id: id }, { isDeleted: true, DeletedAt: new Date() }, { new: true, runValidators: true }).lean();

        if (!hotel) {
            logger.error("Hotel Worker: Hotel delete failed", {
                metadata: {
                    requestId,
                    hotelId: id
                }
            })
            return {
                hotelId: id,
                deleted: false,
            }
        }

        await incrementCacheVersion(HotelCacheKeys.listVersion());
        await incrementCacheVersion(HotelCacheKeys.detailsVersion(id));
        return;
    }
)