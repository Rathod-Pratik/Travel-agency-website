import express from "express";
import { GetHotels, GetHotelDetails, CreateHotel, UpdateHotel, DeleteHotel } from "./Hotel.controller";
import upload from "@middleware/Multer.middleware";
import { verifyAdmin, verifyUser } from "@middleware/Auth.middleware";
import { Validate } from "@middleware/Validation.middleware";
import { HotelIdSchema, HotelSchema } from "./Hotel.validation";

const Route = express.Router();

Route.get("/hotel?page=:page&limit=:limit",verifyUser, GetHotels);
Route.get("/hotel/:id",verifyUser,Validate(HotelIdSchema), GetHotelDetails);
Route.post("/hotel",verifyAdmin,upload.array("image", 10),Validate(HotelSchema), CreateHotel);
Route.put("/hotel/:id", verifyAdmin,upload.array("image", 10),Validate(HotelIdSchema), UpdateHotel);
Route.delete("/hotel/:id", verifyAdmin, Validate(HotelIdSchema), DeleteHotel);

export default Route;
