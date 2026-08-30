import { Queue } from "bullmq";
import { bellmqConnection } from "@config/redis";
import { InvoiceJobData } from "./Invoice.types";

export const invoiceGenerationQueue =
    new Queue<InvoiceJobData>(
        "invoice-generation",
        {
            connection: bellmqConnection,
        }
    );