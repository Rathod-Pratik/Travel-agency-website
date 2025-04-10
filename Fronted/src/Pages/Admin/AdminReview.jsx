import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-Client";
import { DELETE_REVIEW, GET_ALL_REVIEW } from "../../Utils/Constant";
import { toast } from "react-toastify";
import { IoStar } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
const AdminReview = () => {
  const [Review, SetReview] = useState();

  const DeleteReview = async (userId, userName, TourId) => {
    try {
      const response = await apiClient.post(DELETE_REVIEW, {
        TourId: TourId,
        userName: userName,
        userId: userId,
      });
      if (response.status === 200) {
        toast.success("Review removed successfully");
        SetReview((prevReviews) => prevReviews.filter(
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

  const fetchReview = async () => {
    try {
      const response = await apiClient.get(GET_ALL_REVIEW);
      if (response.status === 200) {
        SetReview(response.data.reviews);
      }
    } catch (error) {
      toast.error("Some error occured try again after some time");
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };
  return (
    <div className="p-4">
  {Review?.map((review, index) => (
    <div
      key={index}
      className="mb-6 shadow-md p-4 rounded-lg bg-white relative"
    >
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        {/* Tour Image */}
        <div className="w-full">
          <img
            src={review.TourData.images}
            alt="Tour image"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        {/* Review Info */}
        <div className="">

          <div className="flex justify-between">
          <p className="text-xl font-semibold text-gray-800 mb-2">
            Title: {review.TourData.title}
          </p>


          {/* Rating Stars */}
          <div className="flex items-center gap-1">
            {[...Array(review.rating)].map((_, i) => (
              <IoStar key={i} className="text-[orange] text-lg" />
            ))}
          </div>
        </div>
          {/* User Info */}
          <div className="flex items-center gap-3 mt-4">
            <div className="w-10 h-10 flex items-center justify-center text-white font-bold bg-[orange] rounded-full">
              {getInitial(review.userName)}
            </div>
            <p className="text-lg font-medium">{review.userName}</p>
          </div>
            {/* Review Text */}
            <p className="text-gray-700 p-3 mt-5">{review.reviewText}</p>
            </div>
      </div>

      {/* Delete Button */}
      <MdDelete
        onClick={() =>
          DeleteReview(review.userId, review.userName, review.TourId)
        }
        className="absolute bottom-2 right-2 text-[orange] cursor-pointer text-2xl hover:text-orange-400 transition"
      />
    </div>
  ))}
</div>

  );
};

export default AdminReview;
