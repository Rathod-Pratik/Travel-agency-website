import React, { useEffect, useState } from "react";
import { apiClient } from "../lib/api-Client";
import { GET_TOUR } from "../Utils/Constant";
import TourCard from "./TourCard";
import Banner from "./Banner";
import {toast} from 'react-toastify'
const Tour = () => {
  const [tourData, setTourData] = useState();
  useEffect(() => {
    const FetchTour = async () => {
      try {
        
        const response = await apiClient.get(`${GET_TOUR}`);
        if (response.status === 200) {
          setTimeout(() => {
            setTourData(response.data.data);
          }, [2000]);
        } else {
          toast.error("Failed to fetch data")
        }
      } catch (error) {
        toast.error("Some error occured try again after some time")
        console.log(error)
      }
    };
    FetchTour();
  }, []);
  return (
    <div>
      <p
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('/tour-images/tour.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="text-white h-50 flex justify-center items-center text-4xl font-semibold"
      >
        All Tours
      </p>
      <div className="grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:self-center">
  {typeof tourData === "undefined" ? (
    // Skeleton loading state
    [...Array(8)].map((_, index) => (
      <div key={index} className="w-full sm:w-[300px] space-y-4">
        {/* Image skeleton with shimmer effect */}
        <div className="relative overflow-hidden rounded-lg">
          <div className="h-56 w-full bg-gray-200 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
          {/* Featured label skeleton */}
          <div className="absolute bottom-2 right-2 h-6 w-20 bg-gray-300 rounded-md animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-3 p-2">
          {/* Title and price row */}
          <div className="flex justify-between">
            <div className="h-5 w-3/4 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-5 w-1/6 bg-gray-200 rounded-full animate-pulse" />
          </div>
          
          {/* Rating row */}
          <div className="flex items-center space-x-1">
            <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-12 bg-gray-200 rounded-full animate-pulse" />
          </div>
          
          {/* Location row */}
          <div className="flex items-center space-x-1">
            <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-3/5 bg-gray-200 rounded-full animate-pulse" />
          </div>
          
          {/* Button skeleton */}
          <div className="pt-2">
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    ))
  ) : (
    // Actual data state
    tourData.map((data) => (
      <div key={data.id} className="w-full sm:w-[300px] rounded-lg shadow-sm">
        <TourCard data={data} />
      </div>
    ))
  )}
</div>

      <Banner />
    </div>
  );
};

export default Tour;
