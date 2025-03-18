import React, { useEffect, useState } from "react";
import { apiClient } from "../lib/api-Client";
import { GET_TOUR } from "../Utils/Constant";
import TourCard from "./TourCard";
import Banner from "./Banner";

const Tour = () => {
    const [tourData, setTourData] = useState([]);
    useEffect(() => {
      const FetchTour = async () => {
        const response = await apiClient.get(`${GET_TOUR}`);
        if (response.status === 200) {
          setTourData(response.data.data);
        } else {
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
    {tourData.map((data, index) => (
      <div key={index} className="w-full sm:w-[300px] rounded-lg shadow-sm">
        <TourCard data={data} />
      </div>
    ))}
  </div>
    <Banner/>
    </div>
  );
};

export default Tour;
