import React, { useState } from "react";
import { ADD_CONTECT } from "../Utils/Constant";
import { apiClient } from "../lib/api-Client";
import {toast} from 'react-toastify'
import { useAppStore } from "../Store";
import { useNavigate } from "react-router-dom";
const Contect = () => {
const navigate=useNavigate()
  const {userInfo}=useAppStore();

  const[contectData,SetContectData]=useState({
    name:"",
    email:"",
    mobile_no:"",
    message:""
  })

  const SendContect = async () => {
    if(!userInfo){
toast.error("Please Login now")
      return navigate('/login')
    }
    // Validation for name (length should be more than 5)
    if (!contectData.name || contectData.name.length < 5) {
      return toast.error("Please enter your full name");
    }
  
    // Validation for mobile number (length should be 10)
    if (!contectData.mobile_no || contectData.mobile_no.length < 10  ) {
      return toast.error("Please enter your mobile number");
    }
    if (contectData.mobile_no.length >= 11 ) {
      return toast.error("Please enter your valid mobile number");
    }
  
    // Validation for message (length should be more than 20 characters)
    if (!contectData.message || contectData.message.length < 20) {
      return toast.error("Message length must be more than 20 characters");
    }
  
    // Validating email (if the email is in correct format)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(contectData.email)) {
      return toast.error("Please enter a valid email address");
    }
  
    try {
      // API request to save the contact data
      const response = await apiClient.post(ADD_CONTECT, {
        name: contectData.name,
        email: contectData.email,
        mobile_no: contectData.mobile_no,
        message: contectData.message,
        userData:userInfo
      });
  
      // Check response status
      if (response.status === 200) {
        toast.success("Contact saved successfully");
        toast.success("We will contact you soon");
        SetContectData({
          name:"",
          email:"",
          mobile_no:"",
          message:""
        })
      } else {
        toast.error("Failed to add contact");
      }
    } catch (error) {
      // Catch errors and show them as toast error
      toast.error(error.message || "An unexpected error occurred");
    }
  };
  

  return (
    <div className="w-full md:w-[40%] mx-auto pb-6" data-aos="zoom-out">
      {/* Title */}
      <p className="text-2xl bg-[orange] px-4 py-2 text-white inline-block hero-title rounded-[50px] shadow-md mb-6 mx-auto text-center">
        Contect Us
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
        value={contectData.name}
        onChange={(e) =>
          SetContectData((prevState) => ({
            ...prevState,
            name: e.target.value, // Update only the name property
          }))
        }
        
          type="text"
          placeholder="Name"
          className="border-b border-gray-300 outline-none focus:border-[orange] transition-all py-2 px-1 text-gray-800 rounded-[5px]"
        />
        <input
         value={contectData.email}
         onChange={(e) =>
          SetContectData((prevState) => ({
            ...prevState,
            email: e.target.value, // Update only the name property
          }))
        }
          type="email"
          placeholder="Email"
          className="border-b border-gray-300 outline-none focus:border-[orange] transition-all py-2 px-1 text-gray-800 rounded-[5px]"
        />
        <input
        minLength={10}
        maxLength={10}
          value={contectData.mobile_no}
          onChange={(e) =>
            SetContectData((prevState) => ({
              ...prevState,
              mobile_no: e.target.value, // Update only the name property
            }))
          }
          type="tel"
          placeholder="Phone"
          className="border-b border-gray-300 outline-none focus:border-[orange] transition-all py-2 px-1 text-gray-800 rounded-[5px]"
        />
        <textarea
          value={contectData.message}
          onChange={(e) =>
            SetContectData((prevState) => ({
              ...prevState,
              message: e.target.value, // Update only the name property
            }))
          }
          placeholder="Message"
          className="border-b border-gray-300 outline-none focus:border-[orange] transition-all py-2 px-1 text-gray-800 rounded-[5px] resize-none h-[100px]"
        ></textarea>
      </div>

      {/* Submit Button */}
      <button onClick={SendContect} className="mt-6 px-4 bg-[orange] text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-all">
        Submit
      </button>
    </div>
  );
};

export default Contect;
