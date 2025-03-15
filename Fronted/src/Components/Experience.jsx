import React from "react";

const Experience = () => {
  return (
    <div className="mt-5 w-[90%] mx-auto">
    {/* Title Section */}
    <p className="text-2xl bg-[orange] px-4 py-2 text-white inline-block hero-title rounded-[50px] shadow-md mb-6 mx-auto md:ml-0">
      Experience
    </p>
  
    {/* Content Section */}
    <div className="flex flex-col-reverse md:flex-row justify-evenly items-center">
      {/* Text Content */}
      <div className="w-full md:w-[45%] flex flex-col self-center text-center md:text-left">
        <p className="text-4xl font-bold mb-4">
          With our experience, <br /> we will serve you
        </p>
        <p className="text-gray-500 mb-6">
          Experience the Expertise: With over 15 years of crafting unforgettable journeys, we bring professionalism, passion, and a personal touch to every trip we plan. Our extensive experience in the travel industry ensures exceptional service.
        </p>
        <div className="flex flex-row gap-6 justify-center md:justify-start">
          {/* Single Stat */}
          <div className="flex flex-col items-center">
            <span className="h-[60px] w-[70px] pt-[15px] bg-[orange] text-white rounded-[5px] text-center text-2xl shadow-md">
              12k+
            </span>
            <span className="text-gray-500 mt-3 text-sm font-semibold">
              Successful Trips
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="h-[60px] w-[70px] pt-[15px] bg-[orange] text-white rounded-[5px] text-center text-2xl shadow-md">
              2k+
            </span>
            <span className="text-gray-500 mt-3 text-sm font-semibold">
              Regular Clients
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="h-[60px] w-[70px] pt-[15px] bg-[orange] text-white rounded-[5px] text-center text-2xl shadow-md">
              15+
            </span>
            <span className="text-gray-500 mt-3 text-sm font-semibold">
              Years Experience
            </span>
          </div>
        </div>
      </div>
  
      {/* Image Section */}
      <div className="w-full md:w-[45%] flex justify-center lg:justify-end mt-6 md:mt-0">
        <img
          src="/tour-images/experience.png"
          className="object-cover rounded-lg shadow-md"
          alt="Experience Image"
        />
      </div>
    </div>
  </div>
  
  );
};

export default Experience;
