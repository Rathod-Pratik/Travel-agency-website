"use client";

import { useState } from "react";
import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiFilter,
  FiShield,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user";
  address: string;
  joinedDate: string;
  bookingsCount: number;
  status: "Active" | "Inactive";
}

const initialUsers: UserItem[] = [
  {
    id: "u-1",
    name: "Pratik Rathod",
    email: "admin@travelworld.com",
    phone: "+91 98765 43210",
    role: "admin",
    address: "Mumbai, India",
    joinedDate: "2026-01-10",
    bookingsCount: 0,
    status: "Active",
  },
  {
    id: "u-2",
    name: "Alexander Wright",
    email: "alex.wright@example.com",
    phone: "+1 555 234-5678",
    role: "user",
    address: "New York, USA",
    joinedDate: "2026-03-14",
    bookingsCount: 3,
    status: "Active",
  },
  {
    id: "u-3",
    name: "Sophia Chen",
    email: "sophia.chen@example.com",
    phone: "+65 9123 4567",
    role: "user",
    address: "Singapore",
    joinedDate: "2026-04-20",
    bookingsCount: 2,
    status: "Active",
  },
  {
    id: "u-4",
    name: "Marcus Vance",
    email: "marcus.v@example.com",
    phone: "+44 20 7946 0912",
    role: "admin",
    address: "London, UK",
    joinedDate: "2026-02-01",
    bookingsCount: 1,
    status: "Active",
  },
  {
    id: "u-5",
    name: "Elena Rostova",
    email: "elena.r@example.com",
    phone: "+49 30 123456",
    role: "user",
    address: "Berlin, Germany",
    joinedDate: "2026-05-18",
    bookingsCount: 5,
    status: "Active",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user" as "admin" | "user",
    address: "",
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.toLowerCase().includes(search.toLowerCase()) ||
      u.address.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const created: UserItem = {
      id: `u-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || "-",
      role: newUser.role,
      address: newUser.address || "Global",
      joinedDate: new Date().toISOString().split("T")[0],
      bookingsCount: 0,
      status: "Active",
    };

    setUsers([created, ...users]);
    setIsModalOpen(false);
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "user",
      address: "",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            User <span className="text-orange-500">Accounts</span>
          </h1>
          <p className="text-sm text-gray-500">
            Manage system administrators, customer accounts, and access permissions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600"
        >
          <FiUserPlus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Users</span>
            <span className="rounded-lg bg-orange-50 p-2 text-orange-500">
              <FiUsers size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{users.length}</p>
          <p className="mt-1 text-xs text-gray-500">Registered travelers & staff</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Administrators</span>
            <span className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <FiShield size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {users.filter((u) => u.role === "admin").length}
          </p>
          <p className="mt-1 text-xs text-purple-600 font-medium">Full dashboard access</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Customers</span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-500">
              <FiCheckCircle size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {users.filter((u) => u.role === "user").length}
          </p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">Tour booking clients</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Avg. Bookings</span>
            <span className="rounded-lg bg-orange-50 p-2 text-orange-500">
              <FiCheckCircle size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {(users.reduce((acc, u) => acc + u.bookingsCount, 0) / (users.length || 1)).toFixed(1)}
          </p>
          <p className="mt-1 text-xs text-gray-500">Tours per traveler</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by user name, email, phone, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FiFilter className="text-orange-500" size={16} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="All">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="user">Customers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-gray-200 bg-gray-50/75 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Bookings</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="transition hover:bg-orange-50/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white shadow-sm shadow-orange-500/20">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiPhone className="text-orange-500" size={12} />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiMail className="text-gray-400" size={12} />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-gray-700">
                        <FiMapPin className="text-orange-500" size={12} />
                        <span>{user.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-orange-100 text-orange-700 border border-orange-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {user.role === "admin" && <FiShield size={12} />}
                        {user.role === "admin" ? "Admin" : "Customer"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {user.joinedDate}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600">
                        {user.bookingsCount} tours
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(user.id)}
                          title="Delete user"
                          className="rounded p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No user accounts found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
            <span className="font-medium">{users.length}</span> users
          </p>
          <div className="flex gap-1">
            <button className="rounded px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-50">
              Prev
            </button>
            <button className="rounded bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white">
              1
            </button>
            <button className="rounded px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Add New <span className="text-orange-500">User</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 234 567"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "user" })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Address / City</label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-orange-500/20 hover:bg-orange-600"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
