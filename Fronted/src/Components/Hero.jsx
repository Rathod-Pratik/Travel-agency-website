import React from 'react';

const Hero = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row gap-8 p-4 m-auto min-h-[65vh] overflow-hidden w-[90vw] ">
  {/* Text Content Section */}
  <div data-aos="fade-right" className="flex flex-col justify-center text-center md:text-left gap-y-4">
    <div className="flex flex-row items-center justify-center md:justify-start">
      <span className="text-2xl mb-4 bg-[orange] px-4 py-2 text-white inline-block hero-title rounded-[50px] shadow-md">
        Welcome to Easy Travels
      </span>
      <img
        src="/tour-images/world.png"
        className="w-[50px] h-[50px] mb-2 ml-2"
        alt="World Icon"
      />
    </div>
    <p className="text-4xl font-semibold">
      Traveling Opens The Door To Creating <br />
      <span className="text-[orange]">Memories</span>
    </p>
    <p className="text-gray-700">
      Explore the world with ease! At Easy Travel Agency, we make traveling simple and memorable.
      Whether you're dreaming of relaxing on a beach, hiking in the mountains, or exploring vibrant cities,
      we’re here to create a stress-free journey just for you. Let us handle the details while you enjoy the
      adventure!
    </p>
  </div>

  {/* Media Content Section */}
  <div data-aos="fade-left" className="grid grid-cols-1 lg:grid-cols-3 gap-4 justify-center items-center">
    <img
      src="/tour-images/hero-img01.jpg"
      alt="A picturesque view of the destination"
      className="h-[350px] w-full object-cover rounded-[20px] border-2 border-[orange] hidden lg:block"
    />
    <video
      src="/tour-images/hero-video.mp4"
      autoPlay
      loop
      muted
      className="h-[350px] mt-10 w-full object-cover rounded-[20px] border-2 border-[orange] shadow-lg"
      poster="/tour-images/video-poster.jpg"
    ></video>
    <img
      src="/tour-images/hero-img02.jpg"
      alt="Breathtaking mountains"
      className="h-[350px] w-full object-cover rounded-[20px] border-2 border-[orange] hidden lg:block mt-20"
    />
  </div>
</div>

  );
};

export default Hero;

