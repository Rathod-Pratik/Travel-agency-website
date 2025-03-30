import mongoose from "mongoose";
import Review from "../Model/review.model.js";

export const AddReview = async (req, res) => {
  const { userName, TourId, rating, reviewText,userId } = req.body;

  if (!userName || !TourId || !rating || !reviewText || !userId) {
    return res.status(400).send("All the field are required");
  }
  try {
    const review = await Review.create({ userName, TourId, rating, reviewText,userId });

    if (review) {
      res.status(200).send({Message:"Review add successfully",review});
    } else {
      res.status(400).send("Failed to add review");
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send("An error occurred while fetching reviews");
  }
};

export const GetReview = async (req, res) => {
  const { _id } = req.params;

  // Validate ID
  if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send("Invalid or missing ID");
  }

  try {
    // Fetch reviews based on tour ID
    const reviews = await Review.find({ TourId: _id });

    if (reviews.length < 1) {
      return res.status(404).send("No reviews found for this tour");
    }

    // Return reviews
    return res.status(200).json(reviews);
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).send("An error occurred while fetching reviews");
  }
};

export const EditReview = async (req, res) => {
  const { _id } = req.params;
  const { rating, reviewText } = req.body;

  if (!_id) {
    return res.status(400).send("Tour Id is required");
  }
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return res.status(400).send("Invalid rating value");
  }
  if (typeof reviewText !== "string" || reviewText.trim() === "") {
    return res.status(400).send("Invalid review text");
  }

  try {
    const edit = await Review.findByIdAndUpdate(
      _id,
      {
        rating,
        reviewText,
      },
      { new: true }
    );
    if (edit) {
      return res.status(200).send("Reivew edit successfully");
    } else {
      return res.status(400).send("Failed to edit review");
    }
  } catch (error) {
    console.log(error);
  }
};

export const DeleteReview = async (req, res) => {
  const { TourId, userName, userId } = req.body; // Extract from body

  if (!TourId || !userName || !userId) {
    return res.status(400).json({ message: "TourId, userName, and userId are required" });
  }

  try {
    const RemoveReview = await Review.findOneAndDelete({ TourId, userName, userId });

    if (RemoveReview) {
      return res.status(200).json({ message: "Review removed successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ message: "Server error. Try again later." });
  }
};

