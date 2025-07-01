import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-Client";
import { DELETE_BOOKING, GET_ALL_BOOKING } from "../../Utils/Constant";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { toast } from "react-toastify";
import CheckingModel from "../../Components/CheckingModel";
import { useNavigate } from "react-router-dom";

const AdminBooking = () => {
  const navigate=useNavigate();
  const [booking, setBooking] = useState([]);
  const [FilterBookingData, SetFilterBookingData] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState({});
  const [loading,SetLoading]=useState(false)
  useEffect(() => {
    const FetchBooking = async () => {
      SetLoading(true)
      try {
        const response = await apiClient.get(`${GET_ALL_BOOKING}`,{
          withCredentials:true
        });
        console.log(response.data);
        if (response.status === 201) {
          SetFilterBookingData(response.data.getBooking);
          setBooking(response.data.getBooking);
        } else {
          toast.error("Failed to fetch Data");
        }
      } catch (error) {
        console.log(error);
      }
      finally{
        SetLoading(false)
      }
    };
    FetchBooking();
  }, []);
  const filterSearch = (searchValue) => {
    const lowerValue = searchValue.toLowerCase();
    if (lowerValue === "") {
      SetFilterBookingData(booking);
    } else {
      const filtered = booking.filter((tour) =>
        tour.tourData.title.toLowerCase().includes(lowerValue)
      );
      SetFilterBookingData(filtered);
    }
  };
  const toggleExpand = (index) => {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const DeleteBooking = async (_id) => {
    try {
      const response = await apiClient.delete(`${DELETE_BOOKING}/${_id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("Booking Delete Successfully");
        setBooking((booking) =>
          booking.filter((RemoveBooking) => RemoveBooking._id !== _id)
        );
      } else {
        toast.error("Failed to fetch Data");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("Access denied. Please login as admin.");
        return navigate("/login");
      }
      toast.error("Failed to delete booking")
    }
  };
  const [show, setShow] = useState(false);
  const HideDeleteModel = () => [setShow(!show)];
  return (
    <div className="mt-4 mx-auto min-h-[90vh]">
      <div className="flex justify-evenly gap-3 py-5">
        <input
          onChange={(e) => filterSearch(e.target.value)}
          className="border-[orange] border-2 outline-none rounded-md px-4 py-2 w-[90%]"
          type="text"
          placeholder="Search Booking"
        />
        <button className="text-white bg-[orange] px-5 cursor-pointer py-2 rounded-md">
          Search
        </button>
      </div>
      <div className="mt-4 mx-auto max-w-5xl min-h-[90vh]">
        {loading == true ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="border border-orange-300 rounded-md p-4 mb-6 shadow-md overflow-hidden animate-pulse"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Image Skeleton */}
                <div className="h-64 bg-gray-200 rounded-lg"></div>

                {/* Details Skeleton */}
                <div className="p-3 flex flex-col justify-between">
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded-full absolute bottom-4 right-4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) :(
        <>
       { FilterBookingData.length > 0 ? (
          FilterBookingData.map((TourData, index) => (
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

                    <p className="text-gray-600 mt-2 text-lg">
                      Booked by: {TourData.BookedBy}
                    </p>

                    <p className="text-gray-600 mt-2 text-lg">
                      Payment Status : {TourData.bookingStatus}
                    </p>
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={() => toggleExpand(index)}
                        className="bg-[orange] rounded-full p-3 text-white transition"
                      >
                        {expandedIndexes[index] ? (
                          <FaArrowUp />
                        ) : (
                          <FaArrowDown />
                        )}
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
                    <h3 className="font-semibold text-lg">
                      Itinerary Planning
                    </h3>
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
                          <p className="text-gray-500">
                            No inclusions available
                          </p>
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
                          <p className="text-gray-500">
                            No exclusions available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {show && (
                <CheckingModel
                  text={"Canceled Booking"}
                  onClose={HideDeleteModel}
                  functions={() => DeleteBooking(TourData._id)}
                />
              )}

              {TourData.bookingStatus === "Cancelled" && (
                <button
                  onClick={HideDeleteModel}
                  className="bg-[orange] text-white px-4 py-2 border-none mt-3 rounded-sm cursor-pointer"
                >
                  Delete Booking
                </button>
              )}
            </div>
          )
          )):(
             <div className="text-center text-gray-500 text-lg py-10">
            😕 No bookings found.
          </div>
          )
        }
          </>
          )}
        
      
      </div>
    </div>
  );
};

export default AdminBooking;
