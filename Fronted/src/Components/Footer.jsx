import React from "react";
import { TiSocialFacebookCircular } from "react-icons/ti";
import { FaYoutube, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-10 bg-gray-100 text-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 text-center md:text-left">
        
        {/* Logo and Social Icons */}
        <div>
          <img
            src="/tour-images/logo.png"
            alt="Login Image"
            className="mx-auto md:mx-0 mb-4 w-[150px]"
          />
          <p className="text-gray-600 text-sm leading-relaxed">
            Start your journey with your friends and family to make life enjoyable.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="text-2xl text-red-600 hover:text-red-700 transition-all" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-2xl text-pink-500 hover:text-pink-600 transition-all" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <TiSocialFacebookCircular className="text-2xl text-blue-600 hover:text-blue-700 transition-all" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FiTwitter className="text-2xl text-blue-400 hover:text-blue-500 transition-all" />
            </a>
          </div>
        </div>

        {/* Discover Section */}
        <div>
          <p className="font-semibold text-lg">Discover</p>
          <div className=" flex flex-col mt-3 space-y-2 text-gray-600 text-base">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/tour">Tour</Link>
          </div>
        </div>

        {/* Quick Links Section */}
        <div>
          <p className="font-semibold text-lg">Quick Links</p>
          <div className=" flex flex-col mt-3 space-y-2 text-gray-600 text-base">
            <Link to="/">Gallery</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Register</Link>
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <p className="font-semibold text-lg">Contact</p>
          <div className="mt-3 space-y-3 text-gray-600 text-base">
            <p className="flex items-center gap-3 lg:justify-start justify-center">
              <MdOutlineMail className="text-[orange] text-xl" />
              <span>support@travelworld.com</span>
            </p>
            <p className="flex items-center gap-3 lg:justify-start justify-center">
              <FaPhoneAlt className="text-[orange] text-xl" />
              <span>+91 7202001502</span>
            </p>
            <p className="flex items-center gap-3 lg:justify-start justify-center">
              <IoLocationOutline className="text-[orange] text-xl" />
              <span>Veraval, Gujarat, India</span>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <p className="mt-8 text-center text-sm text-gray-500">
        © 2025 Travel World. All Rights Reserved. Developed by 
        <span className="text-orange-500 font-semibold"> Rathod Pratik</span>
      </p>
    </footer>
  );
};

export default Footer;
