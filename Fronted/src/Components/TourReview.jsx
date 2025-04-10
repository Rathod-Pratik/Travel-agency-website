import React, { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { apiClient } from "../lib/api-Client";
import { ADD_REVIEW, DELETE_REVIEW, GET_REVIEW } from "../Utils/Constant";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

const TourReview = ({ TourId, userName, userId,TourData }) => {
  const [selected, setSelected] = useState(null);
  const [reviewText, SetReviewText] = useState("");
  const [reviewStar, SetReviewStar] = useState(0);
  const [review, setReview] = useState([]);

  const FetchReview = async () => {
    try {
      const response = await apiClient.get(`${GET_REVIEW}/${TourId}`);
      if (response.status === 200) {
        setReview(response.data);
      } else {
        toast.error("Failed to fetch review");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (TourId) {
      FetchReview();
    } else {
      console.log("TourId is undefined or null");
    }
  }, [TourId]);

  const AddReview = async () => {
    try {
      if (reviewText.length <= 10) {
        return toast.error("Review text must contain at least 10 characters.");
      }
      if (reviewStar < 1) {
        return toast.error("Please select a star for Rating");
      }

      const response = await apiClient.post(ADD_REVIEW, {
        userId: userId,
        userName: userName,
        TourId: TourId,
        rating: reviewStar,
        reviewText: reviewText,
        TourData:TourData
      });
      if (response.status === 200) {
        toast.success("Review added successfully");

        // ✅ Append the new review to the existing review state
        setReview((prevReviews) => [
          ...prevReviews,
          {
            userId,
            userName,
            TourId,
            rating: reviewStar,
            reviewText,
            createdAt: new Date().toISOString(), // Optional: Add timestamp
          },
        ]);

        // ✅ Clear input fields after submission
        SetReviewText("");
        SetReviewStar(0);
        setSelected(0)
      } else {
        toast.error("Failed to add review");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const DeleteReview = async (_id) => {
    try {
      const response = await apiClient.post(DELETE_REVIEW, {
        TourId: TourId,
        userName: userName,
        userId:userId

      });

      if (response.status === 200) {
        toast.success("Review removed successfully");
        setReview((prevReviews) => prevReviews.filter(
            (review) => review.TourId !== TourId || review.userName !== userName || review.userId !== userId
          ));
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="border  font-semibold border-gray-300 mt-2 p-4 lg:w-[60vw] shadow-md rounded-md inline-block">
      <p className="text-xl">Reviews ({review.length} reviews)</p>
      <p className="flex items-center flex-row gap-3">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            className={`${num <= selected ? "text-[orange]" : "text-black"}`}
            key={num}
            onClick={() => {
              setSelected(num);
              SetReviewStar(num);
            }}
          >
            <span className="flex flex-row gap-0.5 items-center text-[1rem] mt-7">
              {" "}
              {num} <IoStar />
            </span>
          </span>
        ))}
      </p>
      <div className="relative w-full mt-2">
        <input
          value={reviewText}
          onChange={(e) => SetReviewText(e.target.value)}
          type="text"
          className="border border-[orange] w-full pr-20 rounded-md px-3 h-12 focus:outline-none"
          placeholder="Share your Thoughts"
        />
        <button
          onClick={AddReview}
          className="bg-[orange] text-white py-2 px-4 rounded-md absolute right-0 top-0 h-full flex items-center justify-center"
        >
          Submit
        </button>
      </div>
      <div className="mt-5">
        {review?.length > 0 ? (
          review.map((ReviewData, index) => (
            <div key={index} className="border-b pb-4 mb-4">
              <div className="flex items-start justify-between">
                {/* Left Section: User Image & Details */}
                <div className="flex items-center space-x-4">
                  <img
                    src="/tour-images/ReviewImage.jpg"
                    alt="User image"
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {ReviewData.userName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(ReviewData.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-gray-700">{ReviewData.reviewText}</p>
                  </div>
                </div>
                {/* Right Section: Star Rating */}
                <div className="flex flex-col items-center justify-between relative h-full space-y-12">
                  {/* Rating Section */}
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-gray-400 text-sm">
                      {ReviewData.rating}
                    </span>
                    <IoStar className="text-orange-500 text-lg" />
                  </div>

                  {/* Delete Button Positioned at Bottom Left */}
                  {userId === ReviewData.userId && (
                    <MdDelete
                      onClick={() => DeleteReview(ReviewData.reviewText)}
                      className="absolute bottom-2 left-2 text-red-500 cursor-pointer text-xl hover:text-red-700 transition"
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default TourReview;
// "userId": "67e830d57d4f95fabf065daa",
// "TourId": "67cc7d110bc2770fc8aac91e",
// "rating": 5,
// "reviewText": "Rathod Pratik is good boy",
