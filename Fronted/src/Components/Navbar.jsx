import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAppStore } from "../Store";
import { FaPaperPlane } from "react-icons/fa";

const Navbar = () => {
  const { userInfo,booking } = useAppStore();

  const location = useLocation();

  const [isOpen, SetIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const ShowNavbar = () => {
    SetIsOpen(!isOpen);
    console.log("Show navbar");
  };
  const hideNavbar = () => {
    SetIsOpen(false);
  };
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const getBackgroundColor = (name) => {
    const colors = ["bg-[orange]"];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Makes the scroll smooth
    });
  }
  
  return (
    <header className={`bg-white sticky top-0 z-50 ${isScrolled ? "shadow-md" : ""} `}>
      <div className="container flex justify-between w-[90%] h-16 mx-auto">
        <Link
          to="/"
          aria-label="Back to homepage"
          className="flex items-center p-2"
        >
          <img
            height="100"
            width="100"
            className="rounded-[50%] mt-2"
            src="/tour-images/logo-travel2.jpg"
            alt="Logo"
          />
        </Link>
        <ul
          className={`z-50 flex flex-col font-semibold md:flex-row items-center md:static bg-white left-0 absolute m-auto md:w-auto transition-all duration-500 ease-in-out gap-3 w-full ${
            isOpen ? "!top-16 h-[205px] rounded shadow-lg" : "top-[-100vh]"
          }`}
        >
          <li className="flex">
            <Link
              to="/"
              onClick={()=>(hideNavbar(),scrollToTop())}
              className={`flex items-center px-4 ${
                location.pathname === "/" ? "text-[Orange]" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li className="flex">
            <Link
              onClick={()=>(hideNavbar(),scrollToTop())}
              to="/about"
              className={`flex items-center px-4 ${
                location.pathname === "/about" ? "text-[Orange]" : ""
              }`}
            >
              About
            </Link>
          </li>
          <li className="flex">
            <Link
              onClick={()=>(hideNavbar(),scrollToTop())}
              to="/tour"
              className={`flex items-center px-4 ${
                location.pathname === "/tour" ? "text-[Orange]" : ""
              }`}
            >
              Tour
            </Link>
          </li>
          <li className="flex">
            <Link
              onClick={()=>(hideNavbar(),scrollToTop())}
              to="/blog"
              className={`flex items-center px-4 ${
                location.pathname === "/blog" ? "text-[Orange]" : ""
              }`}
            >
              Blog
            </Link>
          </li>
          <div className="items-center flex-shrink-0 gap-3 md:hidden">
            {userInfo ? (
              <div className="flex flex-row gap-2 items-center">
                <Link
                  to="/account"
                  className={`w-8 h-8 flex justify-center items-center text-lg font-bold text-white rounded-full ${getBackgroundColor(
                    userInfo.name
                  )}`}
                >
                  {getInitial(userInfo.name)}
                </Link>
                <p>{userInfo.name}</p>
              </div>
            ) : (
              <div className="flex">
                <Link
                  to="/login"
                  onClick={scrollToTop}
                  className="cursor-pointer self-center px-8 py-3 rounded text-[1.1rem] font-semibold"
                >
                  Login
                </Link>
                <Link
                 onClick={scrollToTop}
                  to="/signup"
                  className="cursor-pointer self-center px-4 py-3 font-semibold rounded-3xl bg-[orange] text-white text-[1.1rem]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </ul>
        <div className="items-center md:justify-end flex-shrink-0 hidden md:flex gap-4">
          <div className="relative">
            <Link to="/booking" className="text-[orange] text-2xl relative">
              {/* Notification Badge for Booking */}
              <span className="absolute top-[-10px] right-[-12px] bg-[orange] text-white text-xs font-medium rounded-full px-2 py-0.5 shadow-md">
                {booking.length}
              </span>
              <FaPaperPlane className="w-6 h-6" />
            </Link>
          </div>

          <div className="items-center md:justify-end flex-shrink-0 hidden md:flex gap-4">
            {userInfo ? (
              <Link
              onClick={scrollToTop}
                to="/account"
                className={`w-8 h-8 flex justify-center items-center text-lg font-bold text-white rounded-full ${getBackgroundColor(
                  userInfo.name
                )}`}
              >
                {getInitial(userInfo.name)}
              </Link>
            ) : (
              <div className="flex">
                <Link
                 onClick={scrollToTop}
                  to="/login"
                  className="cursor-pointer self-center px-8 py-3 rounded text-[1.1rem] font-semibold"
                >
                  Login
                </Link>
                <Link
                 onClick={scrollToTop}
                  to="/signup"
                  className="cursor-pointer self-center px-4 py-3 font-semibold rounded-3xl bg-[orange] text-white text-[1.1rem]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        <button className="p-4 md:hidden" onClick={ShowNavbar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 dark:text-gray-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
