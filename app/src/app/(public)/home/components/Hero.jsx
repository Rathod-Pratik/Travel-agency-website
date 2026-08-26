import Image from 'next/image';
import React, { useState, useEffect } from 'react';

export const Hero = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5s delay for demo
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex flex-col-reverse md:flex-row gap-8 p-4 m-auto min-h-[65vh] overflow-hidden w-[90vw] ">
      {/* Text Content Section */}
      <div data-aos="fade-right" className="flex flex-col justify-center text-center md:text-left gap-y-4">
        <div className="flex flex-row items-center justify-center md:justify-start">
          <span className="text-2xl mb-4 bg-[orange] px-4 py-2 text-white inline-block hero-title rounded-[50px] shadow-md">
            Welcome to Easy Travels
          </span>
          <Image
            src="/tour-images/world.png"
            className="mb-2 ml-2"
            alt="World Icon"
            width={50}
            height={50}
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

        {/* Left Image */}
        <div className="h-[350px] w-full rounded-[20px] border-2 border-[orange] overflow-hidden hidden lg:block">

          <Image
            src="/tour-images/hero-img01.jpg"
            alt="A picturesque view of the destination"
            className="h-full w-full object-cover"
            width={500}
            height={350}
          />
        </div>

        {/* Video */}
        <div className="h-[350px] w-full rounded-[20px] border-2 border-[orange] shadow-lg overflow-hidden mt-10">

          <video
            src="/tour-images/hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            poster="/tour-images/hero-video.mp4"
          />
        </div>

        {/* Right Image */}
        <div className="h-[350px] w-full rounded-[20px] border-2 border-[orange] overflow-hidden hidden lg:block mt-20">

          <Image
            src="/tour-images/hero-img02.jpg"
            alt="Breathtaking mountains"
            className="h-full w-full object-cover"
            width={500}
            height={350}
          />
        </div>

      </div>
    </div>

  );
};

