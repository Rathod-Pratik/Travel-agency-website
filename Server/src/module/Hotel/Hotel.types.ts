import mongoose from "mongoose";

export interface IHotel {
    requestId: string;
    image: string[];
    name: string;
    rating: number;
    address: string;
    roomType: string;
    meal: {
        breakfast: boolean;
        lunch: boolean;
        dinner: boolean;
    };
    pricePerPerson: number;
    availableRooms: number;
    city: string;
    country: string;
    description?: string;
    amenities: string[];
    isActive: "active" | "inactive" | "draft";
    createdAt: Date;
    updatedAt: Date;
    isDeleted?: boolean;
    DeletedAt?: Date;
};

export interface CreateHotelJobData {
    requestId: string;

    hotelData: {
        name: string;
        rating: number;
        address: string;
        city: string;
        country: string;
        description?: string;
        roomType: string;

        meal: {
            breakfast?: boolean;
            lunch?: boolean;
            dinner?: boolean;
        };

        pricePerPerson: number;
        availableRooms: number;
        isActive: string;
        amenities: string[];
    };

    imagekeys: string[];
}

export interface UpdateHotelJobData {
    requestId: string;
    id: string;

    hotelData: {
        name: string;
        rating: number;
        address: string;
        city: string;
        country: string;
        description?: string;
        roomType: string;
        meal: {
            breakfast?: boolean;
            lunch?: boolean;
            dinner?: boolean;
        };
        pricePerPerson: number;
        availableRooms: number;
        isActive: string;
        amenities: string[];
    };

    imagekeys?: string[];
}

export interface DeleteHotelJobData {
    requestId: string;
    id: string;
}