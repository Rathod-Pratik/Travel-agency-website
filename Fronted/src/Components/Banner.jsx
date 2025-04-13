import React from "react";

const Banner = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center h-[50vh] p-4 bg-[#cae5f4] px-10 ">
      {/* Subscribe Section */}
      <div data-aos="fade-right" className="flex flex-col text-left lg:justify-end ml-5">
        <p className="text-4xl font-bold mb-4">
          Subscribe to Get Useful Traveling Information
        </p>

        {/* Input with Button */}
        <div className="relative w-full lg:w-[80%]">
          <input
            type="text"
            placeholder="Enter your Email"
            className="w-full py-4 px-4 border bg-white outline-none border-none"
          />
          <button className="absolute top-[8px] right-[7px] bg-[orange] text-white py-2 px-5 hover:bg-orange-600 transition-all font-semibold">
            Subscribe
          </button>
        </div>
        <p className="text-gray-500 my-6 text-center lg:text-left">
          Stay updated with the latest travel deals, tips, and destinations.
          Join our newsletter today!Discover exclusive travel deals and expert tips to elevate your adventures.
        </p>
      </div>

      {/* Image Section */}
      <div data-aos="fade-left" className="hidden lg:flex justify-center">
        <img
          src="/tour-images/male-tourist.png"
          alt="Male Tourist"
          className="w-[500px] h-auto"
        />
      </div>
    </div>
  );
};

export default Banner;
