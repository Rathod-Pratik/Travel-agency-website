import { Queue } from "bullmq";
import { bellmqConnection } from "@config/redis";

import {
    CreateBlogJobData,
    UpdateBlogJobData,
    DeleteBlogJobData
} from "./Blog.types";

export const blogCreationQueue =
    new Queue<CreateBlogJobData>(
        "blog-creation",
        {
            connection: bellmqConnection
        }
    );

export const blogUpdateQueue =
    new Queue<UpdateBlogJobData>(
        "blog-update",
        {
            connection: bellmqConnection
        }
    );

export const blogDeleteQueue =
    new Queue<DeleteBlogJobData>(
        "blog-delete",
        {
            connection: bellmqConnection
        }
    );