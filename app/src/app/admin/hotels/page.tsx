"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FiHome, FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, FiEye,
  FiStar, FiCheckCircle, FiMapPin, FiRefreshCw, FiAlertCircle, FiInbox,
} from "react-icons/fi";
import { AdminButton, StatusBadge, DeleteConfirmModal } from "@components";
import { apiClient } from "@apiClient";
import { GET_HOTEL_URL, DELETE_HOTEL_URL } from "@utils";

interface IHotel {
  _id: string;
  name: string;
  rating: number;
  address: string;
  roomType: string;
  meal: { breakfast: boolean; lunch: boolean; dinner: boolean };
  pricePerPerson: number;
  availableRooms: number;
  isActive: boolean;
  images?: string[];
}

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState<IHotel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(GET_HOTEL_URL(1, 20), { withCredentials: true });
      const data: IHotel[] =  res.data ?? [];
      setHotels(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load hotels. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(DELETE_HOTEL_URL(deleteTarget._id), { withCredentials: true });
      toast.success("Hotel removed successfully");
      setHotels((prev) => prev.filter((h) => h._id !== deleteTarget._id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete hotel");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = hotels.filter((h) => {
    const q = search.toLowerCase();
    const matchSearch =
      h.name.toLowerCase().includes(q) ||
      h.address?.toLowerCase().includes(q) ||
      h.roomType?.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "active" && h.isActive) ||
      (statusFilter === "inactive" && !h.isActive);
    return matchSearch && matchStatus;
  });

  const totalRooms = hotels.reduce((a, h) => a + (h.availableRooms || 0), 0);
  const avgRating = hotels.length
    ? (hotels.reduce((a, h) => a + (h.rating || 0), 0) / hotels.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Hotel & <span className="text-orange-500">Resort Partners</span>
          </h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            Manage partner accommodations, room allocations, meal plans, and nightly pricing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchHotels} disabled={loading} title="Refresh"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50">
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={16} />
          </button>
          <Link href="/admin/hotels/create">
            <AdminButton variant="primary" icon={FiPlus}>Add New Hotel</AdminButton>
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Hotels", value: hotels.length, icon: FiHome, color: "orange" },
          { label: "Available Rooms", value: totalRooms, icon: FiCheckCircle, color: "emerald" },
          { label: "Avg. Rating", value: `${avgRating} / 5`, icon: FiStar, color: "amber" },
          { label: "Active Listings", value: hotels.filter(h => h.isActive).length, icon: FiCheckCircle, color: "orange" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{card.label}</span>
              <span className={`rounded-lg bg-${card.color}-50 p-2 text-${card.color}-500`}><card.icon size={18} /></span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filter ── */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search by name, address, or room type…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/20" />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="text-orange-500" size={15} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none">
            <option value="All">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* ── Table / States ── */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <FiRefreshCw className="animate-spin mb-3" size={32} />
            <p className="text-sm">Loading hotels from server…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-red-500">
            <FiAlertCircle className="mb-3" size={32} />
            <p className="text-sm font-medium">{error}</p>
            <button onClick={fetchHotels} className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <FiInbox className="mb-3" size={32} />
            <p className="text-sm">No hotels found. Try adjusting filters or add a new one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b border-gray-200 bg-gray-50/75 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Hotel / Location</th>
                  <th className="px-6 py-4">Room Type</th>
                  <th className="px-6 py-4">Meals</th>
                  <th className="px-6 py-4">Price / Night</th>
                  <th className="px-6 py-4">Rooms</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((hotel) => (
                  <tr key={hotel._id} className="transition hover:bg-orange-50/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {hotel.images?.[0] && (
                          <div className="h-12 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                            <img src={hotel.images[0]} alt={hotel.name} className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div>
                          <Link href={`/admin/hotels/${hotel._id}`}
                            className="font-semibold text-gray-900 hover:text-orange-600 transition">{hotel.name}</Link>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <FiMapPin className="text-orange-500" size={12} />
                            {hotel.address}
                            <span className="font-medium text-amber-600">★ {hotel.rating}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{hotel.roomType}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs">
                        {hotel.meal?.breakfast && <span className="rounded bg-orange-100 px-1.5 py-0.5 font-medium text-orange-700">B</span>}
                        {hotel.meal?.lunch && <span className="rounded bg-orange-100 px-1.5 py-0.5 font-medium text-orange-700">L</span>}
                        {hotel.meal?.dinner && <span className="rounded bg-orange-100 px-1.5 py-0.5 font-medium text-orange-700">D</span>}
                        {!hotel.meal?.breakfast && !hotel.meal?.lunch && !hotel.meal?.dinner && <span className="text-gray-400">None</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">${hotel.pricePerPerson}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold ${hotel.availableRooms < 4 ? "text-red-500" : "text-emerald-600"}`}>
                        {hotel.availableRooms} rooms
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={hotel.isActive ? "active" : "inactive"} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/hotels/${hotel._id}`}
                          className="rounded p-1.5 text-gray-500 hover:bg-orange-50 hover:text-orange-600" title="View"><FiEye size={15} /></Link>
                        <Link href={`/admin/hotels/${hotel._id}/edit`}
                          className="rounded p-1.5 text-gray-500 hover:bg-orange-50 hover:text-orange-600" title="Edit"><FiEdit2 size={15} /></Link>
                        <button onClick={() => setDeleteTarget(hotel)}
                          className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600" title="Delete"><FiTrash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && hotels.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
            <p className="text-xs text-gray-500">
              Showing <span className="font-medium">{filtered.length}</span> of{" "}
              <span className="font-medium">{hotels.length}</span> hotels
            </p>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Remove Hotel Partner"
        message="This action cannot be undone."
        itemName={deleteTarget?.name}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
