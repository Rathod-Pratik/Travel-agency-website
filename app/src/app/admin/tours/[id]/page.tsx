"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiClock,
  FiCheck,
  FiX,
  FiCalendar,
  FiHome,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { AdminButton, AdminCard, StatusBadge, DeleteConfirmModal } from "@components";
import { apiClient } from "@apiClient";
import { GET_TOUR_DETAIL_URL, DELETE_TOUR_URL } from "@utils";

interface ITour {
  _id: string;
  title: string;
  description: string;
  destination: { country: string; city: string };
  duration: { days: number; nights: number };
  price: number;
  discountPrice?: number;
  currency: string;
  category: string;
  availableSeats: number;
  maxSeats: number;
  rating: number;
  totalReviews: number;
  status: string;
  featured: boolean;
  images: string[];
  hotel?: { name: string; address: string; roomType: string; rating?: number };
  food?: { breakfast: boolean; lunch: boolean; dinner: boolean };
  included: string[];
  notIncluded: string[];
  itinerary: { day: number; title: string; description: string; activities?: string[] }[];
}

export default function TourDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [tour, setTour] = useState<ITour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(GET_TOUR_DETAIL_URL(id), {
          withCredentials: true,
        });
        // backend returns data or deata (typo in controller)
        const d: ITour = res.data?.data || res.data?.deata;
        if (!d) throw new Error("Tour not found");
        setTour(d);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message || "Failed to load tour";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleDelete = async () => {
    if (!tour) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(DELETE_TOUR_URL(tour._id), { withCredentials: true });
      toast.success("Tour deleted successfully");
      router.push("/admin/tours");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete tour");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-gray-400">
        <FiRefreshCw className="animate-spin mb-3" size={36} />
        <p className="text-sm">Loading tour details…</p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-red-500">
        <FiAlertCircle className="mb-3" size={36} />
        <p className="text-sm font-medium">{error || "Tour not found"}</p>
        <Link href="/admin/tours">
          <AdminButton variant="outline" className="mt-4">
            Back to Tours
          </AdminButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tours"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600"
          >
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                {tour.category}
              </span>
              <StatusBadge status={tour.status} />
              {tour.featured && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  Featured
                </span>
              )}
            </div>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{tour.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/admin/tours/${tour._id}/edit`}>
            <AdminButton variant="primary" icon={FiEdit2}>Edit Tour</AdminButton>
          </Link>
          <AdminButton variant="danger" icon={FiTrash2} onClick={() => setIsDeleteOpen(true)}>
            Delete
          </AdminButton>
        </div>
      </div>

      {/* ── Hero Image Strip ── */}
      {tour.images && tour.images.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {tour.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Tour image ${i + 1}`}
              className="h-40 w-64 flex-shrink-0 rounded-xl object-cover border border-gray-200"
            />
          ))}
        </div>
      )}

      {/* ── Metric Tiles ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Price</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">${tour.price}</p>
          {tour.discountPrice && tour.discountPrice < tour.price && (
            <p className="text-xs text-emerald-600">Sale: ${tour.discountPrice}</p>
          )}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Duration</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {tour.duration.days}D / {tour.duration.nights}N
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Seat Capacity</p>
          <p className="mt-1 text-2xl font-bold text-orange-600">
            {tour.availableSeats} / {tour.maxSeats}
          </p>
          <p className="text-xs text-gray-500">Remaining</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Rating</p>
          <p className="mt-1 text-2xl font-bold text-amber-500">★ {tour.rating}</p>
          <p className="text-xs text-gray-500">{tour.totalReviews} reviews</p>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Overview */}
          <AdminCard title="Tour Overview">
            <p className="text-sm leading-relaxed text-gray-600">{tour.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 border-t border-gray-100 pt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <FiMapPin className="text-orange-500" size={13} />
                {tour.destination?.city}, {tour.destination?.country}
              </span>
              <span className="flex items-center gap-1.5">
                <FiClock className="text-orange-500" size={13} />
                {tour.duration.days} Days / {tour.duration.nights} Nights
              </span>
            </div>
          </AdminCard>

          {/* Itinerary */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <AdminCard title="Day-by-Day Itinerary" icon={FiCalendar}>
              <div className="space-y-5">
                {tour.itinerary.map((day, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-sm">
                        {day.day}
                      </div>
                      {idx !== tour.itinerary.length - 1 && (
                        <div className="my-1 h-full w-0.5 bg-orange-200" />
                      )}
                    </div>
                    <div className="flex-1 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                      <h3 className="text-sm font-bold text-gray-900">{day.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-gray-600">{day.description}</p>
                      {day.activities && day.activities.length > 0 && (
                        <ul className="mt-2 flex flex-wrap gap-1">
                          {day.activities.map((a, ai) => (
                            <li key={ai} className="rounded bg-orange-50 px-2 py-0.5 text-xs text-orange-700">
                              {a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-6 lg:col-span-1">
          {tour.hotel && (
            <AdminCard title="Accommodation" icon={FiHome}>
              <p className="font-semibold text-gray-900">{tour.hotel.name}</p>
              <p className="text-xs text-gray-500">{tour.hotel.roomType}</p>
              {tour.hotel.address && (
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <FiMapPin size={12} /> {tour.hotel.address}
                </p>
              )}
            </AdminCard>
          )}

          {tour.food && (
            <AdminCard title="Meal Plans">
              <div className="space-y-2 text-xs">
                {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
                  <div key={meal} className="flex items-center justify-between rounded bg-gray-50 p-2">
                    <span className="capitalize font-medium text-gray-700">{meal}</span>
                    <span className={`font-semibold ${tour.food![meal] ? "text-emerald-600" : "text-gray-400"}`}>
                      {tour.food![meal] ? "Included" : "Not included"}
                    </span>
                  </div>
                ))}
              </div>
            </AdminCard>
          )}

          {tour.included && tour.included.length > 0 && (
            <AdminCard title="What's Included">
              <ul className="space-y-2 text-xs text-gray-700">
                {tour.included.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <FiCheck className="mt-0.5 flex-shrink-0 text-emerald-600" size={13} />
                    {inc}
                  </li>
                ))}
              </ul>
            </AdminCard>
          )}

          {tour.notIncluded && tour.notIncluded.length > 0 && (
            <AdminCard title="What's Not Included">
              <ul className="space-y-2 text-xs text-gray-500">
                {tour.notIncluded.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <FiX className="mt-0.5 flex-shrink-0 text-red-500" size={13} />
                    {exc}
                  </li>
                ))}
              </ul>
            </AdminCard>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Tour Package"
        message="This action cannot be undone. The tour will be permanently removed."
        itemName={tour.title}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
