"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiArrowLeft, FiEdit2, FiTrash2, FiMapPin, FiCheck,
  FiHome, FiCoffee, FiRefreshCw, FiAlertCircle,
} from "react-icons/fi";
import { AdminButton, AdminCard, StatusBadge, DeleteConfirmModal } from "@components";
import { apiClient } from "@apiClient";
import { GET_HOTEL_DETAIL_URL, DELETE_HOTEL_URL } from "@utils";

interface IHotel {
  _id: string;
  name: string;
  rating: number;
  address: string;
  city?: string;
  country?: string;
  roomType: string;
  pricePerPerson: number;
  availableRooms: number;
  isActive: boolean;
  description?: string;
  images?: string[];
  meal: { breakfast: boolean; lunch: boolean; dinner: boolean };
  amenities?: string[];
}

export default function HotelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [hotel, setHotel] = useState<IHotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(GET_HOTEL_DETAIL_URL(id), { withCredentials: true });
        const d: IHotel = res.data?.data || res.data?.hotel;
        if (!d) throw new Error("Hotel not found");
        setHotel(d);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message || "Failed to load hotel";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const handleDelete = async () => {
    if (!hotel) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(DELETE_HOTEL_URL(hotel._id), { withCredentials: true });
      toast.success("Hotel deleted successfully");
      router.push("/admin/hotels");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete hotel");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-gray-400">
        <FiRefreshCw className="animate-spin mb-3" size={36} />
        <p className="text-sm">Loading hotel details…</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-red-500">
        <FiAlertCircle className="mb-3" size={36} />
        <p className="text-sm font-medium">{error || "Hotel not found"}</p>
        <Link href="/admin/hotels">
          <AdminButton variant="outline" className="mt-4">Back to Hotels</AdminButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/hotels"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600">
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-500 text-sm">★ {hotel.rating} / 5.0</span>
              <StatusBadge status={hotel.isActive ? "active" : "inactive"} label={hotel.isActive ? "ACTIVE PARTNER" : "INACTIVE"} />
            </div>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{hotel.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/hotels/${hotel._id}/edit`}>
            <AdminButton variant="primary" icon={FiEdit2}>Edit Hotel</AdminButton>
          </Link>
          <AdminButton variant="danger" icon={FiTrash2} onClick={() => setIsDeleteOpen(true)}>Delete</AdminButton>
        </div>
      </div>

      {/* ── Image Strip ── */}
      {hotel.images && hotel.images.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {hotel.images.map((img, i) => (
            <img key={i} src={img} alt={`Hotel image ${i + 1}`}
              className="h-40 w-64 flex-shrink-0 rounded-xl object-cover border border-gray-200" />
          ))}
        </div>
      )}

      {/* ── Metrics ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Nightly Price</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">${hotel.pricePerPerson}</p>
          <p className="text-xs text-gray-500">Per guest / night</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Available Rooms</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{hotel.availableRooms}</p>
          <p className="text-xs text-gray-500">Ready for allocation</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Room Category</p>
          <p className="mt-1 text-base font-bold text-gray-900 truncate">{hotel.roomType}</p>
          <p className="text-xs text-gray-500">Standard contract</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Star Rating</p>
          <p className="mt-1 text-2xl font-bold text-amber-500">★ {hotel.rating}</p>
          <p className="text-xs text-gray-500">Certified rating</p>
        </div>
      </div>

      {/* ── Content grid ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminCard title="Hotel Overview" icon={FiHome}>
            {hotel.description && (
              <p className="text-sm leading-relaxed text-gray-600">{hotel.description}</p>
            )}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-4">
              <FiMapPin className="text-orange-500" size={13} />
              {hotel.address}
              {hotel.city && `, ${hotel.city}`}
              {hotel.country && `, ${hotel.country}`}
            </div>
          </AdminCard>

          {hotel.amenities && hotel.amenities.length > 0 && (
            <AdminCard title="Amenities & Facilities">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {hotel.amenities.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50/75 p-3 text-xs font-medium text-gray-700">
                    <FiCheck className="text-orange-500" size={13} />
                    {item}
                  </div>
                ))}
              </div>
            </AdminCard>
          )}
        </div>

        <div className="lg:col-span-1">
          <AdminCard title="Meal Plan Inclusions" icon={FiCoffee}>
            <div className="space-y-2 text-xs">
              {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
                <div key={meal} className="flex items-center justify-between rounded bg-gray-50 p-2">
                  <span className="capitalize font-medium text-gray-700">{meal}</span>
                  <span className={`font-semibold ${hotel.meal?.[meal] ? "text-emerald-600" : "text-gray-400"}`}>
                    {hotel.meal?.[meal] ? "Included" : "Not Included"}
                  </span>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        title="Remove Hotel Partner"
        message="This action cannot be undone."
        itemName={hotel.name}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
