import mongoose from "mongoose";

export interface IHotel {
    images: string[];
    name: string;
    rating: number;
    address: string;
    roomType: string;
    meal: {
        name: string;
        breakfast: boolean;
        lunch: boolean;
        dinner: boolean;
    };
    pricePerPerson: number;
    availableRooms: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}