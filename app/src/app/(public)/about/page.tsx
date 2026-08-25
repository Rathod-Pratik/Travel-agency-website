"use client";

import { Banner, Contect } from "@/components";

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-8 p-4 mx-auto min-h-[65vh] overflow-hidden w-full max-w-[90vw]">
        
        {/* Text Content */}
        <div
          data-aos="fade-right"
          className="w-full md:w-[45vw] flex flex-col justify-center text-center md:text-left gap-y-4"
        >
          {/* Title */}
          <div className="flex items-center justify-center md:justify-start">
            <span className="text-2xl mb-4 bg-[orange] px-5 py-2 text-white inline-block rounded-full shadow-md">
              About Us
            </span>

            <img
              src="/tour-images/world.png"
              className="w-[50px] h-[50px] mb-2 ml-2 object-contain"
              alt="World Icon"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            Traveling Opens The Door To Creating{" "}
            <span className="text-[orange]">
              Memories
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed">
            At Easy Travel Agency, we believe that travel is not
            just about visiting destinations—it's about creating
            memories that last a lifetime. Our mission is to turn
            your travel dreams into reality, helping you explore
            the world with ease, comfort, and excitement.
          </p>
        </div>

        {/* Image */}
        <div
          data-aos="fade-left"
          className="w-full md:w-[45%] flex justify-center md:justify-end items-center"
        >
          <img
            src="/tour-images/logo1.png"
            alt="Easy Travel Agency"
            className="object-contain w-[80%] sm:w-[70%] md:w-[75%] max-h-[450px]"
          />
        </div>
      </section>

      {/* Contact Section */}
      <Contect />

      {/* Banner Section */}
      <Banner />
    </>
  );
};

export default About;