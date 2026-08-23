import mongoose, { Document, Schema } from "mongoose";

export interface ILog extends Document {
    level: "info" | "warn" | "error";
    message: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}

const LogSchema = new Schema<ILog>(
    {
        level: {
            type: String,
            enum: ["info", "warn", "error"],
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        // Extra information about the log
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// Automatically remove logs older than 30 days
LogSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 30 }
);

export const LogModel = mongoose.model<ILog>("Log", LogSchema);