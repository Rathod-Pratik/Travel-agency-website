import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

// Import required modules
import { Autoplay, Pagination } from "swiper/modules";

const Testimonial = () => {
  const reviews = [
    {
      name: "John Doe",
      image: "/tour-images/ava-1.jpg",
      designation: "Travel Enthusiast",
      review:
        "Amazing service! Our trip was so smooth and memorable. Highly recommend!",
    },
    {
      name: "Jane Smith",
      image: "/tour-images/ava-2.jpg",
      designation: "Adventure Seeker",
      review:
        "Wonderful experience with friendly and professional guides. Truly exceptional!",
    },
    {
      name: "Emily Johnson",
      image: "/tour-images/ava-3.jpg",
      designation: "Solo Traveler",
      review:
        "The best travel agency ever! They took care of everything perfectly.",
    },
    {
      name: "Michael Brown",
      image: "/tour-images/ava-1.jpg",
      designation: "Explorer",
      review:
        "Superb planning and execution. Made traveling so much easier for us.",
    },
    {
      name: "Sarah Wilson",
      image: "/tour-images/ava-2.jpg",
      designation: "Luxury Tourist",
      review:
        "Loved how personalized the tours were! Will definitely book again.",
    },
    {
      name: "David Miller",
      image: "/tour-images/ava-3.jpg",
      designation: "Backpacker",
      review:
        "An unforgettable experience! Thank you for making our trip special.",
    },
  ];

  return (
    <div className="mt-6 w-[90vw] mx-auto">
      {/* Testimonial Title */}
      <p data-aos="fade-right" className="mb-4 text-2xl bg-[orange] px-4 py-2 text-white inline-block rounded-full shadow-md mx-auto md:ml-0">
        Testimonial
      </p>
      <h2 data-aos="fade-right" className="text-3xl font-bold text-center md:text-left mb-8">
        What Our Customers Say About Us
      </h2>

      {/* Swiper for All Screen Sizes with Breakpoints */}
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[Autoplay]}
        className="mySwiper w-[80vw] md:w-[80vw]"
      >
        {reviews.map((review, index) => (
          <SwiperSlide
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
          >
            <img
              src={review.image}
              alt={`${review.name}'s avatar`}
              className="w-[80px] h-[80px] rounded-full mb-4 object-cover shadow-lg"
            />
            <p className="italic text-gray-700 mb-4">"{review.review}"</p>
            <h4 className="font-bold text-lg text-[orange]">{review.name}</h4>
            <p className="text-gray-500 text-sm">{review.designation}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonial;
