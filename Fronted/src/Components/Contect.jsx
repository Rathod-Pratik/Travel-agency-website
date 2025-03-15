import React from "react";

const Contect = () => {
  return (
    <div className="w-full md:w-[40%] mx-auto pb-6">
      {/* Title */}
      <p className="text-2xl bg-[orange] px-4 py-2 text-white inline-block hero-title rounded-[50px] shadow-md mb-6 mx-auto text-center">
        Testimonial
      </p>

      {/* Contact Section */}
      <div className="border border-gray-300 p-4 rounded-lg font-semibold mb-4 text-base shadow-sm">
        <p className="mb-2">
          📞 Contact No: <span className="text-gray-700">+91 7202001502</span>
        </p>
        <p>
          ✉️ Email:{" "}
          <span className="text-gray-700">RathodPratik1928@gmail.com</span>
        </p>
      </div>

      {/* Input Fields */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          className="border-b border-gray-300 outline-none focus:border-[orange] transition-all py-2 px-1 text-gray-800 rounded-[5px]"
        />
        <input
          type="email"
          placeholder="Email"
          className="border-b border-gray-300 outline-none focus:border-[orange] transition-all py-2 px-1 text-gray-800 rounded-[5px]"
        />
        <input
          type="tel"
          placeholder="Phone"
          className="border-b border-gray-300 outline-none focus:border-[orange] transition-all py-2 px-1 text-gray-800 rounded-[5px]"
        />
        <textarea
          placeholder="Message"
          className="border-b border-gray-300 outline-none focus:border-[orange] transition-all py-2 px-1 text-gray-800 rounded-[5px] resize-none h-[100px]"
        ></textarea>
      </div>

      {/* Submit Button */}
      <button className="mt-6 px-4 bg-[orange] text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-all">
        Submit
      </button>
    </div>
  );
};

export default Contect;
