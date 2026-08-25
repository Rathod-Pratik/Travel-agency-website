"use client";

import { useCallback, useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { toast } from "react-toastify";

import { apiClient } from "@apiClient";
import { GET_REVIEW } from "@utils";

type Review = {
  _id: string;
  userId: string;
  userName: string;
  reviewText: string;
  rating: number;
  createdAt: string;
};

type Props = {
  TourId: string;
};

const TourReview = ({ TourId }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReview = useCallback(async () => {
    if (!TourId) return;

    try {
      setLoading(true);

      const response = await apiClient.get(
        `${GET_REVIEW}/${TourId}`
      );

      if (response.status === 200) {
        setReviews(response.data);
      } else {
        toast.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [TourId]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  return (
    <div className="border border-gray-300 mt-2 p-4 lg:w-[60vw] w-full shadow-md rounded-md">
      <p className="text-xl font-semibold">
        Reviews ({reviews.length})
      </p>

      <div className="mt-5">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="border-b pb-4 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border-b pb-4 mb-4 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src="/tour-images/ReviewImage.jpg"
                    alt="User"
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      {review.userName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    <p className="text-gray-700 mt-2">
                      {review.reviewText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-sm">
                    {review.rating}
                  </span>

                  <IoStar className="text-orange-500" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default TourReview;