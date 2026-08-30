import { Worker } from "bullmq";
import { bellmqConnection } from "@config/redis";
import { WishlistModel } from "./Wishlist.model";
import {
    AddWishlistJobData,
    RemoveWishlistJobData
} from "./Wishlist.types";
import { logger } from "@modules/log/logger";

export const WishlistWorker = new Worker<
    AddWishlistJobData | RemoveWishlistJobData
>(
    "wishlist",
    async (job) => {

        const {
            userId,
            tourId,
            requestId
        } = job.data;

        try {

            if (job.name === "wishlist-add") {

                const wishlist = await WishlistModel.create(
                    {
                        userId,
                        tourId,
                        requestId
                    }
                );

                logger.info("Wishlist Worker: Tour added to wishlist", {
                    metadata: {
                        wishlistId: wishlist._id,
                        userId,
                        tourId,
                        requestId
                    }
                });

                return {
                    wishlistId: wishlist._id,
                    tourId,
                    alreadyExists: false
                };
            }

            if (job.name === "wishlist-remove") {

                const wishlist = await WishlistModel.findByIdAndDelete(
                    {
                        userId,
                        tourId
                    }
                );

                if (!wishlist) {

                    logger.warn(
                        "Wishlist Worker: Wishlist not found",
                        {
                            metadata: {
                                userId,
                                tourId,
                                requestId
                            }
                        }
                    );

                    return {
                        wishlistId: null,
                        requestId,
                        removed: false
                    };
                }

                logger.info(
                    "Wishlist Worker: Tour removed from wishlist",
                    {
                        metadata: {
                            wishlistId: wishlist._id,
                            userId,
                            tourId,
                            requestId
                        }
                    }
                );

                return {
                    wishlistId: wishlist._id,
                    tourId,
                    requestId,
                    removed: true
                };
            }

        } catch (err) {

            logger.error("Wishlist Worker: Error processing job", {
                metadata: {
                    userId,
                    tourId,
                    requestId,
                    error:
                        err instanceof Error
                            ? err.message
                            : String(err)
                }
            });

            throw err;
        }
    },
    {
        connection: bellmqConnection,
        concurrency: 5
    }
);