import {Request,Response} from 'express';
import ReviewModel from './Review.model';

export const AddReview = async (req: Request, res: Response) => {
    const { userId, TourId, rating, reviewText } = req.body;
    try {
        const review = await ReviewModel.create({ userId, TourId, rating, reviewText });
        if (!review) {
            return res.status(400).json({ message: "Failed to add review" });
        } else {
            return res.status(201).json({
                success: true,
                message: "Review added successfully",
                data: review,
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error adding review",
            data: err,
        });
    }
}
export const GetReview = async (req: Request, res: Response) => {
    const { _id } = req.params;
    try {
        const review = await ReviewModel.findById(_id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Review retrieved successfully",
            data: review,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving review",
            data: err,
        });
    }
}
export const EditReview = async (req: Request, res: Response) => {
    const { _id } = req.params;
    const { userId, TourId, rating, reviewText } = req.body;
    try {
        const review = await ReviewModel.findByIdAndUpdate(
            _id,
            { userId, TourId, rating, reviewText },
            { new: true }
        );
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error updating review",
            data: err,
        });
    }
}
export const DeleteReview = async (req: Request, res: Response) => {
    const { _id } = req.params;
    try {
        const review = await ReviewModel.findByIdAndDelete(_id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: review,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error deleting review",
            data: err,
        });
    }
}