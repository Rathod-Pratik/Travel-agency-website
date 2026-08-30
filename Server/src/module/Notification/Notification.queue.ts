import { Queue } from "bullmq";
import { bellmqConnection } from "@config/redis";

import {
    CreateNotificationJobData,
    ReadNotificationJobData,
    DeleteNotificationJobData
} from "./Notification.types";

export const notificationCreationQueue =
    new Queue<CreateNotificationJobData>(
        "notification-creation",
        {
            connection: bellmqConnection
        }
    );

export const notificationReadQueue =
    new Queue<ReadNotificationJobData>(
        "notification-read",
        {
            connection: bellmqConnection
        }
    );

export const notificationDeleteQueue =
    new Queue<DeleteNotificationJobData>(
        "notification-delete",
        {
            connection: bellmqConnection
        }
    );