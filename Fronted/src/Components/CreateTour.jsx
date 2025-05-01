import React, { useState } from "react";
import { apiClient } from "../lib/api-Client";
import { CREATE_TOUR } from "../Utils/Constant";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateTour = ({ onClose,SetTour }) => {
  const navigate=useNavigate();
  const [preview, setPreview] = useState("");
  const [selectedfile, setSelectedFile] = useState();
  const [formData, setFormData] = useState({
    description: "",
    duration: "",
    images: "",
    location: "",
    maxCapacity: "",
    price: "",
    rating: "",
    tax: "",
    title: "",
    included: ["Included in Tour"],
    notIncluded: ["Not Included in Tour"],
    itinerary: [{ activity: "Add Travel Activity" }],
    durationDays: "1",
    durationNights: "1",
  });

  
  const UploadTour = async () => {
    const TourData = new FormData();
    TourData.append("description", formData.description);
    TourData.append("duration", formData.duration);
    TourData.append("location", formData.location);
    TourData.append("maxCapacity", formData.maxCapacity);
    TourData.append("price", formData.price);
    TourData.append("tax", formData.tax);
    TourData.append("title", formData.title);
    TourData.append("included", JSON.stringify(formData.included));
    TourData.append("notIncluded", JSON.stringify(formData.notIncluded));
    TourData.append("itinerary", JSON.stringify(formData.itinerary));
    TourData.append("images", selectedfile);
  
    try {
      const response = await apiClient.post(
        CREATE_TOUR,
        TourData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials:true
        }
      );
  
      if (response.status === 201) {
        toast.success("Tour uploaded successfully");
        SetTour((prevTours) => [...prevTours, response.data.data]);
        onClose()
      } else {
        toast.error("Some error occurred, try again later");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("Access denied. Please login as admin.");
        return navigate("/login");
      }
      console.log("Failed to upload tour");
    }
  };
  

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  // use for input single value
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // use for input multiple value
  const handleInputChanges = (type, index, value) => {
    const updatedList = [...formData[type]];

    if (type === "itinerary") {
      updatedList[index] = { activity: value };
    } else {
      updatedList[index] = value;
    }

    setFormData({ ...formData, [type]: updatedList });
  };

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    // Update combined duration string
    updatedFormData.duration = `${updatedFormData.durationDays} Days, ${updatedFormData.durationNights} Nights`;

    // Update itinerary based on durationDays
    const daysCount = parseInt(updatedFormData.durationDays) || 0;
    let currentItinerary = [...formData.itinerary];

    if (daysCount > currentItinerary.length) {
        for (let i = currentItinerary.length; i < daysCount; i++) {
          currentItinerary.push({ day: i + 1, activity: "" });
        }
      } else if (daysCount < currentItinerary.length) {
        currentItinerary = currentItinerary.slice(0, daysCount);
      }

    updatedFormData.itinerary = currentItinerary;
    setFormData(updatedFormData);
  };

  const handleAddInput = (type) => {
    if (type === "itinerary") {
        updatedList[index] = { ...updatedList[index], activity: value };
      }
      const newItem = type === "itinerary" ? { activity: "" } : ""; // ✅
      setFormData({ ...formData, [type]: [...formData[type], newItem] });
    setFormData({ ...formData, [type]: [...formData[type], newItem] });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[12px] bg-opacity-50 z-150 p-5">
      <div className="bg-white p-6 rounded-lg shadow-lg lg:w-[60vw] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Create Tour</h2>

        {/* Image Upload */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {preview ? (
            <img
              src={preview}
              alt="Uploaded Preview"
              className="lg:w-[50%] h-full object-cover rounded-lg"
            />
          ) : (
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center lg:w-[50%] h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 
                               5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 
                               4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          )}

          {/* Basic Info */}
          <div className="flex-1 ">
            {["Title", "Location", "Price", "Tax"].map((label) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type="text"
                  name={label.toLowerCase()}
                  value={formData[label.toLowerCase()]}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Description and Capacity */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded mb-2"
          />

          <label className="block text-sm font-medium text-gray-700">
            Seats
          </label>
          <input
            type="text"
            name="maxCapacity"
            value={formData.maxCapacity}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Included / Not Included */}
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
        {/* <div className="flex flex-col justify-evenly lg:flex-row gap-4"> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Included
              </label>
              {formData.included.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleInputChanges("included", index, e.target.value)
                  }
                  className="w-full border p-2 rounded mb-2"
                />
              ))}
              <button
                type="button"
                onClick={() => handleAddInput("included")}
                className="bg-[orange] text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
              >
                Add
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Not Included
              </label>
              {formData.notIncluded.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleInputChanges("notIncluded", index, e.target.value)
                  }
                  className="w-full border p-2 rounded mb-2"
                />
              ))}
              <button
                type="button"
                onClick={() => handleAddInput("notIncluded")}
                className="bg-[orange] text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
              >
                Add
              </button>
            </div>
          {/* </div> */}
        </div>

        {/* Duration */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Duration
          </label>
          <div className="flex flex-row gap-4">
            <input
              placeholder={`${formData.durationDays} Days`}
              type="number"
              name="durationDays"
              onChange={handleDurationChange}
              className="border p-2 rounded w-full"
            />
            <input
              placeholder={`${formData.durationNights} Nights`}
              type="number"
              name="durationNights"
              onChange={handleDurationChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Itinerary */}
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Itinerary
          </label>
          {formData.itinerary.map((data, index) => (
            <div key={index} className="flex flex-row gap-2 items-center mb-2">
              <p className="border p-2 text-sm rounded w-20 text-center">
                Day {index + 1}
              </p>
              <input
                type="text"
                placeholder={data.activity}
                onChange={(e) =>
                  handleInputChanges("itinerary", index, e.target.value)
                }
                className="w-full border p-2 rounded"
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button onClick={UploadTour} className="bg-[orange] cursor-pointer text-white px-4 py-2 rounded-md hover:bg-orange-500 transition">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTour;
