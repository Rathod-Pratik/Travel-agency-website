import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-Client";
import { CREATE_BOOKING, GET_TOUR_DETAIL } from "../../Utils/Constant";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { useAppStore } from "../../Store";
import { toast } from "react-toastify";
import TourReview from "../../Components/TourReview";

const TourDatail = () => {
  const navigate=useNavigate();
  const { _id } = useParams();
  const [tourdata, SetTourData] = useState();
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
          setTimeout(() => {
            SetTourData(response.data.data);
          }, [2000]);
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
    if(!userInfo){
      toast.error("Please Login now")
      navigate('/login')
    }
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
            // 🔹 Create booking after successful payment
            const bookingRes = await apiClient.post(CREATE_BOOKING, {
              paymentId: response.razorpay_payment_id,
              price: tourdata.price,
              userId: userInfo._id,
              BookedBy:userInfo.name,
              userName: name,
              userEmail: userInfo.email,
              userPhone: phone,
              tourData: tourdata,
              tourDate: new Date(),
              numberOfPeople: groupsize,
            });
            if (bookingRes.status === 200) {
              AddBookingData(bookingRes.data.data);
              setName("");
              SetGroupSize("")
              SetDate("")
              SetPhone("")
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
      {typeof tourdata =='undefined' ? (<div className="lg:grid flex flex-col lg:grid-cols-3 gap-4 w-[90vw] m-auto mt-4">
  {/* Main Content (Left Side - col-span-2) */}
  <div className="lg:col-span-2 space-y-6">
    {/* Image Skeleton */}
    <div className="overflow-hidden rounded-lg shadow-lg bg-gray-200 h-96 animate-pulse relative">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
    </div>

    {/* Tour Details Skeleton */}
    <div className="p-6 flex justify-start flex-col border border-gray-200 rounded-lg shadow-md bg-white">
      {/* Title Skeleton */}
      <div className="h-8 w-3/4 bg-gray-200 rounded-full animate-pulse mb-4"></div>
      
      {/* Location Skeleton */}
      <div className="h-6 w-1/2 bg-gray-200 rounded-full animate-pulse mb-6"></div>
      
      {/* Pricing & Details Skeleton */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-5 w-28 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      
      {/* Description Skeleton */}
      <div className="space-y-2 mb-6">
        <div className="h-4 w-full bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-4 w-11/12 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-4 w-10/12 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-4 w-9/12 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      
      {/* Included/Not Included Skeleton */}
      <div className="flex justify-between w-[50%] mb-6">
        <div className="space-y-2">
          <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse mb-2"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 w-24 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse mb-2"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 w-28 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* Itinerary Skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-32 bg-gray-200 rounded-full animate-pulse mb-2"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 w-full bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>

  {/* Sidebar (Right Side - col-span-1) */}
  <div className="lg:col-span-1 border border-gray-200 h-[87vh] rounded-md p-4 flex flex-col lg:sticky top-5">
    {/* Price and Rating Skeleton */}
    <div className="flex justify-between py-9 border-b border-gray-200">
      <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
    </div>
    
    {/* Information Section Skeleton */}
    <div className="mt-5 flex-grow">
      <div className="h-6 w-28 bg-gray-200 rounded-full animate-pulse mb-4"></div>
      <div className="border border-gray-200 p-6 space-y-4">
        <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
        <div className="flex justify-between gap-4">
          <div className="h-10 w-1/2 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-10 w-1/2 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
    
    {/* Pricing Summary Skeleton */}
    <div className="space-y-4">
      <div className="flex justify-between px-5">
        <div className="h-5 w-32 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      <div className="flex justify-between px-5">
        <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      <div className="flex justify-between px-5">
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      
      {/* Book Now Button Skeleton */}
      <div className="h-12 w-full bg-gray-300 rounded-3xl animate-pulse mt-4"></div>
    </div>
  </div>

  {/* Reviews Section Skeleton - You can add this if needed */}
</div>):(<div className="lg:grid flex flex-col lg:grid-cols-3 gap-4 w-[90vw]  m-auto mt-4">
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
      </div>)}
      
    </div>
  );
};

export default TourDatail;
