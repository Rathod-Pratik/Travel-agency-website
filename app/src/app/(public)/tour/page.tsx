"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { apiClient } from "@apiClient";
import { GET_TOUR_URL } from "@utils";

import {Card} from "@components";
import {Banner} from "@/components/Banner";

type Tour = {
  _id: string;
  images: string;
  location: string;
  rating: number;
  price: number;
};

const Tour = () => {
  const [tourData, setTourData] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get(GET_TOUR_URL(1, 8));

        if (response.status === 200) {
          setTourData(response.data.data);
        } else {
          toast.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Failed to fetch tours:", error);
        toast.error("Some error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, []);

  return (
    <div>
      <div
        style={{
          background:
            "linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('/tour-images/tour.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="h-50 flex justify-center items-center text-white text-4xl font-semibold"
      >
        All Tours
      </div>

      <div className="overflow-hidden grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {loading ? (
          [...Array(8)].map((_, index) => (
            <div
              key={index}
              className="w-full sm:w-[300px] space-y-4"
            >
              <div className="relative overflow-hidden rounded-lg">
                <div className="h-56 w-full bg-gray-200 rounded-lg animate-pulse" />

                <div className="absolute bottom-2 right-2 h-6 w-20 bg-gray-300 rounded-md animate-pulse" />
              </div>

              <div className="space-y-3 p-2">
                <div className="flex justify-between">
                  <div className="h-5 w-3/5 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-5 w-1/6 bg-gray-200 rounded-full animate-pulse" />
                </div>

                <div className="flex items-center space-x-1">
                  <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-12 bg-gray-200 rounded-full animate-pulse" />
                </div>

                <div className="flex items-center space-x-1">
                  <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-3/5 bg-gray-200 rounded-full animate-pulse" />
                </div>

                <div className="pt-2">
                  <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))
        ) : tourData.length > 0 ? (
          tourData.map((data) => (
            <div
              key={data._id}
              className="w-full sm:w-[300px] rounded-lg shadow-sm"
            >
              <Card data={data} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-xl text-gray-500">
              No tours available.
            </p>
          </div>
        )}
      </div>

      <Banner />
    </div>
  );
};

export default Tour;