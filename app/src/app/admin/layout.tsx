"use client";

import { useState } from "react";
import { AdminNavbar, Sidebar } from "@components";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar with responsive drawer */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Responsive Navbar with menu toggle */}
      <AdminNavbar
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="ml-0 min-h-screen pt-16 transition-all md:ml-64">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}