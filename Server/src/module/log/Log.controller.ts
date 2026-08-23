import { Request, Response } from "express";
import { LogModel } from "./Log.model";

export const getLogs = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            page = 1,
            limit = 20,
            level,
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        // Build filter
        const filter: Record<string, unknown> = {};

        if (
            level === "info" ||
            level === "warn" ||
            level === "error"
        ) {
            filter.level = level;
        }

        // Get logs
        const logs = await LogModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Count total logs
        const totalLogs = await LogModel.countDocuments(filter);

        return res.status(200).json({
            success: true,

            data: logs,

            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total: totalLogs,
                totalPages: Math.ceil(
                    totalLogs / limitNumber
                ),
            },
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch logs",
        });
    }
};