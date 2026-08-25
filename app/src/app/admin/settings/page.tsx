"use client";

import { useState } from "react";
import {
  FiSettings,
  FiSave,
  FiGlobe,
  FiMail,
  FiBell,
  FiShield,
  FiDollarSign,
  FiCheck,
} from "react-icons/fi";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "bookings" | "notifications" | "security">("general");
  const [isSaved, setIsSaved] = useState(false);

  const [settings, setSettings] = useState({
    agencyName: "TravelWorld Agency",
    supportEmail: "support@travelworld.com",
    contactPhone: "+1 (800) 555-0199",
    currency: "USD ($)",
    timezone: "UTC+00:00 (GMT)",
    address: "742 Evergreen Terrace, Suite 400",
    autoConfirmBookings: true,
    cancellationWindowDays: 7,
    refundPercentage: 85,
    emailOnBooking: true,
    emailOnReview: true,
    smsAlerts: false,
    maintenanceMode: false,
    require2FA: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            System & Agency <span className="text-orange-500">Settings</span>
          </h1>
          <p className="text-sm text-gray-500">
            Configure global website configurations, booking policies, and notification rules.
          </p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <FiCheck size={16} />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-4 rounded-xl shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition ${
            activeTab === "general"
              ? "border-orange-500 text-orange-600 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FiGlobe size={16} />
          <span>Agency Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition ${
            activeTab === "bookings"
              ? "border-orange-500 text-orange-600 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FiDollarSign size={16} />
          <span>Booking Policies</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition ${
            activeTab === "notifications"
              ? "border-orange-500 text-orange-600 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FiBell size={16} />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition ${
            activeTab === "security"
              ? "border-orange-500 text-orange-600 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FiShield size={16} />
          <span>Security & System</span>
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === "general" && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900">General Agency Details</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-gray-700">Agency Brand Name</label>
                <input
                  type="text"
                  value={settings.agencyName}
                  onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Contact Phone</label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Default Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                  <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">Registered Office Address</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Booking & Cancellation Rules</h2>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoConfirmBookings}
                  onChange={(e) => setSettings({ ...settings, autoConfirmBookings: e.target.checked })}
                  className="mt-1 accent-orange-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Instant Booking Confirmation</p>
                  <p className="text-xs text-gray-500">
                    Automatically confirm bookings as soon as successful online payment is received.
                  </p>
                </div>
              </label>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4 border-t border-gray-100">
                <div>
                  <label className="text-xs font-medium text-gray-700">
                    Cancellation Allowed Window (Days before travel)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={settings.cancellationWindowDays}
                    onChange={(e) => setSettings({ ...settings, cancellationWindowDays: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700">
                    Refund Payout Percentage (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={settings.refundPercentage}
                    onChange={(e) => setSettings({ ...settings, refundPercentage: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Email & Alerts Setup</h2>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailOnBooking}
                  onChange={(e) => setSettings({ ...settings, emailOnBooking: e.target.checked })}
                  className="mt-1 accent-orange-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email on New Booking</p>
                  <p className="text-xs text-gray-500">
                    Receive admin alert email whenever a client purchases a tour.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailOnReview}
                  onChange={(e) => setSettings({ ...settings, emailOnReview: e.target.checked })}
                  className="mt-1 accent-orange-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email on Customer Review</p>
                  <p className="text-xs text-gray-500">
                    Notify administrators when a new review needs moderation.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsAlerts}
                  onChange={(e) => setSettings({ ...settings, smsAlerts: e.target.checked })}
                  className="mt-1 accent-orange-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">SMS Gateway Alerts</p>
                  <p className="text-xs text-gray-500">
                    Send urgent booking SMS alerts to admin phone.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900">System Security & Maintenance</h2>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.require2FA}
                  onChange={(e) => setSettings({ ...settings, require2FA: e.target.checked })}
                  className="mt-1 accent-orange-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Enforce Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-gray-500">
                    Require OTP verification for all admin login sessions.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="mt-1 accent-orange-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Maintenance Mode</p>
                  <p className="text-xs text-gray-500">
                    Temporarily display a maintenance landing banner to public visitors.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600"
          >
            <FiSave size={16} />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
