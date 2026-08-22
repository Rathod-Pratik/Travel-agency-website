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

  images: string[];

  category:
    | "Adventure"
    | "Beach"
    | "Family"
    | "Honeymoon"
    | "Luxury"
    | "Pilgrimage"
    | "Wildlife"
    | "Cultural";

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

  status: "draft" | "active" | "inactive" | "completed";

  featured: boolean;

  startDate?: Date;

  endDate?: Date;

  createdBy: string;
}