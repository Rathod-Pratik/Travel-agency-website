import { Queue } from "bullmq";

import { bellmqConnection } from "@config/redis";

import {
    CreateContentJobData,
    UpdateContentJobData,
    DeleteContentJobData
} from "./Content.types";


export const ContentQueue = new Queue<
    | CreateContentJobData
    | UpdateContentJobData
    | DeleteContentJobData
>(
    "content",
    {
        connection: bellmqConnection
    }
);