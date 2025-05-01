import React, { useEffect, useState } from "react";
import { useAppStore } from "../Store";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const AdminNavbar = () => {
  const { userInfo } = useAppStore();
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="backdrop-blur-lg border-b border-gray-200 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center mx-auto lg:w-[90vw]">
        {/* Logo */}
        <Link to="/admin">
          <img
            src="/tour-images/logo-travel2.jpg"
            alt="Logo"
            width="80"
            height="80"
            className="rounded-full"
          />
        </Link>

        {/* User Section */}
        <div className="relative flex gap-2 items-center">
          <p className="rounded-full text-[orange] px-4 py-2">
            Welcome, {userInfo?.name}
          </p>
          <Link to="/" className="p-2 rounded-full bg-orange-500 hover:bg-orange-600 transition">
  <FaHome className="text-white text-2xl" />
</Link>

        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
