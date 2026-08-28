import {Queue} from "bullmq";
import { bellmqConnection } from "@config/redis";
import { CreateContactJobData} from "./Contact.types";

export const ContactCreationQueue = new Queue<CreateContactJobData>("contact", {
    connection: bellmqConnection,
});