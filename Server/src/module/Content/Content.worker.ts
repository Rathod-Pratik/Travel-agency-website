import { Worker } from "bullmq";

import { bellmqConnection } from "@config/redis";

import { ContentModel } from "./Content.model";

import {
    CreateContentJobData,
    UpdateContentJobData,
    } from "./Content.types";

import { logger } from "@modules/log/logger";

import {
    incrementCacheVersion,
    ContentCacheKeys
} from "@utils/index";

import { createNotification } from "@modules/Notification/Notification.service";

export const ContentWorker = new Worker<
    | CreateContentJobData
    | UpdateContentJobData
>(
    "content",

    async (job) => {

        if (job.name === "content-create") {

            const {
                title,
                slug,
                type,
                content,
                isActive,
                requestId,
                userId
            } = job.data as CreateContentJobData;


            logger.info(
                "Content Worker: Processing content creation job",
                {
                    metadata: {
                        title,
                        slug,
                        type,
                        requestId
                    }
                }
            );


            // Idempotency check
            const existingContent =
                await ContentModel.findOne({
                    requestId
                });


            if (existingContent) {

                logger.info(
                    "Content Worker: Content with requestId already exists",
                    {
                        metadata: {
                            requestId,
                            contentId: existingContent._id
                        }
                    }
                );


                return {
                    contentId: existingContent._id,
                    alreadyCreated: true
                };
            }


            const contentDocument =
                await ContentModel.create({
                    title,
                    slug,
                    type,
                    content,
                    isActive,
                    requestId
                });


            await incrementCacheVersion(
                ContentCacheKeys.listVersion()
            );

            await createNotification({
                userId: userId,
                message: `Your content "${title}" has been created successfully.`,
                type: "info"
            });
            logger.info(
                "Content Worker: Content created successfully",
                {
                    metadata: {
                        contentId: contentDocument._id,
                        type,
                        requestId
                    }
                }
            );


            return {
                contentId: contentDocument._id,
                alreadyCreated: false
            };
        }

        if (job.name === "content-update") {

            const {
                id,
                title,
                slug,
                type,
                content,
                isActive,
                requestId
            } = job.data as UpdateContentJobData;


            logger.info(
                "Content Worker: Processing content update job",
                {
                    metadata: {
                        contentId: id,
                        requestId
                    }
                }
            );


            const updateData: Record<string, unknown> = {};


            if (title !== undefined) {
                updateData.title = title;
            }

            if (slug !== undefined) {
                updateData.slug = slug;
            }

            if (type !== undefined) {
                updateData.type = type;
            }

            if (content !== undefined) {
                updateData.content = content;
            }

            if (isActive !== undefined) {
                updateData.isActive = isActive;
            }


            const updatedContent =
                await ContentModel.findByIdAndUpdate(
                    id,
                    {
                        $set: updateData
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );


            if (!updatedContent) {

                throw new Error(
                    "Content not found"
                );
            }


            await incrementCacheVersion(
                ContentCacheKeys.listVersion()
            );


            await incrementCacheVersion(
                ContentCacheKeys.detailsVersion(id)
            );

            await createNotification({
                userId: job.data.userId,
                message: `Your content "${title}" has been updated successfully.`,
                type: "info"
            });
            logger.info(
                "Content Worker: Content updated successfully",
                {
                    metadata: {
                        contentId: updatedContent._id,
                        requestId
                    }
                }
            );


            return {
                contentId: updatedContent._id,
                updated: true
            };
        }


        throw new Error(
            `Unknown Content job: ${job.name}`
        );
    },

    {
        connection: bellmqConnection,
        concurrency: 5
    }
);