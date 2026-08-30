import mongoose from "mongoose";

export type NotificationType =
    | "info"
    | "warning"
    | "error"
    | "success";

    export const NotificationIcons = {
    info: "FiInfo",
    warning: "FiAlertTriangle",
    error: "FiAlertCircle",
    success: "FiCheckCircle"
} as const;

export type NotificationIcon =
    typeof NotificationIcons[NotificationType];

export interface INotification {
    userId: mongoose.Types.ObjectId;
    message: string;
    read: boolean;
    icon?: NotificationIcon;
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
        userId: mongoose.Types.ObjectId;
        message: string;
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