import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { FaRegAddressBook } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaBlog } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";

const SideBar = () => {
  const location=useLocation();
  return (
    <div>
      <div className="flex flex-col text-xl px-2 mt-12">
  <Link
    className={`flex items-center gap-3 pl-3 py-3 justify-start transition-all duration-150 ${location.pathname=="/admin"? "text-white bg-[orange]":""}`}
    to="/admin"
  >
    <FaHome className={`text-[orange] text-xl ${location.pathname=="/admin"?"text-white":"text-[orange]"}`} />
    DashBoard
  </Link>

  <Link
    className={`flex items-center gap-3 pl-3 py-3 justify-start transition-all duration-150 ${location.pathname=="/admin/Tours"? "text-white bg-[orange]":""}`}
    to="/admin/Tours"
  >
    <IoLocationOutline className={`text-[orange] text-xl ${location.pathname=="/admin/Tours"?"text-white":"text-[orange]"}`} />
    Tours
  </Link>

  <Link
    className={`flex items-center gap-3 pl-3 py-3 justify-start transition-all duration-150 ${location.pathname=="/admin/Bookings"? "text-white bg-[orange]":""}`}
    to="/admin/Bookings"
  >
    <FaRegAddressBook className={`text-[orange] text-xl ${location.pathname=="/admin/Bookings"?"text-white":"text-[orange]"}`} />
    Booking
  </Link>

  <Link
    className={`flex items-center gap-3 pl-3 py-3 justify-start transition-all duration-150 ${location.pathname=="/admin/Users"? "text-white bg-[orange]":""}`}
    to="/admin/Users"
  >
    <FaUser className={`text-[orange] text-xl ${location.pathname=="/admin/Users"?"text-white":"text-[orange]"}`} />
    Users
  </Link>

  <Link
    className={`flex items-center gap-3 pl-3 py-3 justify-start transition-all duration-150 ${location.pathname=="/admin/blog"? "text-white bg-[orange]":""}`}
    to="/admin/blog"
  >
    <FaBlog className={`text-[orange] text-xl ${location.pathname=="/admin/blog"?"text-white":"text-[orange]"}`} />
    Blogs
  </Link>

  <Link
    className={`flex items-center gap-3 pl-3 py-3 justify-start transition-all duration-150 ${location.pathname=="/admin/contacts"? "text-white bg-[orange]":""}`}
    to="/admin/contacts"
  >
    <FaMessage className={`text-[orange] text-xl ${location.pathname=="/admin/contacts"?"text-white":"text-[orange]"}`} />
    Contects
  </Link>

  <Link
    className={`flex items-center gap-3 pl-3 py-3 justify-start transition-all duration-150 ${location.pathname=="/admin/Review"? "text-white bg-[orange]":""}`}
    to="/admin/Review"
  >
    <FaStar className={`text-[orange] text-xl ${location.pathname=="/admin/Review"?"text-white":"text-[orange]"}`} />
    Review
  </Link>

  <Link
    className={`flex items-center gap-3 pl-3 py-3 justify-start transition-all duration-150 ${location.pathname=="/admin/setting"? "text-white bg-[orange]":""}`}
    to="/admin/setting"
  >
    <IoSettings className={`text-[orange] text-xl ${location.pathname=="/admin/setting"?"text-white":"text-[orange]"}`} />
    settings
  </Link>
</div>

    </div>
  );
};

export default SideBar;
