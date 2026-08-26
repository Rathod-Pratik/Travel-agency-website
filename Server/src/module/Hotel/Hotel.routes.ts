import express from "express";
import { GetHotels, GetHotelDetails, CreateHotel, UpdateHotel, DeleteHotel } from "./Hotel.controller";
import { uploadImages } from "@middleware/Multer.middleware";
import { verifyAdmin, verifyUser } from "@middleware/Auth.middleware";
import { Validate } from "@middleware/Validation.middleware";
import { HotelIdSchema, HotelSchema } from "./Hotel.validation";

const Route = express.Router();

Route.get("/",verifyUser, GetHotels);
Route.get("/:id",verifyUser,Validate(HotelIdSchema), GetHotelDetails);
Route.post("/",verifyAdmin,uploadImages,Validate(HotelSchema), CreateHotel);
Route.put("/:id", verifyAdmin,uploadImages,Validate(HotelIdSchema), UpdateHotel);
Route.delete("/:id", verifyAdmin, Validate(HotelIdSchema), DeleteHotel);

export default Route;
