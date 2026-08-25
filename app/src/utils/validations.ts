import * as Yup from "yup";

// Tour validation schema
export const tourValidationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Tour title is required"),
  slug: Yup.string().optional(),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  category: Yup.string().required("Category is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  days: Yup.number()
    .min(1, "Must be at least 1 day")
    .required("Days count is required"),
  nights: Yup.number()
    .min(0, "Cannot be negative")
    .required("Nights count is required"),
  price: Yup.number()
    .min(1, "Price must be greater than 0")
    .required("Standard price is required"),
  discountPrice: Yup.number()
    .min(0, "Discount cannot be negative")
    .optional(),
  maxSeats: Yup.number()
    .min(1, "Must have at least 1 seat")
    .required("Max seats is required"),
  availableSeats: Yup.number()
    .min(0, "Cannot be negative")
    .required("Available seats is required"),
  hotelName: Yup.string().optional(),
  roomType: Yup.string().optional(),
});

// Hotel validation schema
export const hotelValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Hotel name must be at least 3 characters")
    .required("Hotel name is required"),
  address: Yup.string()
    .min(5, "Address must be at least 5 characters")
    .required("Address is required"),
  city: Yup.string().optional(),
  country: Yup.string().optional(),
  roomType: Yup.string().required("Room type is required"),
  pricePerPerson: Yup.number()
    .min(1, "Price must be greater than 0")
    .required("Price per person is required"),
  availableRooms: Yup.number()
    .min(1, "Available rooms must be at least 1")
    .required("Available rooms is required"),
  rating: Yup.number()
    .min(1, "Min rating is 1")
    .max(5, "Max rating is 5")
    .required("Rating is required"),
  description: Yup.string().optional(),
});

// Category validation schema
export const categoryValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Category name must be at least 2 characters")
    .required("Category name is required"),
  slug: Yup.string().required("Slug is required"),
  icon: Yup.string().required("Icon/Emoji is required"),
  description: Yup.string().optional(),
});
