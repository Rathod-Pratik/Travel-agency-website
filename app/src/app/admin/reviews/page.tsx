"use client";

import { useState } from "react";
import {
  FiStar,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiEyeOff,
  FiTrash2,
  FiMessageSquare,
  FiUser,
  FiMapPin,
  FiCheck,
} from "react-icons/fi";

interface ReviewItem {
  id: string;
  userName: string;
  userEmail: string;
  tourTitle: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  status: "Approved" | "Pending" | "Hidden";
}

const initialReviews: ReviewItem[] = [
  {
    id: "rev-1",
    userName: "Alexander Wright",
    userEmail: "alex.wright@example.com",
    tourTitle: "Bali Tropical Paradise & Islands Escape",
    rating: 5,
    reviewText:
      "Absolutely breathtaking experience! The guides were so warm and knowledgeable, and the beach resorts were 10/10. Highly recommended!",
    createdAt: "2026-08-21",
    status: "Approved",
  },
  {
    id: "rev-2",
    userName: "Sophia Chen",
    userEmail: "sophia.chen@example.com",
    tourTitle: "Swiss Alps Adventure & Glacier Express",
    rating: 5,
    reviewText:
      "The train ride on the Glacier Express was unforgettable. Everything was organized seamlessly from hotel transfers to scenic mountain excursions.",
    createdAt: "2026-08-23",
    status: "Approved",
  },
  {
    id: "rev-3",
    userName: "Liam Johnson",
    userEmail: "liam.j@example.com",
    tourTitle: "Kyoto Heritage & Historic Temples",
    rating: 4,
    reviewText:
      "Beautiful shrines and peaceful bamboo groves. Would have loved 1 extra day in the itinerary, but overall wonderful tour.",
    createdAt: "2026-08-24",
    status: "Pending",
  },
  {
    id: "rev-4",
    userName: "Olivia Davis",
    userEmail: "olivia.davis@example.com",
    tourTitle: "Paris Romance & Loire Valley Castles",
    rating: 5,
    reviewText:
      "Pure magic! The castles looked straight out of a fairy tale. The wine tasting in Loire Valley was a great surprise addition.",
    createdAt: "2026-08-15",
    status: "Approved",
  },
  {
    id: "rev-5",
    userName: "Daniel Martinez",
    userEmail: "dmartinez@example.com",
    tourTitle: "Dubai Desert Safari & Luxury Skylines",
    rating: 3,
    reviewText:
      "The dune bashing was exciting, but the evening camp was a bit crowded. Good value nonetheless.",
    createdAt: "2026-08-25",
    status: "Pending",
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.tourTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(search.toLowerCase());
    const matchesRating =
      ratingFilter === "All" || r.rating.toString() === ratingFilter;
    const matchesStatus =
      statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesRating && matchesStatus;
  });

  const updateStatus = (id: string, newStatus: "Approved" | "Hidden") => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reviews & <span className="text-orange-500">Ratings</span>
          </h1>
          <p className="text-sm text-gray-500">
            Moderate traveler testimonials, ratings, and feedback for published tours.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Reviews</span>
            <span className="rounded-lg bg-orange-50 p-2 text-orange-500">
              <FiMessageSquare size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{reviews.length}</p>
          <p className="mt-1 text-xs text-gray-500">Submitted by travelers</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Average Rating</span>
            <span className="rounded-lg bg-amber-50 p-2 text-amber-500">
              <FiStar size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{averageRating} / 5.0</p>
          <p className="mt-1 text-xs text-amber-600 font-medium">Overall satisfaction score</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">5-Star Ratings</span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-500">
              <FiStar size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {reviews.filter((r) => r.rating === 5).length}
          </p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">Top tier reviews</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pending Moderation</span>
            <span className="rounded-lg bg-orange-50 p-2 text-orange-500">
              <FiCheckCircle size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {reviews.filter((r) => r.status === "Pending").length}
          </p>
          <p className="mt-1 text-xs text-orange-600 font-medium">Awaiting review approval</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by customer, tour title, or review words..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <FiFilter className="text-orange-500" size={16} />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="All">All Stars</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-gray-200 bg-gray-50/75 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Reviewer</th>
                <th className="px-6 py-4">Tour Destination</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="transition hover:bg-orange-50/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{rev.userName}</p>
                          <p className="text-xs text-gray-500">{rev.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {rev.tourTitle}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar
                            key={i}
                            size={14}
                            className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="max-w-xs px-6 py-4 text-xs text-gray-600">
                      <p className="line-clamp-2 italic">"{rev.reviewText}"</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{rev.createdAt}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          rev.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : rev.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {rev.status !== "Approved" && (
                          <button
                            onClick={() => updateStatus(rev.id, "Approved")}
                            title="Approve review"
                            className="rounded p-1.5 text-emerald-600 transition hover:bg-emerald-50"
                          >
                            <FiCheck size={16} />
                          </button>
                        )}
                        {rev.status !== "Hidden" && (
                          <button
                            onClick={() => updateStatus(rev.id, "Hidden")}
                            title="Hide review"
                            className="rounded p-1.5 text-amber-600 transition hover:bg-amber-50"
                          >
                            <FiEyeOff size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(rev.id)}
                          title="Delete review"
                          className="rounded p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
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
                    No reviews found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium">{filteredReviews.length}</span> of{" "}
            <span className="font-medium">{reviews.length}</span> reviews
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
    </div>
  );
}
