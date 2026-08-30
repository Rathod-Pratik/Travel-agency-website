import express from "express";

import {
    GetNotifications,
    GetNotificationDetails,
    MarkNotificationRead,
    DeleteNotification
} from "./Notification.controller";

import {
    verifyAdmin,
    verifyUser
} from "@middleware/Auth.middleware";

import {
    Validate
} from "@middleware/Validation.middleware";

import {
    NotificationSchema,
    NotificationIdSchema
} from "./Notification.validation";

const Route = express.Router();

Route.get(
    "/",
    verifyUser,
    GetNotifications
);

Route.get(
    "/:id",
    verifyUser,
    Validate(NotificationIdSchema),
    GetNotificationDetails
);

Route.patch(
    "/:id/read",
    verifyUser,
    Validate(NotificationIdSchema),
    MarkNotificationRead
);

Route.delete(
    "/:id",
    verifyUser,
    Validate(NotificationIdSchema),
    DeleteNotification
);

export default Route;