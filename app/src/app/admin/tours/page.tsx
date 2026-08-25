"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FiMap,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiClock,
  FiDollarSign,
  FiStar,
  FiCheckCircle,
  FiRefreshCw,
  FiAlertCircle,
  FiInbox,
} from "react-icons/fi";
import { AdminButton, StatusBadge, DeleteConfirmModal } from "@components";
import { apiClient } from "@apiClient";
import { GET_TOUR_URL, DELETE_TOUR_URL } from "@utils";

interface ITourRow {
  _id: string;
  title: string;
  destination: { country: string; city: string };
  duration: { days: number; nights: number };
  price: number;
  discountPrice?: number;
  category: string;
  availableSeats: number;
  maxSeats: number;
  rating: number;
  status: string;
  featured: boolean;
  images: string[];
}

export default function AdminToursPage() {
  const [tours, setTours] = useState<ITourRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [deleteTarget, setDeleteTarget] = useState<ITourRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTours = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(GET_TOUR_URL(1, 100), {
        withCredentials: true,
      });
      const data: ITourRow[] = res.data?.data ?? [];
      setTours(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to load tours. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(DELETE_TOUR_URL(deleteTarget._id), {
        withCredentials: true,
      });
      toast.success("Tour deleted successfully");
      setTours((prev) => prev.filter((t) => t._id !== deleteTarget._id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete tour");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const categories = ["All", "Adventure", "Beach", "Cultural", "Family", "Honeymoon", "Luxury", "Pilgrimage", "Wildlife"];

  const filtered = tours.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.title.toLowerCase().includes(q) ||
      t.destination?.city?.toLowerCase().includes(q) ||
      t.destination?.country?.toLowerCase().includes(q);
    const matchCat = categoryFilter === "All" || t.category === categoryFilter;
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const activeTours = tours.filter((t) => t.status === "active").length;
  const featuredTours = tours.filter((t) => t.featured).length;
  const avgPrice = tours.length
    ? Math.round(tours.reduce((acc, t) => acc + (t.price || 0), 0) / tours.length)
    : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Tour <span className="text-orange-500">Packages</span>
          </h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            Manage your travel destinations, packages, pricing, and seat availability.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTours}
            disabled={loading}
            title="Refresh"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={16} />
          </button>
          <Link href="/admin/tours/create">
            <AdminButton variant="primary" icon={FiPlus}>
              Create New Tour
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Tours", value: tours.length, sub: "Global itineraries", icon: FiMap, color: "orange" },
          { label: "Active Packages", value: activeTours, sub: "Ready for booking", icon: FiCheckCircle, color: "emerald" },
          { label: "Featured Tours", value: featuredTours, sub: "Promoted collections", icon: FiStar, color: "amber" },
          { label: "Avg. Price", value: `$${avgPrice}`, sub: "Per passenger", icon: FiDollarSign, color: "orange" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{card.label}</span>
              <span className={`rounded-lg bg-${card.color}-50 p-2 text-${card.color}-500`}>
                <card.icon size={18} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="mt-1 text-xs text-gray-500">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by title, city, or country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="text-orange-500" size={15} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none"
          >
            {categories.map((c) => <option key={c} value={c}>Category: {c}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none"
          >
            {["All", "active", "draft", "inactive", "completed"].map((s) => (
              <option key={s} value={s}>Status: {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Table / States ── */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <FiRefreshCw className="animate-spin mb-3" size={32} />
            <p className="text-sm">Loading tours from server…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-red-500">
            <FiAlertCircle className="mb-3" size={32} />
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={fetchTours}
              className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <FiInbox className="mb-3" size={32} />
            <p className="text-sm">No tours found. Try adjusting filters or create a new one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b border-gray-200 bg-gray-50/75 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Tour / Destination</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Seats</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((tour) => (
                  <tr key={tour._id} className="transition hover:bg-orange-50/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {tour.images?.[0] && (
                          <div className="h-12 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                            <img src={tour.images[0]} alt={tour.title} className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/admin/tours/${tour._id}`}
                            className="font-semibold text-gray-900 hover:text-orange-600 transition"
                          >
                            {tour.title}
                          </Link>
                          <p className="text-xs text-gray-500">
                            {tour.destination?.city}, {tour.destination?.country}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                        {tour.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700">
                        <FiClock className="text-orange-500" size={13} />
                        {tour.duration?.days}D / {tour.duration?.nights}N
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">${tour.price}</p>
                      {tour.discountPrice && tour.discountPrice < tour.price && (
                        <p className="text-xs text-emerald-600">Sale: ${tour.discountPrice}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold ${
                          tour.availableSeats === 0
                            ? "text-red-500"
                            : tour.availableSeats < 5
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {tour.availableSeats} / {tour.maxSeats} left
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={tour.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/tours/${tour._id}`}
                          className="rounded p-1.5 text-gray-500 transition hover:bg-orange-50 hover:text-orange-600"
                          title="View"
                        >
                          <FiEye size={15} />
                        </Link>
                        <Link
                          href={`/admin/tours/${tour._id}/edit`}
                          className="rounded p-1.5 text-gray-500 transition hover:bg-orange-50 hover:text-orange-600"
                          title="Edit"
                        >
                          <FiEdit2 size={15} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(tour)}
                          className="rounded p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {!loading && !error && tours.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
            <p className="text-xs text-gray-500">
              Showing <span className="font-medium">{filtered.length}</span> of{" "}
              <span className="font-medium">{tours.length}</span> tours
            </p>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Tour Package"
        message="This action cannot be undone. The tour will be permanently removed."
        itemName={deleteTarget?.title}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
