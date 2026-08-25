"use client";

import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShield,
  FiLock,
  FiSave,
  FiCheck,
  FiCamera,
} from "react-icons/fi";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: "Pratik Rathod",
    email: "admin@travelworld.com",
    phone: "+91 98765 43210",
    address: "Mumbai, Maharashtra, India",
    role: "Super Administrator",
    bio: "Head Administrator & Operations Lead for TravelWorld agency platforms.",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSaved(true);
    setTimeout(() => setIsProfileSaved(false), 3000);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setIsPasswordSaved(true);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setIsPasswordSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin <span className="text-orange-500">Profile</span>
        </h1>
        <p className="text-sm text-gray-500">
          Manage your personal account credentials, contact information, and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Profile Card */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
            <div className="relative mx-auto h-24 w-24">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-500 text-3xl font-bold text-white shadow-md shadow-orange-500/30">
                {profile.name.charAt(0)}
              </div>
              <button
                type="button"
                title="Change Avatar"
                className="absolute bottom-0 right-0 rounded-full bg-gray-900 p-2 text-white shadow hover:bg-orange-600 transition"
              >
                <FiCamera size={14} />
              </button>
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-900">{profile.name}</h2>
            <p className="text-xs text-gray-500">{profile.email}</p>

            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                <FiShield size={12} />
                {profile.role}
              </span>
            </div>

            <p className="mt-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
              {profile.bio}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3 text-xs text-gray-600">
            <h3 className="font-bold text-gray-900 text-sm">Quick Information</h3>
            <div className="flex items-center gap-2">
              <FiMail className="text-orange-500" size={14} />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone className="text-orange-500" size={14} />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-orange-500" size={14} />
              <span>{profile.address}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile & Password Form */}
        <div className="space-y-8 lg:col-span-2">
          {/* Edit Profile */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                <p className="text-xs text-gray-500">Update your public name and contact info</p>
              </div>
              {isProfileSaved && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <FiCheck size={14} /> Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleProfileSave} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700">Location Address</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Bio / Notes</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-orange-500/20 hover:bg-orange-600"
                >
                  <FiSave size={16} />
                  <span>Update Profile</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Security & Password</h2>
                <p className="text-xs text-gray-500">Ensure your account uses a strong, secure password</p>
              </div>
              {isPasswordSaved && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <FiCheck size={14} /> Password updated!
                </span>
              )}
            </div>

            <form onSubmit={handlePasswordSave} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
                >
                  <FiLock size={16} />
                  <span>Change Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
