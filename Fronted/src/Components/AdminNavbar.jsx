import React from "react";
import { useAppStore } from "../Store";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const { userInfo } = useAppStore();

  return (
    <div className="bg-white border-b-gray-200 border-b py-3">
      <div className="flex justify-between items-center w-[90vw] mx-auto">
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
        <div className="relative">
          <p
            className="rounded-full text-[orange] px-4 py-2"
          >
            Welcome, {userInfo.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
