import { useState } from "react";
import { FaBars, FaTimes, FaHome, FaRegAddressBook, FaUser, FaBlog, FaStar } from "react-icons/fa";
import { IoLocationOutline, IoSettings } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { to: "/admin", icon: <FaHome />, label: "Dashboard" },
    { to: "/admin/Tours", icon: <IoLocationOutline />, label: "Tours" },
    { to: "/admin/Bookings", icon: <FaRegAddressBook />, label: "Booking" },
    { to: "/admin/Users", icon: <FaUser />, label: "Users" },
    { to: "/admin/blog", icon: <FaBlog />, label: "Blogs" },
    { to: "/admin/contacts", icon: <FaMessage />, label: "Contacts" },
    { to: "/admin/Review", icon: <FaStar />, label: "Review" },
    { to: "/admin/setting", icon: <IoSettings />, label: "Settings" },
  ];

  return (
    <div>
      {/* Topbar toggle button for small screens */}
      <div className="flex items-center justify-between px-4 pt-4 pb-6 w-full xl:hidden">
        <button
          onClick={toggleSidebar}
          className="text-orange-500 text-2xl focus:outline-none"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <p className="rounded-full text-[orange] px-4 py-2 md:hidden">
            Welcome, {userInfo?.name}
          </p>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-[71px] left-0 h-[calc(100vh-71px)] bg-white shadow-md transition-transform duration-300 z-[100] xl:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
         w-[250px]`}
      >
        {/* Sidebar Links */}
        <div className="flex flex-col px-4 pt-6 text-base space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={toggleSidebar} // close sidebar on link click
              className={`flex items-center gap-4 py-3 px-3 rounded-md transition-all duration-150
                ${
                  location.pathname === item.to
                    ? "bg-orange-500 text-white"
                    : "text-gray-800"
                }
                hover:bg-orange-400 hover:text-white`}
            >
              <div
                className={`text-xl shrink-0 ${
                  location.pathname === item.to ? "text-white" : "text-orange-500"
                }`}
              >
                {item.icon}
              </div>
              <span className="whitespace-nowrap font-medium">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
