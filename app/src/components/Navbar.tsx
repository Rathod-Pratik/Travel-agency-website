"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaPaperPlane } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

import { useAppStore } from "@store";
import { apiClient } from "@apiClient";
import { LOGOUT } from "@utils";

const Navbar = () => {
  const { userInfo, setUserInfo } = useAppStore();

  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // -----------------------------------
  // Navigation Items
  // -----------------------------------

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/tour", label: "Tour" },
    { href: "/blog", label: "Blog" },
  ];

  // -----------------------------------
  // Active Link
  // -----------------------------------

  const isActiveLink = useCallback(
    (path: string) => {
      if (path === "/") {
        return pathname === "/";
      }

      return pathname === path || pathname.startsWith(path + "/");
    },
    [pathname]
  );

  // -----------------------------------
  // Scroll Handler
  // -----------------------------------

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // -----------------------------------
  // Prevent Body Scroll
  // -----------------------------------

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // -----------------------------------
  // Close Mobile Navbar
  // -----------------------------------

  const closeNavbar = useCallback(() => {
    setIsOpen(false);
  }, []);

  // -----------------------------------
  // Scroll To Top
  // -----------------------------------

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // -----------------------------------
  // Get User Initial
  // -----------------------------------

  const getInitial = useCallback((name?: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  }, []);

  // -----------------------------------
  // Logout
  // -----------------------------------

  const handleLogout = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Logged out successfully");

        setUserInfo(undefined);

        localStorage.removeItem("Store-data");

        closeNavbar();

        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  // -----------------------------------
  // Navigation Click
  // -----------------------------------

  const handleNavigation = () => {
    closeNavbar();
    scrollToTop();
  };

  return (
    <>
      {/* =====================================
          MOBILE OVERLAY
      ===================================== */}

      {isOpen && (
        <div
          onClick={closeNavbar}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* =====================================
          NAVBAR
      ===================================== */}

      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white border-b transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* =====================================
              LOGO
          ===================================== */}

          <Link
            href="/"
            onClick={handleNavigation}
            aria-label="Back to homepage"
            className="flex items-center"
          >
            <img
              src="/tour-images/logo-travel2.jpg"
              alt="Travel Logo"
              width={55}
              height={55}
              className="w-12 h-12 rounded-full object-cover"
            />
          </Link>

          {/* =====================================
              DESKTOP NAVIGATION
          ===================================== */}

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavigation}
                className={`transition-colors duration-300 font-semibold ${
                  isActiveLink(item.href)
                    ? "text-orange-500"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* =====================================
              DESKTOP AUTH
          ===================================== */}

          <div className="hidden md:flex items-center gap-4">
            {userInfo ? (
              <>
                {/* Logout */}

                <button
                  onClick={handleLogout}
                  aria-label="Logout"
                  className="flex items-center justify-center p-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition"
                >
                  <BiLogOut className="text-lg" />
                </button>

                {/* Booking */}

                <div className="relative">
                  <Link
                    href="/booking"
                    className="text-orange-500 text-2xl"
                    aria-label="Bookings"
                  >
                    {/* {booking.length > 0 && (
                      <span className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-medium rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                        {booking.length}
                      </span>
                    )} */}

                    <FaPaperPlane className="w-6 h-6" />
                  </Link>
                </div>

                {/* Account */}

                <Link
                  href="/account"
                  aria-label="User account"
                  className="w-9 h-9 flex items-center justify-center text-lg font-bold text-white rounded-full bg-orange-500 hover:bg-orange-600 transition"
                >
                  {getInitial(userInfo.name)}
                </Link>
              </>
            ) : (
              <>
                {/* Login */}

                <Link
                  href="/login"
                  onClick={handleNavigation}
                  className="px-5 py-2 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  Login
                </Link>

                {/* Register */}

                <Link
                  href="/signup"
                  onClick={handleNavigation}
                  className="px-5 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* =====================================
              MOBILE MENU BUTTON
          ===================================== */}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className="md:hidden text-gray-800 text-3xl"
          >
            <IoMdMenu />
          </button>
        </div>

        {/* =====================================
            MOBILE SIDEBAR
        ===================================== */}

        <div
          className={`fixed top-0 right-0 h-screen w-[80vw] max-w-[320px] bg-white z-50 transition-transform duration-500 md:hidden ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close Button */}

          <div className="p-5 flex justify-end border-b">
            <button
              onClick={closeNavbar}
              aria-label="Close menu"
              className="text-gray-800 text-3xl"
            >
              <IoMdClose />
            </button>
          </div>

          {/* Mobile Navigation */}

          <nav className="flex flex-col gap-7 px-8 mt-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavigation}
                className={`text-lg text-center font-semibold transition-colors ${
                  isActiveLink(item.href)
                    ? "text-orange-500"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* =====================================
              MOBILE AUTH
          ===================================== */}

          <div className="px-8 mt-10">
            {userInfo ? (
              <div className="flex flex-col gap-5">
                {/* Account */}

                <Link
                  href="/account"
                  onClick={closeNavbar}
                  className="flex items-center justify-center gap-3"
                >
                  <span className="w-10 h-10 flex items-center justify-center text-lg font-bold text-white rounded-full bg-orange-500">
                    {getInitial(userInfo.name)}
                  </span>

                  <span className="font-semibold truncate max-w-[150px]">
                    {userInfo.name}
                  </span>
                </Link>

                {/* Booking */}

                <Link
                  href="/booking"
                  onClick={closeNavbar}
                  className="relative flex items-center justify-center gap-2 border border-orange-500 text-orange-500 py-3 rounded-full"
                >
                  <FaPaperPlane />

                  <span>Bookings</span>

                  {/* {booking.length > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1">
                      {booking.length}
                    </span>
                  )} */}
                </Link>

                {/* Logout */}

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition"
                >
                  <BiLogOut className="text-lg" />

                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Login */}

                <Link
                  href="/login"
                  onClick={handleNavigation}
                  className="text-center py-3 rounded-md font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  Login
                </Link>

                {/* Register */}

                <Link
                  href="/signup"
                  onClick={handleNavigation}
                  className="text-center py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="h-16" />
    </>
  );
};

export default Navbar;