import mongoose from "mongoose";
import Review from '../Model/review.model.js';

export const AddReview=async(req,res)=>{
    const {userId,TourId,rating,reviewText}=req.body;

    if(!userId || !TourId || !rating || !reviewText){
        return res.status(400).send("All the field are required");
    }
try {
    const review=await Review.create({userId,TourId,rating,reviewText});

    if(review){
        res.status(200).send("Review add successfully");
    }
    else{
        res.status(400).send("Failed to add review");
    }
} catch (error) {
    console.error(error); // Log the error for debugging
        return res.status(500).send("An error occurred while fetching reviews");
}
  
}


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
