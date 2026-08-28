"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiBell,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import Router from "next/navigation";

interface AdminNavbarProps {
  onMenuClick?: () => void;
}

export function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const [open, setOpen] = useState(false);
  const router = Router.useRouter();

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-gray-200 bg-white transition-all md:left-64">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left Section: Mobile Menu Trigger + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open sidebar menu"
            className="flex items-center justify-center rounded-lg p-2 text-gray-600 transition hover:bg-orange-50 hover:text-orange-600 md:hidden"
          >
            <FiMenu size={22} />
          </button>

          <div>
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Admin <span className="text-orange-500">Dashboard</span>
            </h2>
          </div>
        </div>

        {/* Right Section: Notification + User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Button */}
          <button
            type="button"
            onClick={() => router.push("/admin/notifications")}
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <FiBell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" />
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-lg p-1.5 transition hover:bg-orange-50 sm:gap-3 sm:p-2"
            >
              {/* Avatar */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white shadow-sm shadow-orange-500/20 sm:h-9 sm:w-9">
                <FiUser size={18} />
              </div>

              {/* User Info */}
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>

              <FiChevronDown
                size={17}
                className={`text-gray-600 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {open && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-xl z-50">
                <div className="px-3 py-2 border-b border-gray-100 mb-1 md:hidden">
                  <p className="text-sm font-semibold text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">admin@travelworld.com</p>
                </div>

                <Link
                  href="/admin/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  onClick={() => setOpen(false)}
                >
                  <FiUser size={17} />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  onClick={() => setOpen(false)}
                >
                  <FiSettings size={17} />
                  <span>Settings</span>
                </Link>

                <div className="my-1.5 border-t border-gray-100" />

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                   router.push("/login");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <FiLogOut size={17} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}