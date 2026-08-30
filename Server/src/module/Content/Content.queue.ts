import { Queue } from "bullmq";

import { bellmqConnection } from "@config/redis";

import {
    CreateContentJobData,
    UpdateContentJobData
} from "./Content.types";


export const ContentQueue = new Queue<
    | CreateContentJobData
    | UpdateContentJobData
>(
    "content",
    {
        connection: bellmqConnection
    }
);