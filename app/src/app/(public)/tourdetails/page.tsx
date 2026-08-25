"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AiFillStar } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { toast } from "react-toastify";

import { apiClient } from "@apiClient";
import { GET_TOUR_DETAIL } from "@utils";

import TourReview from "./Components/Review";

type Itinerary = {
  day: number;
  activity: string;
};

type Tour = {
  _id: string;
  title: string;
  images: string;
  location: string;
  price: number;
  tax: number;
  rating: number;
  duration: string;
  maxCapacity: number;
  description: string;
  included: string[];
  notIncluded: string[];
  itinerary: Itinerary[];
};

const TourDetail = () => {
  const params = useParams();

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const [tourdata, setTourData] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTourData = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get(
          `${GET_TOUR_DETAIL}/${id}`
        );

        if (response.status === 200) {
          setTourData(response.data.data);
        } else {
          toast.error("Failed to fetch tour details");
        }
      } catch (error) {
        console.error("Failed to fetch tour:", error);
        toast.error(
          "Some error occurred. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  if (loading) {
    return (
      <div className="w-[90vw] mx-auto mt-6 space-y-6">
        <div className="h-80 w-full bg-gray-200 rounded-lg animate-pulse" />

        <div className="space-y-4 border border-gray-200 rounded-lg p-6">
          <div className="h-8 w-3/4 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-5 w-1/3 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-5 w-1/2 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-11/12 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-10/12 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!tourdata) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-xl text-gray-500">
          Tour not found.
        </p>
      </div>
    );
  }

  return (
    <div className="w-[90vw] mx-auto my-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={tourdata.images}
              alt={tourdata.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>

          <div className="border border-gray-300 rounded-lg shadow-md bg-white p-6">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-700">
              {tourdata.title}
            </h1>

            <p className="text-gray-500 text-lg mt-2">
              {tourdata.location}
            </p>

            <div className="flex flex-wrap gap-6 text-gray-600 mt-5">
              <p className="flex items-center gap-2 text-sm font-medium">
                <RiMoneyRupeeCircleFill className="text-xl" />
                ₹{tourdata.price} / Per Person
              </p>

              <p className="text-sm font-medium">
                Duration: {tourdata.duration}
              </p>

              <p className="flex items-center gap-2 text-sm font-medium">
                <FaRegUserCircle className="text-xl" />
                {tourdata.maxCapacity} People
              </p>

              <p className="flex items-center gap-2 text-sm font-medium">
                <AiFillStar className="text-orange-500 text-xl" />
                {tourdata.rating}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Description
              </h2>

              <p className="text-gray-600 mt-3 leading-relaxed whitespace-pre-line">
                {tourdata.description}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Included
                </h2>

                {tourdata.included?.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {tourdata.included.map((item, index) => (
                      <p
                        key={index}
                        className="text-gray-600"
                      >
                        <span className="text-green-600 font-semibold">
                          ✔
                        </span>{" "}
                        {item}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-3">
                    No inclusions available.
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Not Included
                </h2>

                {tourdata.notIncluded?.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {tourdata.notIncluded.map((item, index) => (
                      <p
                        key={index}
                        className="text-gray-600"
                      >
                        <span className="text-red-500 font-semibold">
                          ✖
                        </span>{" "}
                        {item}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-3">
                    No exclusions available.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800">
                Itinerary Planning
              </h2>

              {tourdata.itinerary?.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {tourdata.itinerary.map((item, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-orange-500 pl-4"
                    >
                      <p className="font-semibold text-gray-800">
                        Day {item.day}
                      </p>

                      <p className="text-gray-600">
                        {item.activity}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-3">
                  No itinerary available.
                </p>
              )}
            </div>
          </div>

          <TourReview TourId={tourdata._id} />
        </div>

        <div className="lg:col-span-1">
          <div className="border border-gray-300 rounded-lg shadow-md bg-white p-6 lg:sticky lg:top-5">
            <h2 className="text-2xl font-semibold text-gray-800">
              Tour Information
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm text-gray-500">
                  Location
                </p>
                <p className="font-semibold text-gray-800">
                  {tourdata.location}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Price
                </p>
                <p className="text-2xl font-bold text-orange-500">
                  ₹{tourdata.price}
                </p>
                <p className="text-sm text-gray-500">
                  per person
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Duration
                </p>
                <p className="font-semibold text-gray-800">
                  {tourdata.duration}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Maximum Capacity
                </p>
                <p className="font-semibold text-gray-800">
                  {tourdata.maxCapacity} People
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Rating
                </p>

                <div className="flex items-center gap-2">
                  <AiFillStar className="text-orange-500 text-xl" />
                  <span className="font-semibold">
                    {tourdata.rating}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Taxes
                </p>
                <p className="font-semibold text-gray-800">
                  ₹{tourdata.tax}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;