import React from "react";

const Services = () => {
  return (
    <div className="mt-4 w-[90%] mx-auto">
  <p className="text-orange-600 hero-title text-4xl mb-4 font-bold">What We Serve</p>
  <p className="font-semibold text-2xl text-gray-800 mb-6">
    We Offer Our Best Services
  </p>
  <div className="flex flex-wrap justify-center gap-6">
    {/* Single Service Card */}
    {[
      { src: "/tour-images/weather.png", title: "Calculate Weather", desc: "Calculate weather based on location" },
      { src: "/tour-images/guide.png", title: "Professional Guides", desc: "Get assistance from local experts" },
      { src: "/tour-images/customization.png", title: "Customizable Tours", desc: "Tailor trips to your preferences" },
      { src: "/tour-images/tours.png", title: "Exclusive Tours", desc: "Access curated travel experiences" },
    ].map((service, index) => (
      <div
        key={index}
        className="flex flex-col items-center gap-4 p-6 bg-white shadow-md rounded-lg border border-[orange] hover:shadow-lg transition-shadow w-[250px]"
      >
        <img
          src={service.src}
          className="bg-[orange] rounded-full h-[50px] w-[50px] object-cover"
          alt={service.title}
        />
        <div className="text-center">
          <p className="font-bold text-lg">{service.title}</p>
          <p className="text-gray-500 text-sm">{service.desc}</p>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default Services;
