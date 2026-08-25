"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBarChart2,
  FiMap,
  FiHome,
  FiCalendar,
  FiFolder,
  FiUsers,
  FiStar,
  FiCreditCard,
  FiSettings,
  FiX,
} from "react-icons/fi";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: FiBarChart2,
  },
  {
    name: "Tours",
    href: "/admin/tours",
    icon: FiMap,
  },
  {
    name: "Hotels",
    href: "/admin/hotels",
    icon: FiHome,
  },
  {
    name: "Bookings",
    href: "/admin/bookings",
    icon: FiCalendar,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FiFolder,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: FiUsers,
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: FiStar,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: FiCreditCard,
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <Link
            href="/admin"
            onClick={handleNavClick}
            className="flex items-center gap-2"
          >
            <h1 className="text-xl font-bold text-gray-900">
              Travel <span className="text-orange-500">Admin</span>
            </h1>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings Footer */}
        <div className="border-t border-gray-200 p-4">
          <Link
            href="/admin/settings"
            onClick={handleNavClick}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              pathname.startsWith("/admin/settings")
                ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <FiSettings size={19} />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}