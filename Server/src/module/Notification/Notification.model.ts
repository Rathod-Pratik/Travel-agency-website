import mongoose from "mongoose";
import { INotification } from './Notification.types'

const NotificationSchema = new mongoose.Schema<INotification>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        read: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ["info", "warning", "error", "success"],
            required: true,
        },
        requestId: {
            type: String,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        DeletedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);
NotificationSchema.index({
    userId: 1,
    createdAt: -1
});
export const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);