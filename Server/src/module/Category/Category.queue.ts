import { Queue } from "bullmq";
import { bellmqConnection } from "@config/redis";

import {
    CreateCategoryJobData,
    UpdateCategoryJobData,
    DeleteCategoryJobData
} from "./Category.types";

export const categoryCreationQueue =
    new Queue<CreateCategoryJobData>(
        "category-creation",
        {
            connection: bellmqConnection
        }
    );

export const categoryUpdateQueue =
    new Queue<UpdateCategoryJobData>(
        "category-update",
        {
            connection: bellmqConnection
        }
    );

export const categoryDeleteQueue =
    new Queue<DeleteCategoryJobData>(
        "category-delete",
        {
            connection: bellmqConnection
        }
    );