import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-Client";
import { DELETE_REVIEW, GET_ALL_REVIEW } from "../../Utils/Constant";
import { toast } from "react-toastify";
import { IoStar } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import CheckingModel from "../../Components/CheckingModel";
import { useNavigate } from "react-router-dom";
const AdminReview = () => {
  const navigate=useNavigate();
  const [Review, SetReview] = useState();

  const DeleteReview = async (userId, userName, TourId) => {
    try {
      const response = await apiClient.post(DELETE_REVIEW, {
        TourId: TourId,
        userName: userName,
        userId: userId,
      },{withCredentials:true});
  
      if (response.status === 200) {
        toast.success("Review removed successfully");
  
        SetReview((prevReviews) =>
          prevReviews.filter(
            (review) =>
              !(
                review.TourId === TourId &&
                review.userName === userName &&
                review.userId === userId
              )
          )
        );
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("Access denied. Please login as admin.");
        return navigate("/login");
      }
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };
  

  const fetchReview = async () => {
    try {
      const response = await apiClient.get(GET_ALL_REVIEW,{withCredentials:true});
      if (response.status === 200) {
        SetReview(response.data.reviews);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("Access denied. Please login as admin.");
        return navigate("/login");
      }
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

  const [show, setShow] = useState(false);
  const HideDeleteModel = () => [setShow(!show)];
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Review
        ? Review.map((review, index) => (
            <div key={index}>
              <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96">
                {/* Image */}
                <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
                  <img
                    src={review.TourData.images}
                    alt="card-image"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <IoStar key={i} className="text-[orange] text-lg" />
                      ))}
                    </div>
                  </div>
                  <h6 className="mb-2 text-slate-800 text-xl font-semibold">
                    Title: {review.TourData.title}
                  </h6>
                  <p className="text-slate-600 leading-normal font-light">
                    {review.reviewText}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex items-center justify-center text-white font-bold bg-[orange] rounded-full">
                      {getInitial(review.userName)}
                    </div>
                    <div className="flex flex-col ml-3 text-sm">
                      <span className="text-slate-800 font-semibold">
                        {review.userName}
                      </span>
                      <span className="text-slate-600">
                        {ConvertTime(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <MdDelete
                      onClick={HideDeleteModel}
                      className="text-[orange] cursor-pointer text-2xl hover:text-orange-400 transition"
                    />
                  </div>
                  {show && (
                    <CheckingModel
                      text={"Review"}
                      onClose={HideDeleteModel}
                      functions={()=>DeleteReview(
                        review.userId,
                        review.userName,
                        review.TourId
                      )}
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        : // Skeleton Loader Cards (render 3 while loading)
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96 animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="relative h-56 m-2.5 bg-gray-200 rounded-md"></div>

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-5 w-5 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>

              {/* Footer Skeleton */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex flex-col ml-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default AdminReview;
