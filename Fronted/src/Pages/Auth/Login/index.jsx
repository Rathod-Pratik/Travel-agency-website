import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN } from "../../../Utils/Constant";
import { apiClient } from "../../../lib/api-Client";
import { useAppStore } from "../../../Store";
import { toast } from "react-toastify";

const Login = () => {
  const {setUserInfo}=useAppStore();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate=useNavigate();

  const HandleLogin= async () => {
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
  
    try {
      const response = await apiClient.post(LOGIN, {
        email: email, // Ensure email is included
        password: password,
      });
  console.log(response.data.user);
      if (response.status === 200) {
        navigate("/");
        setUserInfo(response.data.user);
        toast.success("Login successful!");
      }
      else{
        toast.error("Please enter Valid Credintails");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error( "Please enter valid credentials.");
      } else {
        toast.error( error.response?.data?.message || "Login failed. Please try again.");
      }
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center">
  <div className="m-auto flex flex-row justify-center gap-8 w-full md:w-[60vw] relative">
    
    {/* Image: Hidden on small screens, visible on medium & large */}
    <div className="hidden md:block">
      <img 
        src="/tour-images/login.png" 
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
        <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
      </div>
      
      <div className="space-y-4 px-6 mt-8">
        <input
          type="text"
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
        <button onClick={HandleLogin} className="bg-[#0b2727] cursor-pointer text-white px-4 py-2 rounded-lg w-full hover:bg-[#083c3c] transition">
          Login
        </button>
      </div>
      <p className="text-center mt-4"><span className="text-white">Don't have an account?</span><Link to='/signup' className="hover:border-b"> Register</Link></p>
    </div>

  </div>
</div>
  );
};

export default Login;
