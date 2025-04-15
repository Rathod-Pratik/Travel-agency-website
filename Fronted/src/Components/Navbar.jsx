import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppStore } from "../Store";
import { FaPaperPlane, FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { apiClient } from "../lib/api-Client";
import { LOGOUT } from "../Utils/Constant";
import { toast } from "react-toastify";

const Navbar = () => {
  const { userInfo, booking } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const {setUserInfo}=useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Memoized functions
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const getInitial = useCallback((name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  }, []);

  const getBackgroundColor = useCallback(() => {
    return "bg-[orange]"; // Simplified since you only have one color
  }, []);

  const toggleNavbar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const hideNavbar = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Effects
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Handlers
  const handleLogout = async () => {
    try {
      const response = await apiClient.post(LOGOUT);
      if (response.status === 200) {
        toast.success("Logged out successfully");
        localStorage.removeItem("Store-data");
        navigate("/login");
        setUserInfo(null)
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  // Nav items configuration
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/tour", label: "Tour" },
    { path: "/blog", label: "Blog" },
  ];

  return (
    <header
      className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container flex justify-between w-[90%] h-16 mx-auto">
        {/* Logo */}
        <Link
          to="/"
          aria-label="Back to homepage"
          className="flex items-center p-2"
          onClick={scrollToTop}
        >
          <img
            height="100"
            width="100"
            className="rounded-[50%] mt-2"
            src="/tour-images/logo-travel2.jpg"
            alt="Logo"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="p-4 md:hidden focus:outline-none"
          onClick={toggleNavbar}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <nav
          className={`z-50 flex flex-col font-semibold md:flex-row items-center md:static bg-white left-0 absolute m-auto md:w-auto transition-all duration-500 ease-in-out gap-3 w-full ${
            isOpen ? "!top-16 h-[230px] rounded shadow-lg" : "top-[-100vh]"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                hideNavbar();
                scrollToTop();
              }}
              className={`flex items-center px-4 ${
                location.pathname === item.path ? "text-[Orange]" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Auth Buttons */}
          <div className="items-center flex flex-col justify-center flex-shrink-0 gap-3 md:hidden">
            {userInfo ? (
              <div className="flex flex-row gap-2 items-center">
                <button
                  onClick={handleLogout}
                  aria-label="Logout"
                  className="p-2 rounded-md bg-[orange] text-white text-sm font-medium hover:bg-orange-600 transition"
                >
                  <BiLogOut className="text-lg" />
                </button>
                <div className="flex flex-row gap-2 items-center">
                  <Link
                    to="/account"
                    className={`w-8 h-8 flex justify-center items-center text-lg font-bold text-white rounded-full ${getBackgroundColor()}`}
                    aria-label="User account"
                  >
                    {getInitial(userInfo.name)}
                  </Link>
                  <p className="truncate max-w-[100px]">{userInfo.name}</p>
                </div>
                {userInfo.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 p-2 rounded-md bg-[orange] text-white text-sm font-medium hover:bg-orange-600 transition"
                  >
                    <FaUser className="text-lg" />
                    Admin
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={scrollToTop}
                  className="px-4 py-2 rounded text-sm font-semibold hover:bg-gray-100 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={scrollToTop}
                  className="px-4 py-2 font-semibold rounded-3xl bg-[orange] text-white text-sm hover:bg-orange-600 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="items-center md:justify-end flex-shrink-0 hidden md:flex gap-4">
          {userInfo && (
            <>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="flex items-center flex-col gap-2 p-2 rounded-md bg-[orange] text-white cursor-pointer hover:bg-orange-600 transition"
              >
                <BiLogOut className="text-lg" />
              </button>

              <div className="relative">
                <Link
                  to="/booking"
                  className="text-[orange] text-2xl relative"
                  aria-label="Bookings"
                >
                  {booking.length > 0 && (
                    <span className="absolute top-[-10px] right-[-12px] bg-[orange] text-white text-xs font-medium rounded-full px-2 py-0.5 shadow-md">
                      {booking.length}
                    </span>
                  )}
                  <FaPaperPlane className="w-6 h-6" />
                </Link>
              </div>

              <div className="flex flex-row gap-2 items-center">
                <Link
                  to="/account"
                  className={`w-8 h-8 flex justify-center items-center text-lg font-bold text-white rounded-full ${getBackgroundColor()}`}
                  aria-label="User account"
                >
                  {getInitial(userInfo.name)}
                </Link>
                {userInfo.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 p-2 rounded-md bg-[orange] text-white text-sm font-medium hover:bg-orange-600 transition"
                  >
                    <FaUser className="text-lg" />
                    Admin
                  </Link>
                )}
              </div>
            </>
          )}

          {!userInfo && (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={scrollToTop}
                className="px-6 py-2 rounded text-sm font-semibold hover:bg-gray-100 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={scrollToTop}
                className="px-6 py-2 font-semibold rounded-3xl bg-[orange] text-white text-sm hover:bg-orange-600 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;