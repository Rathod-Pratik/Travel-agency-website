export const createCacheKeys = (module: string) => {

    return {

        listVersion: () =>
            `${module}:list:version`,

        list: (
            version: number,
            page: number,
            limit: number,
            id?: string
        ) =>
            `${module}:list:${version}:${id || 'all'}:page:${page}:limit:${limit}`,

        detailsVersion: (
            id: string
        ) =>
            `${module}:details:version:${id}`,

        details: (
            id: string,
            version: number
        ) =>
            `${module}:details:${version}:${id}`,
    };
};


export const BlogCacheKeys =
    createCacheKeys("blog");

// Tour module
export const TourCacheKeys =
    createCacheKeys("tour");

// Auth module
export const AuthCacheKeys =
    createCacheKeys("auth");

// Contact module
export const ContactCacheKeys =
    createCacheKeys("contact");

// Hotel module
export const HotelCacheKeys =
    createCacheKeys("hotel");

// Review module
export const ReviewCacheKeys =
    createCacheKeys("review");

// Booking module
export const AdminBookingCacheKeys =
    createCacheKeys("booking");
    
export const UserBookingCacheKeys =
    createCacheKeys("user-booking");

// Otp module
export const OtpCacheKeys =
    createCacheKeys("otp");

// User Category module    
export const CategoryCacheKeys =
    createCacheKeys("category");

// Wishlist module    
export const WishlistCacheKeys =
    createCacheKeys("wishlist");

// Content module
export const ContentCacheKeys =
    createCacheKeys("content");