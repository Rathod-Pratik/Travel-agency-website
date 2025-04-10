import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-Client";
import { CREATE_BOOKING, GET_TOUR_DETAIL } from "../../Utils/Constant";
import { useParams } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { useAppStore } from "../../Store";
import { toast } from "react-toastify";
import TourReview from "../../Components/TourReview";

const TourDatail = () => {
  const { _id } = useParams();
  const [tourdata, SetTourData] = useState([]);
  const { userInfo, AddBookingData } = useAppStore();
  const [name, setName] = useState("");
  const [phone, SetPhone] = useState("");
  const [date, SetDate] = useState("");
  const [groupsize, SetGroupSize] = useState("");
  useEffect(() => {
    const fetchTourData = async () => {
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

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // ✅ Improved Input Validations
    if (name.length < 3) {
      return toast.error("Please enter a valid name (minimum 3 characters).");
    } else if (!/^\d{10}$/.test(phone)) {
      return toast.error("Please enter a valid 10-digit phone number.");
    } else if (!date) {
      return toast.error("Please select a date for the tour.");
    } else if (groupsize < 1) {
      return toast.error("Please select a valid group size.");
    }

    try {
      // ✅ Load Razorpay Script Dynamically
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        return toast.error(
          "Razorpay SDK failed to load. Please check your network."
        );
      }

      // ✅ Create Order on Backend
      const { data } = await apiClient.post("payment/create-order", {
        amount: tourdata.price * groupsize + tourdata.tax,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          productName: tourdata.title,
          userId: userInfo._id,
        },
      });

      // ✅ Razorpay Payment Options
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Easy Travel",
        description: `Payment for ${tourdata.title}`,
        image: "/tour-images/logo-travel2.jpg",
        order_id: data.order.id,

        // ✅ Payment Handler Function
        handler: async function (response) {
          try {
            // 🔹 Verify payment with backend
            const verifyRes = await apiClient.post("payment/verify-order", {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (!verifyRes.data.success) {
              return toast.error("Payment verification failed.");
            }

            toast.success(
              `Payment Successful! Payment ID: ${response.razorpay_payment_id}`
            );
            console.log(response.razorpay_payment_id);
            // 🔹 Create booking after successful payment
            const bookingRes = await apiClient.post(CREATE_BOOKING, {
              paymentId: response.razorpay_payment_id,
              price: tourdata.price,
              userId: userInfo._id,
              userName: name,
              userEmail: userInfo.email,
              userPhone: phone,
              tourData: tourdata,
              tourDate: new Date(),
              numberOfPeople: groupsize,
            });
            if (bookingRes.status === 200) {
              AddBookingData(bookingRes.data.data);
              toast.success("Booking confirmed successfully!");
            } else {
              toast.error(
                "Payment succeeded, but booking failed. Please contact support."
              );
            }
          } catch (error) {
            console.error("Error in payment processing:", error);
            toast.error("Something went wrong. Please try again.");
          }
        },

        prefill: {
          name: name,
          email: userInfo.email,
          contact: phone,
        },
        notes: {
          address: userInfo.address,
        },
        theme: {
          color: "#3399cc",
        },
      };

      // ✅ Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Payment failed. Please try again.");
    }
  };
  return (
    <div>
      <div className="lg:grid flex flex-col lg:grid-cols-3 gap-4 w-[90vw]  m-auto mt-4">
        <div className="lg:col-span-2 space-y-6">
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
        <div className="lg:col-span-1 border border-gray-300 h-[87vh] rounded-md p-4 flex flex-col lg:sticky top-5">
          {/* Price and Rating */}
          <div className="flex justify-between flex-row py-9 border-b border-b-gray-300">
            <p>
              <span className="font-bold text-xl">${tourdata.price}</span> / Per
              Person
            </p>
            <p className="flex flex-row items-center gap-2 text-xl">
              <AiFillStar className="text-[orange]" /> {tourdata.rating}
            </p>
          </div>

          {/* Information Section */}
          <div className="mt-5 flex-grow">
            <h1 className="text-xl">Information</h1>
            <div className="border border-gray-300 p-6 flex flex-col gap-5">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="outline-none border-b border-b-gray-300"
                placeholder="Full Name"
              />
              <input
                type="text"
                className="outline-none border-b border-b-gray-300 my-4"
                value={phone}
                onChange={(e) => SetPhone(e.target.value)}
                placeholder="Mobile Number"
              />
              <div className="flex flex-row justify-between">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => SetDate(e.target.value)}
                  className="outline-none border-b border-b-gray-300"
                />
                <input
                  type="number"
                  value={groupsize}
                  onChange={(e) => SetGroupSize(e.target.value)}
                  className="outline-none border-b border-b-gray-300"
                  placeholder="Group Size"
                />
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div>
            <div className="flex flex-row justify-between px-5 mt-4 font-semibold text-gray-500">
              <p className="flex flex-row gap-2 items-center">
                ${tourdata.price} <IoClose /> 1 Person
              </p>
              <p>${tourdata.price}</p>
            </div>
            <div className="flex flex-row justify-between px-5 mt-4 font-semibold text-gray-500">
              <p className="flex flex-row gap-2 items-center">Taxes</p>
              <p>${tourdata.tax}</p>
            </div>
            <div className="flex flex-row justify-between px-5 mt-4 font-semibold">
              <p className="flex flex-row gap-2 items-center">Total</p>
              <p>
                $
                {tourdata.price * (groupsize < 1 ? 1 : groupsize) +
                  tourdata.tax}
              </p>
            </div>

            {/* Book Now Button */}
            <button
              onClick={handlePayment}
              className="cursor-pointer flex items-center justify-center mt-4 w-full py-3 px-5 text-center font-semibold rounded-3xl bg-[orange] text-white"
            >
              Book Now
            </button>
          </div>
        </div>

        <TourReview TourId={tourdata._id} TourData={tourdata} userId={userInfo._id} userName={userInfo.name} />
      </div>
    </div>
  );
};

export default TourDatail;
