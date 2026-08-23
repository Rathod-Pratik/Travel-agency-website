import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const startTime = Date.now();

    // Runs when the response is completed
    res.on("finish", () => {

        const responseTime = Date.now() - startTime;

        logger.info("HTTP Request", {
            metadata: {
                method: req.method,
                endpoint: req.originalUrl,
                statusCode: res.statusCode,
                responseTime: `${responseTime}ms`,
                ip: req.ip,
            },
        });
    });

    next();
};