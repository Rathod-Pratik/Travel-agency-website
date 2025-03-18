import React from "react";
import { GoLocation } from "react-icons/go";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
const TourCard = ({ data }) => {
  const navigate=useNavigate();
  const redirectToTourData=()=>{
    navigate(`/tourDetail/${data._id}`);
  }
  return (
    <div>
      <div className="relative">
        {/* Image */}
        <img
          className="h-full w-full object-cover"
          src={data.images}
          alt="Featured Tour"
        />
        {/* Featured Label */}
        <p className="absolute bottom-0 right-0 bg-[orange] text-white py-1 px-3 text-sm font-semibold">
          Featured
        </p>
      </div>

      <div className="mt-2 p-2">
        <div className="flex flex-row justify-between">
          <p className=" text-[orange] flex items-center gap-1 ">
            <GoLocation />
            {data.location}
          </p>
          <p className="flex items-center">
            {" "}
            <AiFillStar className=" text-[orange]" />{" "}
            <span className="text-gray-400">{data.rating}</span>
          </p>
        </div>
        <div className="flex flex-row justify-between items-center mt-3">
          <p>
            {" "}
            <span className="text-[orange]">${data.price}</span>
            <span className="text-gray-400 font-semibold text-sm">
              /Per Person
            </span>
          </p>
          <button onClick={redirectToTourData} className="cursor-pointer text-center font-semibold rounded-3xl bg-[orange] text-white py-1 px-1 hover:bg-orange-600 transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
