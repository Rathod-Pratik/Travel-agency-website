import mongoose from "mongoose";

export interface ITour {
  title: string;

  slug: string;

  description: string;

  destination: {
    country: string;
    city: string;
  };

  duration: {
    days: number;
    nights: number;
  };

  price: number;

  discountPrice?: number;

  currency: string;

  image: string[];

  category: mongoose.Schema.Types.ObjectId;

  included: string[];

  notIncluded: string[];

  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
  }[];

  hotel?: {
    name: string;
    address: string;
    rating?: number;
    roomType: string;
  };

  maxSeats: number;

  availableSeats: number;

  rating: number;

  totalReviews: number;

  status: "active" | "inactive" | "completed" | "Cancelled";

  featured: boolean;

  startDate?: Date;

  endDate?: Date;

  createdBy: string;
  isDeleted?: boolean;
  DeletedAt?: Date;
}

export interface CreateTourJobData {
  requestId: string;
  tourData: {
    title: string;

    slug: string;

    description: string;

    destination: {
      country: string;
      city: string;
    };

    duration: {
      days: number;
      nights: number;
    };

    price: number;

    discountPrice?: number;

    currency: string;

    category:mongoose.Schema.Types.ObjectId;
  
    included: string[];

    notIncluded: string[];

    itinerary: {
      day: number;
      title: string;
      description: string;
      activities: string[];
    }[];

    hotel?: {
      name: string;
      address: string;
      rating?: number;
      roomType: string;
    };

    food?: {
      breakfast: boolean;
      lunch: boolean;
      dinner: boolean;
      description?: string;
    };

    maxSeats: number;

    availableSeats: number;

    rating: number;

    totalReviews: number;

    status: "active" | "inactive" | "completed" | "Cancelled";

    featured: boolean;

    startDate?: Date;

    endDate?: Date;
  },
  imagekeys: string[];
}

export interface UpdateTourJobData {
  requestId: string;
  tourData: {
    title: string;

    slug: string;

    description: string;

    destination: {
      country: string;
      city: string;
    };

    duration: {
      days: number;
      nights: number;
    };

    price: number;

    discountPrice?: number;

    currency: string;

    category:mongoose.Schema.Types.ObjectId;

    included: string[];

    notIncluded: string[];

    itinerary: {
      day: number;
      title: string;
      description: string;
      activities: string[];
    }[];

    hotel?: {
      name: string;
      address: string;
      rating?: number;
      roomType: string;
    };

    maxSeats: number;

    availableSeats: number;

    rating: number;

    totalReviews: number;

    status: "active" | "inactive" | "completed" | "Cancelled";

    featured: boolean;

    startDate?: Date;

    endDate?: Date;
  },
  imagekeys?: string[];
  id: string;
}

export interface DeleteTourJobData {
  requestId: string;
  id: string;
}