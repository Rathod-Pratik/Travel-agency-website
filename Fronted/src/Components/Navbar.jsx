import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAppStore } from "../Store";

const Navbar = () => {
  const { userInfo } = useAppStore();

  const location = useLocation();

  const [isOpen,SetIsOpen]=useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const ShowNavbar=()=>{
    SetIsOpen(!isOpen);
    console.log("Show navbar")
  }
  const hideNavbar=()=>{
    SetIsOpen(false);
  }
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`p-4 ${isScrolled ? "shadow-md" : ""}`}>
      <div className="container flex justify-between h-14 mx-auto">
        <Link
          to="/"
          aria-label="Back to homepage"
          className="flex items-center p-2"
        >
          <img
            height="100"
            width="100"
            className="rounded-[50%]"
            src="/tour-images/logo-travel.avif"
            alt="Logo"
          />
        </Link>
        <ul className={`z-50 flex flex-col font-semibold md:flex-row items-center md:static bg-white left-0 absolute m-auto md:w-auto transition-all duration-500 ease-in-out gap-3 w-full ${
    isOpen ? "!top-16 h-[205px] rounded shadow-lg" : "top-[-100vh]"
  }`}>
          <li className="flex">
            <Link
              to="/"
              onClick={hideNavbar}
              className={`flex items-center px-4 ${
                location.pathname === "/" ? "text-[Orange]" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li className="flex">
            <Link
            onClick={hideNavbar}
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
            onClick={hideNavbar}
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
            onClick={hideNavbar}
              to="/blog"
              className={`flex items-center px-4 ${
                location.pathname === "/blog" ? "text-[Orange]" : ""
              }`}
            >
              Blog
            </Link>
          </li>
          <div className="items-center flex-shrink-0 gap-3 lg:hidden">
          {userInfo ? (
            <button className="p-4 lg:hidden">
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
          ) : (
            <div className="flex">
              <Link
                to="/login"
                onClick={hideNavbar}
                className="cursor-pointer self-center px-8 py-3 rounded text-[1.1rem] font-semibold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={hideNavbar}
                className="cursor-pointer self-center p-2 font-semibold rounded-3xl bg-[orange] text-white text-[1.1rem]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
        </ul>
        <div className="items-center flex-shrink-0 hidden lg:flex gap-3">
          {userInfo ? (
            <button className="p-4 lg:hidden">
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
          ) : (
            <div className="flex">
              <Link
                to="/login"
                className="cursor-pointer self-center px-8 py-3 rounded text-[1.1rem] font-semibold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="cursor-pointer self-center px-8 py-3 font-semibold rounded-3xl bg-[orange] text-white text-[1.1rem]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
        <button className="p-4 lg:hidden" onClick={ShowNavbar}>
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
