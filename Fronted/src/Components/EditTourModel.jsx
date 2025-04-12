import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../lib/api-Client";
import { useAppStore } from "../Store";
import { UPDATE_BOOKING, UPDATE_TOUR } from "../Utils/Constant";

const EditTourModel = ({ onClose, TourData, SetTour }) => {
  const [preview, setPreview] = useState("");
  const [selectedfile, setSelectedFile] = useState();
  const [formData, setFormData] = useState({
    ...TourData,
    included: TourData.included || [""],
    notIncluded: TourData.notIncluded || [""],
    itinerary: TourData.itinerary || [{ activity: "" }],
    durationDays: TourData.duration?.split(" ")[0] || "",
    durationNights: TourData.duration?.split(" ")[2] || "",
  });
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };
  //   use for input single value
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //   use for input multiple value
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

    // If more days, add empty slots
    if (daysCount > currentItinerary.length) {
      for (let i = currentItinerary.length; i < daysCount; i++) {
        currentItinerary.push({ activity: "" });
      }
    }
    // If fewer days, remove extra days but keep the remaining
    else if (daysCount < currentItinerary.length) {
      currentItinerary = currentItinerary.slice(0, daysCount);
    }

    updatedFormData.itinerary = currentItinerary;

    setFormData(updatedFormData);
  };
  const handleAddInput = (type) => {
    let newItem = type === "itinerary" ? { activity: "" } : "";
    setFormData({ ...formData, [type]: [...formData[type], newItem] });
  };

  const extractPublicIdFromUrl = (url) => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.split(".")[0];
  };
  const updateTour = async () => {
    const UpdateTourData = new FormData();
    UpdateTourData.append("description", formData.description);
    UpdateTourData.append("duration", formData.duration);
    UpdateTourData.append("location", formData.location);
    UpdateTourData.append("maxCapacity", formData.maxCapacity);
    UpdateTourData.append("price", formData.price);
    UpdateTourData.append("tax", formData.tax);
    UpdateTourData.append("title", formData.title);
    UpdateTourData.append("included", JSON.stringify(formData.included));
    UpdateTourData.append("notIncluded", JSON.stringify(formData.notIncluded));
    UpdateTourData.append("itinerary", JSON.stringify(formData.itinerary));
    UpdateTourData.append("images", selectedfile);
    UpdateTourData.append("_id", TourData._id);

    try {
      const response = await apiClient.put(
        `${UPDATE_TOUR}/${extractPublicIdFromUrl(TourData.images)}`,
        UpdateTourData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Tour Updated successfully");
        const updatedTour = response.data.data;
        SetTour((prevTours) =>
          prevTours.map((tour) =>
            tour._id === updatedTour._id ? updatedTour : tour
          )
        );
        onClose();
      } else {
        toast.error("Failed to Update Tour");
      }
    } catch (error) {
      toast.error("Some error occurred");
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[12px] bg-opacity-50 z-150 p-5">
      <div className="bg-white p-6 rounded-lg shadow-lg lg:w-[50vw] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Tour Details</h2>
        <div className="flex flex-col md:flex-row justify-evenly gap-4">
          {/* Image */}
          <div>
            <div className="flex items-center justify-center w-full mt-3">
              <div className="w-full h-64 rounded-lg overflow-hidden relative group">
                <img
                  src={preview ? preview : TourData.images}
                  alt="Uploaded Preview"
                  className="w-full h-full object-cover rounded-lg"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="cursor-pointer text-white bg-[orange] px-4 py-2 rounded hover:bg-orange-700 transition">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Form data */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              defaultValue={TourData.title}
              value={formData.title}
              onChange={(e) => handleInputChange(e)}
              className="w-full border p-2 rounded mb-2"
            />

            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              defaultValue={TourData.location}
              type="text"
              name="location"
              value={formData.location}
              onChange={(e) => handleInputChange(e)}
              className="w-full border p-2 rounded mb-2"
            />

            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>

            <input
              defaultValue={TourData.price}
              type="text"
              name="price"
              value={formData.price}
              onChange={(e) => handleInputChange(e)}
              className="w-full border p-2 rounded mb-2"
            />

            <label className="block text-sm font-medium text-gray-700">
              Tax
            </label>

            <input
              type="text"
              defaultValue={TourData.tax}
              name="tax"
              value={formData.tax}
              onChange={(e) => handleInputChange(e)}
              className="w-full border p-2 rounded mb-2"
            />
          </div>
        </div>
        {/* Description */}
        <div className="w-[89%] m-auto">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            type="text"
            name="description"
            defaultValue={TourData.description}
            value={formData.description}
            onChange={(e) => handleInputChange(e)}
            className="w-full border p-2 rounded mb-2"
          />

          <label className="block text-sm font-medium text-gray-700">
            Seats
          </label>
          <input
            type="text"
            name="maxCapacity"
            defaultValue={TourData.maxCapacity}
            value={formData.maxCapacity}
            onChange={(e) => handleInputChange(e)}
            className="w-full border p-2 rounded mb-2"
          />
          {/* Included or not included */}
          <div className="flex flex-col lg:flex-row gap-4">
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration
            </label>

            <input
              placeholder={`${formData.durationDays} Days`}
              type="number"
              name="durationDays"
              // value={formData.durationDays}
              onChange={handleDurationChange}
              className=" border p-2 rounded mb-2"
            />

            <input
              placeholder={`${formData.durationNights} Nights`}
              type="number"
              name="durationNights"
              onChange={handleDurationChange}
              className=" border p-2 rounded mb-2"
            />
          </div>
          {/*Itinerary  */}
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Itinerary
            </label>
            {formData.itinerary.map((data, index) => (
              <div
                key={index}
                className="flex flex-row gap-2 items-center mb-2"
              >
                <p className="border p-2 text-sm rounded w-20 text-center">
                  Day {index + 1}
                </p>
                <input
                  type="text"
                  value={data.activity}
                  onChange={(e) =>
                    handleInputChanges("itinerary", index, e.target.value)
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={updateTour}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTourModel;
