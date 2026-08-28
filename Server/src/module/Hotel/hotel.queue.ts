import { Queue } from "bullmq";
import { bellmqConnection } from "@config/redis";
import { CreateHotelJobData, DeleteHotelJobData, UpdateHotelJobData } from "./Hotel.types";

export const hotelCreationQueue = new Queue<CreateHotelJobData>("hotel-creation", {
  connection: bellmqConnection,
});

export const hotelUpdateQueue =
  new Queue<UpdateHotelJobData>(
    "hotel-update",
    {
      connection: bellmqConnection,
    }
  );

  export const hotelDeleteQueue =
  new Queue<DeleteHotelJobData>(
    "hotel-delete",
    {
      connection: bellmqConnection,
    }
  );