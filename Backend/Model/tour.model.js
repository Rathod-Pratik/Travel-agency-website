import mongoose from "mongoose";

const TourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    duration: {
      type: String, // Example: "3 Days, 2 Nights"
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableDates: {
      type: [Date], // Array of dates when the tour is available
      required: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    included: {
      type: [String], // Example: ["Meals", "Transport", "Hotel"]
    },
    notIncluded: {
      type: [String], // Example: ["Personal Expenses", "Flights"]
    },
    itinerary: {
      type: [{ day: Number, activity: String }], // Example: [{ day: 1, activity: "City Tour" }]
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    images: {
      type: [Array],
    },
  },
  { timestamps: true }
);

const TourModel = mongoose.model("Tour", TourSchema);

export default TourModel;
