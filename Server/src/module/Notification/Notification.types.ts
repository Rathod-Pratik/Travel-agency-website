import mongoose from "mongoose";

export type NotificationType =
    | "info"
    | "warning"
    | "error"
    | "success";

export interface INotification {
    userId: mongoose.Schema.Types.ObjectId;
    message: string;
    read: boolean;
    icon: string;
    type: NotificationType;
    requestId: string;
    isDeleted?: boolean;
    DeletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateNotificationJobData {
    requestId: string;
    notificationData: {
        userId: mongoose.Schema.Types.ObjectId;
        message: string;
        icon: string;
        type: NotificationType;
    };
}

export interface ReadNotificationJobData {
    requestId: string;
    id: string;
}

export interface DeleteNotificationJobData {
    requestId: string;
    id: string;
}