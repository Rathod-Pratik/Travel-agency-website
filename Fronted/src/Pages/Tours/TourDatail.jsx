import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-Client";
import { GET_TOUR_DETAIL } from "../../Utils/Constant";
import { useParams } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

const TourDatail = () => {
  const { _id } = useParams();
  const [tourdata, SetTourData] = useState([]);
  useEffect(() => {
    const fetchTourData = async (req, res) => {
      try {
        const response = await apiClient.get(`${GET_TOUR_DETAIL}/${_id}`);
        if (response.status === 200) {
          SetTourData(response.data.data);
        } else {
          console.log("Some error occured");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTourData();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 w-[90vw] mt-3 m-auto mt-4">
        <div className="col-span-2 space-y-6">
          {/* Tour Image */}
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={tourdata.images}
              alt={tourdata.title}
              className="w-full object-cover rounded-lg"
            />
          </div>

          {/* Tour Details */}
          <div className="p-6 flex justify-start flex-col border border-gray-300 rounded-lg shadow-md bg-white ">
            {/* Tour Title */}
            <h2 className="text-3xl font-semibold text-gray-700">
              {tourdata.title}
            </h2>

            {/* Location */}
            <p className="text-gray-500 text-lg mt-2">{tourdata.location}</p>

            {/* Pricing & Details */}
            <div className="flex flex-wrap gap-6 text-gray-600 mt-4">
              <p className="flex items-center gap-2 text-sm font-medium">
                <RiMoneyRupeeCircleFill className="text-black text-xl" />{" "}
                {tourdata.price} / Per Person
              </p>
              <p className="text-sm font-medium">For: {tourdata.duration}</p>
              <p className="flex items-center gap-2 text-sm font-medium">
                <FaRegUserCircle className="text-black text-xl" />{" "}
                {tourdata.maxCapacity} People
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 mt-5 leading-relaxed">
              description : {tourdata.description}
            </p>
            <div className="mt-4 flex flex-row justify-between w-[50%]">
              <div>
                <h1>Included</h1>
                {(tourdata?.included ?? []).length > 0 ? (
                  tourdata.included.map((data, index) => (
                    <p key={index} className="text-gray-600">
                      ✔ {data}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500">No inclusions available</p>
                )}
              </div>
              <div>
                <div>
                  <h1>Not Included</h1>
                  {(tourdata?.notIncluded ?? []).length > 0 ? (
                    tourdata.included.map((data, index) => (
                      <p key={index} className="text-gray-600">
                        ✖ {data}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500">No inclusions available</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-4">
              <h2>itinerary planning</h2>
              <div>
                {(tourdata?.itinerary ?? []).length > 0 ? (
                  tourdata.itinerary.map((data, index) => (
                    <p key={index} className="text-gray-600">
                      Day {data.day} : {data.activity}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500">No inclusions available</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 border border-gray-300 h-[87vh] rounded-md p-4">
          <div className="flex justify-between flex-row py-9 border-b border-b-gray-300">
            <p>
              <span className="font-bold text-xl">${tourdata.price}</span> / Per
              Person
            </p>
            <p className=" flex flex-row items-center gap-2 text-xl">
              <AiFillStar className="text-[orange]" /> {tourdata.rating}
            </p>
          </div>
          <div className="mt-5">
            <h1 className="text-xl">Information</h1>
            <div className="border border-gray-300 p-[30px] flex flex-col gap-5">
              <input type="text" className="outline-none border-b border-b-gray-300" placeholder="Full Name" />
              <input type="text" className="outline-none border-b border-b-gray-300 my-4" placeholder="Moblie Number"/>
              <div className="flex flex-row justify-between">
                <input type="date" className="outline-none border-b border-b-gray-300" />
                <input type="number" className="outline-none border-b border-b-gray-300" placeholder="Group Size" />
              </div>
            </div>
          </div>
          <div>
          <div className="flex flex-row justify-between">
            <p> ${tourdata.price} 1 Person </p>
            <p>{tourdata.price}</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDatail;