import mongoose from "mongoose";
import Review from "../Model/review.model.js";

export const AddReview = async (req, res) => {
  const { userId, TourId, rating, reviewText } = req.body;

  if (!userId || !TourId || !rating || !reviewText) {
    return res.status(400).send("All the field are required");
  }
  try {
    const review = await Review.create({ userId, TourId, rating, reviewText });

    if (review) {
      res.status(200).send("Review add successfully");
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

export const DeleteReview=async(req,res)=>{
  const {_id}=req.params;

  if(!_id){
    return res.status(400).send("Id is required");
  }

  try {
    const RemoveReview=await Review.findByIdAndDelete({_id});

    if(RemoveReview){
      return res.status(200).send("Review Removed successfully");
    }
    else{
      return res.status(400).send("fail to delete review");
    }

  } catch (error) {
    console.log(error);
    return res.status(400).send("Some error occurred try again after some time");
  }
}
