import express from "express";

import {
    CreateCoupan,
    GetCoupans,
    GetCoupan,
    UpdateCoupan,
    DeleteCoupan
} from "./Coupan.controller";

import {
    CreateCoupanSchema,
    UpdateCoupanSchema,
    CoupanIdSchema
} from "./Coupan.validation";

import {
    Validate
} from "@middleware/Validation.middleware";

import {
    verifyAdmin
} from "@middleware/Auth.middleware";


const Route =
    express.Router();


Route.get(
    "/",
    verifyAdmin,
    GetCoupans
);


Route.get(
    "/:id",
    verifyAdmin,
    Validate(CoupanIdSchema),
    GetCoupan
);


Route.post(
    "/",
    verifyAdmin,
    Validate(CreateCoupanSchema),
    CreateCoupan
);


Route.patch(
    "/:id",
    verifyAdmin,
    Validate(CoupanIdSchema),
    Validate(UpdateCoupanSchema),
    UpdateCoupan
);


Route.delete(
    "/:id",
    verifyAdmin,
    Validate(CoupanIdSchema),
    DeleteCoupan
);


export default Route;