import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../../lib/api-Client";
import { DELETE_TOUR, GET_TOUR } from "../../Utils/Constant";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import EditTourModel from "../../Components/EditTourModel";
import CreateTour from "../../Components/CreateTour";

const Tours = () => {
  const [Tour, SetTour] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState({});
  const [visibleModel, setVisibleModel] = useState();
  const [TourModel, SetTourModel] = useState();
  useEffect(() => {
    const FetchBooking = async () => {
      try {
        const response = await apiClient.get(`${GET_TOUR}`);

        if (response.status === 200) {
          SetTour(response.data.data);
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
  const CloseNewTourModel = () => {
    SetTourModel(!TourModel);
  };
  const extractPublicIdFromUrl = (url) => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.split(".")[0];
  };
  const DeleteTour = async (id, _id) => {
    try {
      const response = await apiClient.post(
        `${DELETE_TOUR}/${extractPublicIdFromUrl(id)}`,
        {
          _id,
        }
      );
      if (response.status == 200) {
        toast.success("Tour Deleted Successfully");
        SetTour((prevTour) => prevTour.filter((tour) => tour._id !== _id));
      } else {
        toast.error("Some error occured try again after some time");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [show, setShow] = useState(false);
  const HideDeleteModel = () => [setShow(!show)];

  return (
    <div>
      <div>
        <div className="flex justify-evenly gap-3 py-5">
          <input
            className="border-[orange] border-2 outline-none rounded-md px-4 py-2 w-[90%]"
            type="text"
            placeholder="Search Tour"
          />
          <button
            className="text-white bg-[orange] px-5 cursor-pointer py-2 rounded-md"
            onClick={CloseNewTourModel}
          >
            New
          </button>
          {TourModel && (
            <CreateTour SetTour={SetTour} onClose={CloseNewTourModel} />
          )}
        </div>
        <div>
          <div className="mt-4 mx-auto max-w-5xl min-h-[90vh]">
            {Tour.length > 0 &&
              Tour.map((TourData, index) => (
                <div
                  key={index}
                  className={`border border-orange-400 rounded-md p-4 relative mb-6 shadow-md overflow-hidden transition-all duration-300 ${
                    expandedIndexes[index] ? "h-auto" : "h-[50%]"
                  }`}
                >
                  {/* Grid Layout for Image & Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Image Section */}
                    <div>
                      <img
                        src={TourData.images}
                        className=" h-64 object-cover w-full rounded-lg"
                        alt={TourData.title}
                      />
                    </div>

                    {/* Tour Details */}
                    <div className="p-3 flex flex-col justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                          {TourData.title}
                        </h2>
                        <p className="flex items-center text-gray-600">
                          <IoLocationOutline className="text-orange-500 text-xl mr-1" />
                          Location: {TourData.location}
                        </p>
                        <p className="text-gray-600">
                          Duration: {TourData.duration}
                        </p>
                        <p className="flex items-center text-gray-600">
                          <MdOutlineCurrencyRupee className="text-orange-500 text-xl mr-1" />
                          Price: {TourData.price}
                        </p>
                        <p className="text-gray-600">
                          Group Size: {TourData.maxCapacity}
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
                        {TourData.description}
                      </p>

                      {/* Itinerary Planning */}
                      <div className="mt-4">
                        <h3 className="font-semibold text-lg">
                          Itinerary Planning
                        </h3>
                        <div className="mt-2">
                          {TourData?.itinerary?.length > 0 ? (
                            TourData.itinerary.map((data, idx) => (
                              <p key={idx} className="text-gray-600">
                                <span className="font-medium">
                                  Day {data.day}:
                                </span>{" "}
                                {data.activity}
                              </p>
                            ))
                          ) : (
                            <p className="text-gray-500">
                              No itinerary available
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Included & Not Included Sections */}
                      <div className="mt-4 flex flex-col md:flex-row gap-8">
                        {/* Included */}
                        <div className="w-full md:w-1/2">
                          <h3 className="font-semibold text-lg">Included</h3>
                          <div className="mt-2">
                            {TourData?.included?.length > 0 ? (
                              TourData.included.map((item, idx) => (
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
                          <h3 className="font-semibold text-lg">
                            Not Included
                          </h3>
                          <div className="mt-2">
                            {TourData?.notIncluded?.length > 0 ? (
                              TourData.notIncluded.map((item, idx) => (
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
                      <div className="flex flex-row gap-2">
                        <div className="mt-2 flex gap-3">
                          <button
                            onClick={onClose}
                            className="bg-[orange] text-white px-4 py-2 rounded-md transition"
                          >
                            Update tour
                          </button>

                          <button
                            onClick={HideDeleteModel}
                            className="bg-[orange] text-white px-4 py-2 rounded-md transition"
                          >
                            Delete tour
                          </button>
                        </div>
                        {visibleModel && (
                          <EditTourModel
                            _id={TourData._id}
                            TourData={TourData}
                            onClose={onClose}
                          />
                        )}

                        {show && (
                          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-150">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                              <h2 className="text-2xl font-bold text-gray-800">
                                Are you sure?
                              </h2>
                              <p className="text-gray-600 mt-2">
                                Do you really want to Delete this tour?
                              </p>

                              <div className="mt-6 flex justify-center gap-4">
                                <button
                                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition hover:bg-gray-400"
                                  onClick={HideDeleteModel}
                                >
                                  Cancel
                                </button>

                                <button
                                  className="bg-orange-500 text-white px-4 py-2 rounded-md transition hover:bg-orange-600"
                                  onClick={() =>
                                    DeleteTour(TourData.images, TourData._id)
                                  }
                                >
                                  Confirm
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tours;
