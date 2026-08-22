import { Request, Response } from "express";
import { HotelModel } from "./Hotel.model";
import { getMultipleUploadedFiles, uploadFileToS3 } from "@utils/index";

export const GetHotels = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const hotels = await HotelModel.find()
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
            if (!hotels || hotels.length === 0) {
                return res.status(404).json({ message: "No hotels found" });
            }else{
                res.status(200).json(hotels);
            }
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
};
export const GetHotelDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const hotel = await HotelModel.findById(id);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotel details" });
    }
};
export const CreateHotel = async (req: Request, res: Response) => {
    const { name, rating, address, roomType, meal, pricePerPerson, availableRooms, isActive } = req.body;

    const files = getMultipleUploadedFiles(req);
    try {
        if (!files.length) {
            return res.status(400).json({ message: "Images are required" });
        }
        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                return await uploadFileToS3({
                    buffer: file.buffer,
                    fileName: file.originalname,
                    fileType: file.mimetype,
                    folderType: "Blog",
                });
            })
        );
        const hotel = await HotelModel.create({
            images: uploadedFiles.map((file) => file.url),
            name,
            rating,
            address,
            roomType,
            meal,
            pricePerPerson,
            availableRooms,
            isActive
        });
        res.status(201).json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error creating hotel" });
    }
};
export const UpdateHotel = async (req: Request, res: Response) => {
    const { id } = req.params;
    const files = getMultipleUploadedFiles(req);
    if (files.length) {
        try {
            const uploadedFiles = await Promise.all(
                files.map(async (file) => {
                    return await uploadFileToS3({
                        buffer: file.buffer,
                        fileName: file.originalname,
                        fileType: file.mimetype,
                        folderType: "Blog",
                    });
                })
            );
            req.body.images = uploadedFiles.map((file) => file.url);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error uploading images",
                data: err
            });
        }
    }
    const updateData = req.body;
    try {

        const hotel = await HotelModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error updating hotel" });
    }
};
export const DeleteHotel = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const hotel = await HotelModel.findByIdAndDelete(id);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting hotel" });
    }
};