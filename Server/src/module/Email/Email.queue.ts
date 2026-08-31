import { Queue } from "bullmq";
import { bellmqConnection } from "@config/redis";
import { SendEmailJobData } from "./Email.types";

export const emailQueue = new Queue<SendEmailJobData>("email", {
    connection: bellmqConnection,
});
