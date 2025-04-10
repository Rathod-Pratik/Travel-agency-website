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
  const location = useLocation();
  return (
    <div className="group/sidebar relative ">
      {/* Sidebar Container */}
      <div
        className="flex flex-col text-xl px-2 pt-12
      w-[60px] lg:w-[250px] shadow-lg lg:shadow-none
      group-hover/sidebar:w-[250px] 
      transition-all duration-300 ease-in-out
      bg-white z-50 fixed h-full"
      >
        {[
          { to: "/admin", icon: <FaHome />, label: "Dashboard" },
          { to: "/admin/Tours", icon: <IoLocationOutline />, label: "Tours" },
          {
            to: "/admin/Bookings",
            icon: <FaRegAddressBook />,
            label: "Booking",
          },
          { to: "/admin/Users", icon: <FaUser />, label: "Users" },
          { to: "/admin/blog", icon: <FaBlog />, label: "Blogs" },
          { to: "/admin/contacts", icon: <FaMessage />, label: "Contacts" },
          { to: "/admin/Review", icon: <FaStar />, label: "Review" },
          { to: "/admin/setting", icon: <IoSettings />, label: "Settings" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 py-3 pl-4 transition-all duration-150
          ${
            location.pathname === item.to
              ? "bg-[orange] text-white"
              : "text-black"
          }
          hover:bg-orange-400`}
          >
            <div
              className={`text-xl shrink-0 ${
                location.pathname === item.to ? "text-white" : "text-[orange]"
              }`}
            >
              {item.icon}
            </div>

            {/* Text label */}
            <span className="hidden lg:block group-hover/sidebar:block whitespace-nowrap">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
