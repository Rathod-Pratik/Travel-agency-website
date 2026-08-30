import { Queue } from "bullmq";
import { bellmqConnection } from "@config/redis";
import {
    AddWishlistJobData,
    RemoveWishlistJobData
} from "./Wishlist.types";

export const WishlistQueue = new Queue<
    AddWishlistJobData | RemoveWishlistJobData
>("wishlist", {
    connection: bellmqConnection,
});