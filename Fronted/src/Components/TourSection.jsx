import React, { useEffect, useState } from "react";
import { apiClient } from "../lib/api-Client";
import { GET_TOUR, HOST } from "../Utils/Constant";
import TourCard from "./TourCard";
import { Link } from "react-router-dom";

const TourSection = () => {
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
    <div className="mt-6 w-[90%] mx-auto">
  {/* Section Header */}
  <div className="mb-6">
    <p className="text-2xl bg-[orange] px-4 py-2 text-white inline-block hero-title rounded-[50px] shadow-md mb-6 mx-auto md:ml-0">
      Explore
    </p>
    <p className="text-4xl font-bold text-gray-800">
      Our Featured Tours
    </p>
  </div>

  {/* Featured Tours List */}
  <div className="grid grid-cols-1 items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:self-center">
    {tourData.map((data, index) => (
      <div key={index} className="w-full sm:w-[300px] rounded-lg shadow-sm">
        <TourCard data={data} />
      </div>
    ))}
  </div>

  {/* View All Tours Link */}
  <div className="text-center">
    <Link
      to="/tour"
      className="inline-block w-[150px] mt-6 cursor-pointer text-center font-semibold rounded-3xl bg-[orange] text-white py-3 px-4 hover:bg-orange-600 transition-transform hover:scale-[1.05]"
    >
      View All Tours
    </Link>
  </div>
</div>

  );
};

export default TourSection;
