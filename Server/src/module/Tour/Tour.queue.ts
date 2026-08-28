import { Queue} from "bullmq";
import { bellmqConnection } from "@config/redis";
import { CreateTourJobData, DeleteTourJobData, UpdateTourJobData } from "./Tour.types";

export const tourCreationQueue = new Queue<CreateTourJobData>("tour-creation",{
    connection: bellmqConnection,
})

export const TourUpdateQueue = new Queue<UpdateTourJobData>("tour-update",{
    connection: bellmqConnection,
})
export const TourDeleteQueue = new Queue<DeleteTourJobData>("tour-delete",{
    connection: bellmqConnection,
})