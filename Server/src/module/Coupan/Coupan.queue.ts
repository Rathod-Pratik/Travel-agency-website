import { Queue } from "bullmq";

import { bellmqConnection } from "@config/redis";

import {
    CreateCoupanJobData,
    UpdateCoupanJobData,
    DeleteCoupanJobData
} from "./Coupan.types";


export const coupanCreationQueue =
    new Queue<CreateCoupanJobData>(
        "coupan-creation",
        {
            connection: bellmqConnection
        }
    );


export const coupanUpdateQueue =
    new Queue<UpdateCoupanJobData>(
        "coupan-update",
        {
            connection: bellmqConnection
        }
    );


export const coupanDeleteQueue =
    new Queue<DeleteCoupanJobData>(
        "coupan-delete",
        {
            connection: bellmqConnection
        }
    );