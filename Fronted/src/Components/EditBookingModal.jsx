import React, { useState } from "react";
import { apiClient } from "../lib/api-Client";
import { UPDATE_BOOKING } from "../Utils/Constant";
import { useAppStore } from "../Store";
import { toast } from "react-toastify";

const EditBookingModal = ({ onClose, _id}) => {
  
  const { updateBooking } = useAppStore();
  const [formData, setFormData] = useState({
    userName: "",
    userPhone: "",
    tourDate: "",
  });
  const UpateTour = async () => {
    try {
      const response = await apiClient.put(UPDATE_BOOKING, {
        _id: _id,
        userName: formData.userName,
        userPhone: formData.userPhone,
        tourDate: formData.tourDate,
      });
      if (response.status === 200) {
        toast.success("Detail updated successfully");
        updateBooking(response.data.updatedBooking);
      } else {
        toast.error("Failed to update details");
      }
    } catch (error) {
      console.log(error);
      toast.error("some error occured try again after some time");
    } finally {
      onClose();
    }
  };
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[12px] bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Booking</h2>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="email"
          name="userName"
          value={formData.userName}
          onChange={(e) => handleInputChange(e)}
          className="w-full border p-2 rounded mb-2"
        />

        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          name="userPhone"
          value={formData.userPhone}
          onChange={(e) => handleInputChange(e)}
          className="w-full border p-2 rounded mb-2"
        />

        <label className="block text-sm font-medium text-gray-700">
          Tour Date
        </label>
        <input
          type="date"
          name="tourDate"
          value={formData.tourDate}
          onChange={(e) => handleInputChange(e)}
          className="w-full border p-2 rounded mb-2"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={UpateTour}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
