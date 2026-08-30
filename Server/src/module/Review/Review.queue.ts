import {Queue} from "bullmq";
import { bellmqConnection } from "@config/redis";
import { CreateReviewJobData, UpdateReviewJobData, DeleteReviewJobData } from "./Review.types";

export const reviewCreationQueue = new Queue<CreateReviewJobData>("review-creation", {
    connection: bellmqConnection,
});
export const reviewUpdateQueue = new Queue<UpdateReviewJobData>("review-update", {
    connection: bellmqConnection,
});
export const reviewDeleteQueue = new Queue<DeleteReviewJobData>("review-delete", {
    connection: bellmqConnection,
});