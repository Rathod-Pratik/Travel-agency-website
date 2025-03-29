import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-Client";
import { CANCEL_BOOKING, GET_BOOKING } from "../../Utils/Constant";
import { useAppStore } from "../../Store";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import EditBookingModal from "../../Components/EditBookingModal";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import CheckingModel from "../../Components/CheckingModel";

const Booking = () => {
  const { userInfo, setBooking, booking, removeBooking } = useAppStore();
  const [expandedIndexes, setExpandedIndexes] = useState({});
  const [visibleModel, setVisibleModel] = useState();
  const [CheckModel, setCheckeModel] = useState();
  useEffect(() => {
    const FetchBooking = async () => {
      try {
        const response = await apiClient.get(`${GET_BOOKING}/${userInfo._id}`);
        if (response.status === 201) {
          setBooking(response.data.getBooking);
        } else {
          toast.error("Failed to fetch Data");
        }
      } catch (error) {
        console.log(error);
      }
    };
    FetchBooking();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the specific card
    }));
  };
  const onClose = async () => {
    setVisibleModel(!visibleModel);
  };
  const CloseCheckModel = () => {
    setCheckeModel(!CheckModel);
  };

  const CancelBooking = async (paymentId, totalPrice, _id) => {
    try {
      const response = await apiClient.post("payment/refund", {
        payment_id: paymentId,
        amount: totalPrice,
      });
      if (response.status === 200) {
        const response = await apiClient.post(`${CANCEL_BOOKING}/${_id}`);
        if (response.status === 201) {
          removeBooking(_id);
          toast.success("your tour cancel successfully");
          toast.success(
            "Refund initiated successfully! Amount will be transferred in 5-7 working days."
          );
        }
      } else {
        toast.error("Failed to cancel booking");
      }
    } catch (error) {
      toast.error("some error occured try again after some time");
    }
  };
  return (
    <div className="mt-4 mx-auto w-[95vw] max-w-5xl min-h-[90vh]">
      {booking.length > 0 ? (
        booking.map((TourData, index) => (
          <div
            key={index}
            className={`border border-orange-400 rounded-md p-4 relative mb-6 shadow-md overflow-hidden transition-all duration-300 ${
              expandedIndexes[index] ? "h-auto" : "h-[50%]"
            }`}
          >
            {/* Grid Layout for Image & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Section */}
              <div>
                <img
                  src={TourData.tourData.images}
                  className="w-full h-64 object-cover rounded-lg"
                  alt={TourData.tourData.title}
                />
              </div>

              {/* Tour Details */}
              <div className="p-3 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {TourData.tourData.title}
                  </h2>
                  <p className="flex items-center text-gray-600">
                    <IoLocationOutline className="text-orange-500 text-xl mr-1" />
                    Location: {TourData.tourData.location}
                  </p>
                  <p className="text-gray-600">
                    Duration: {TourData.tourData.duration}
                  </p>
                  <p className="text-gray-600">
                    Date:{" "}
                    {new Date(TourData.tourDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <MdOutlineCurrencyRupee className="text-orange-500 text-xl mr-1" />
                    Price: {TourData.tourPrice}
                  </p>
                  <p className="text-gray-600">
                    Group Size: {TourData.numberOfPeople}
                  </p>
                  <p className="text-gray-600 mt-2 text-lg">
                    Ticket for: {TourData.userName}
                  </p>
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={() => toggleExpand(index)}
                      className="bg-[orange] rounded-full p-3 text-white transition"
                    >
                      {expandedIndexes[index] ? <FaArrowUp /> : <FaArrowDown />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {expandedIndexes[index] && (
              <>
                <p className="mt-4 text-gray-700">
                  {TourData.tourData.description}
                </p>

                {/* Itinerary Planning */}
                <div className="mt-4">
                  <h3 className="font-semibold text-lg">Itinerary Planning</h3>
                  <div className="mt-2">
                    {TourData.tourData?.itinerary?.length > 0 ? (
                      TourData.tourData.itinerary.map((data, idx) => (
                        <p key={idx} className="text-gray-600">
                          <span className="font-medium">Day {data.day}:</span>{" "}
                          {data.activity}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-500">No itinerary available</p>
                    )}
                  </div>
                </div>

                {/* Included & Not Included Sections */}
                <div className="mt-4 flex flex-col md:flex-row gap-8">
                  {/* Included */}
                  <div className="w-full md:w-1/2">
                    <h3 className="font-semibold text-lg">Included</h3>
                    <div className="mt-2">
                      {TourData.tourData?.included?.length > 0 ? (
                        TourData.tourData.included.map((item, idx) => (
                          <p key={idx} className="text-gray-600">
                            ✔ {item}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-500">No inclusions available</p>
                      )}
                    </div>
                  </div>

                  {/* Not Included */}
                  <div className="w-full md:w-1/2">
                    <h3 className="font-semibold text-lg">Not Included</h3>
                    <div className="mt-2">
                      {TourData.tourData?.notIncluded?.length > 0 ? (
                        TourData.tourData.notIncluded.map((item, idx) => (
                          <p key={idx} className="text-gray-600">
                            ✖ {item}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-500">No exclusions available</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="mt-2">
                    <button
                      onClick={CloseCheckModel}
                      className="bg-[orange] text-white px-4 py-2 rounded-md transition"
                    >
                      Cancel tour
                    </button>
                    {CheckModel && (
                      <CheckingModel
                        onClose={CloseCheckModel}
                        CancelBooking={() =>
                          CancelBooking(
                            TourData.paymentId,
                            TourData.totalPrice,
                            TourData._id
                          )
                        }
                      />
                    )}
                  </div>

                  <div className="mt-2">
                    <button
                      onClick={onClose}
                      className="bg-[orange] text-white px-4 py-2 rounded-md transition"
                    >
                      Update tour
                    </button>
                  </div>
                  {visibleModel && (
                    <EditBookingModal _id={TourData._id} onClose={onClose} />
                  )}
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center text-center h-[70vh]">
          <h1 className="text-5xl font-bold text-orange-500">
            No Tours Booked Yet!
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-md">
            Discover amazing destinations and plan your next adventure with us.
            Click below to explore our tour packages and book your trip today!
          </p>

          <Link
            to="/tour"
            className="mt-6 px-6 py-3 text-white bg-orange-500 rounded-md text-lg font-semibold transition duration-300 hover:bg-orange-600"
          >
            Explore Tours
          </Link>
        </div>
      )}
    </div>
  );
};

export default Booking;
