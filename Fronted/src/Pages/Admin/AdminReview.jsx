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
        SetReview((prevReviews) =>
          prevReviews.filter(
            (review) =>
              review.TourId !== TourId ||
              review.userName !== userName ||
              review.userId !== userId
          )
        );
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

  const ConvertTime = (time) => {
    const date = new Date(time);
    const day = date.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Review?.map((review, index) => (
        <div key={index}>
          <div class="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96">
            <div class="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
              <img src={review.TourData.images} alt="card-image" />
            </div>
            <div class="p-4">
              <div class="mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <IoStar key={i} className="text-[orange] text-lg" />
                  ))}
                </div>
              </div>
              <h6 class="mb-2 text-slate-800 text-xl font-semibold">
                Title: {review.TourData.title}
              </h6>
              <p class="text-slate-600 leading-normal font-light">
                {review.reviewText}
              </p>
            </div>

            <div class="flex items-center justify-between p-4">
              <div class="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center text-white font-bold bg-[orange] rounded-full">
                  {getInitial(review.userName)}
                </div>
                <div class="flex flex-col ml-3 text-sm">
                  <span class="text-slate-800 font-semibold">
                    {review.userName}
                  </span>
                  <span class="text-slate-600">
                    {ConvertTime(review.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <MdDelete
                  onClick={() =>
                    DeleteReview(review.userId, review.userName, review.TourId)
                  }
                  className="text-[orange] cursor-pointer text-2xl hover:text-orange-400 transition"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminReview;
