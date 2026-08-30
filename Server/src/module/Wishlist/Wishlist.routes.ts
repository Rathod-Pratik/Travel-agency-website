import express from "express";

import {
    AddWishlist,
    GetWishlist,
    RemoveWishlist
} from "./Wishlist.controller";

import {
    AddWishlistSchema,
    RemoveWishlistSchema
} from "./Wishlist.validation";

import {
    verifyUser
} from "@middleware/Auth.middleware";

import {
    Validate
} from "@middleware/Validation.middleware";


const route = express.Router();


route.post(
    "/",
    Validate(AddWishlistSchema),
    verifyUser,
    AddWishlist
);

route.get(
    "/",
    verifyUser,
    GetWishlist
);


// Remove tour from wishlist
route.delete(
    "/:tourId",
    Validate(RemoveWishlistSchema),
    verifyUser,
    RemoveWishlist
);


export default route;