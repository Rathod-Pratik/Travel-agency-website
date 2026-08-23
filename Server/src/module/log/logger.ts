import winston from "winston";
import MongoTransport from "./MongoTransport";

export const logger = winston.createLogger({

    // info, warn and error will be logged
    level: "info",

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),

    transports: [

        // Show logs in Render console
        new winston.transports.Console(),

        // Store logs in MongoDB
        new MongoTransport(),
    ],
});