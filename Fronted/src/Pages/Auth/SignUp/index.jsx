import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { apiClient } from "../../../lib/api-Client";
import { SIGNUP } from "../../../Utils/Constant";
import { toast } from "react-toastify";
import { useAppStore } from "../../../Store";

const SignUp = () => {
  const {setUserInfo}=useAppStore();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate=useNavigate();

  const HandleSignUp = async () => {
    // Input Validation
    if (!name || name.length < 5) {
      toast.success("Name must be at least 5 characters long.");
      return;
    }
  
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
  
    if(!email){
     return  toast.error("Please Enter Email")
    }

    try {
      const response = await apiClient.post(SIGNUP, {
        name: name,
        email: email, // Ensure email is included
        password: password,
      });
  
      if (response.status === 200) {
        toast.success("Signup successful!");
        setUserInfo(response.data.user)
        navigate("/");
      } else if (response.status === 400) {
        toast.error("User already exists.");
      }
    } catch (error) {

      const {data,status}=error.response;
      if(data.AlreadyExist && status==400){
        toast.error("User Already Exist with this email")
      }
      else{
        toast.error("Some error occured try again after some time.");
        console.log("Signup failed:", error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <div className="m-auto flex flex-row justify-center gap-8 w-full md:w-[60vw] relative">
        {/* Image: Hidden on small screens, visible on medium & large */}
        <div className="hidden lg:block">
          <img
            src="/tour-images/register.png"
            className="w-[450px] h-[450px] object-cover max-w-full"
            alt="Login Illustration"
          />
        </div>

        {/* Login Form */}
        <div className="relative py-6 shadow-md bg-[orange] rounded-lg w-full max-w-md">
          {/* User Image: Half inside & half outside */}
          <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2">
            <img
              className="w-[100px] h-[100px] rounded-full border-4 border-white shadow-lg"
              src="/tour-images/user.png"
              alt="User Icon"
            />
          </div>

          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold text-gray-800">Register</h2>
          </div>

          <div className="space-y-4 px-6 mt-4">
            <input
              type="text"
              className="bg-white border border-gray-300 rounded-lg w-full p-3 outline-none"
              placeholder="Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
            <input
              type="email"
              className="bg-white border border-gray-300 rounded-lg w-full p-3 outline-none"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <input
              type="password"
              className="bg-white border border-gray-300 rounded-lg w-full p-3 outline-none"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <button onClick={HandleSignUp} className="bg-[#0b2727] cursor-pointer text-white px-4 py-2 rounded-lg w-full hover:bg-[#083c3c] transition">
            Register
            </button>
          </div>
          <p className="text-center mt-4">
            <span className="text-white">Already have account?</span>
            <Link to="/login" className="hover:border-b">
              {" "}
              Login Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;