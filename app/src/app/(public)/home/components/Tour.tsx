import React, { useEffect, useState } from "react";
import { apiClient } from "@apiClient";
import { GET_TOUR_URL } from "@utils";
import { Card } from "@components";
import Link from "next/link";
import { toast } from "react-toastify";

export const Tour = () => {
  const [tourData, setTourData] = useState([]);
  useEffect(() => {
    const FetchTour = async () => {
      try {
        const response = await apiClient.get(`${GET_TOUR_URL(1, 4)}`);
        if (response.status === 200) {
          setTourData(response.data.data);
        }
      } catch (error: any) {
    const data = error?.response?.data;
    const status = error?.response?.status;

    if (data?.success === false && status === 500) {
        toast.error("Server is down. Try again after some time.");
    } else {
        toast.error(
            data?.message || "Something went wrong. Please try again."
        );
    }

    console.error("Error:", error);
}
    };
    FetchTour();
  }, []);

  return (
    <div className="mt-6 w-[95%] mx-auto">
      {/* Section Header */}
      <div className="mb-6">
        <p data-aos="fade-right" className="text-2xl bg-[orange] px-4 py-2 text-white inline-block hero-title rounded-[50px] shadow-md mb-6 mx-auto md:ml-0">
          Explore
        </p>
        <p data-aos="fade-right" className="text-4xl font-bold text-gray-800">
          Our Featured Tours
        </p>
      </div>

      <div className="grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:self-center">
        {tourData.map((data, index) => (
          <div data-aos="fade-down" key={index} className="w-full sm:w-[300px] rounded-lg shadow-sm">
            <Card data={data} />
          </div>
        ))}
      </div>



      {/* View All Tours Link */}
      <div className="text-center">
        <Link
          href="/tour"
          className="inline-block w-[150px] mt-6 cursor-pointer text-center font-semibold rounded-3xl bg-[orange] text-white py-3 px-4 hover:bg-orange-600 transition-transform hover:scale-[1.05]"
        >
          View All Tours
        </Link>
      </div>
    </div>

  );
};
