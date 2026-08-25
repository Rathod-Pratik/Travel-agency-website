"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import {
  FiArrowLeft, FiSave, FiHome, FiDollarSign, FiCheck,
  FiRefreshCw, FiAlertCircle,
} from "react-icons/fi";
import {
  FormField, TextareaField, CheckboxField, AdminButton, AdminCard,
} from "@components";
import { apiClient } from "@apiClient";
import { GET_HOTEL_DETAIL_URL, UPDATE_HOTEL_URL, hotelValidationSchema } from "@utils";

const AMENITIES = [
  "High-speed Free WiFi", "Infinity Swimming Pool", "Luxury Wellness Spa",
  "Airport Shuttle Service", "Fitness Center & Gym", "24/7 Room Concierge",
];

export default function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      name: "", address: "", city: "", country: "",
      rating: 4.5, roomType: "", pricePerPerson: 0, availableRooms: 1,
      breakfast: false, lunch: false, dinner: false, description: "", isActive: true,
    },
    validationSchema: hotelValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          name: values.name,
          address: values.address,
          city: values.city,
          country: values.country,
          rating: Number(values.rating),
          roomType: values.roomType,
          pricePerPerson: Number(values.pricePerPerson),
          availableRooms: Number(values.availableRooms),
          meal: { breakfast: values.breakfast, lunch: values.lunch, dinner: values.dinner },
          isActive: values.isActive,
          description: values.description,
          amenities: selectedAmenities,
        };
        await apiClient.put(UPDATE_HOTEL_URL(id), payload, { withCredentials: true });
        toast.success("Hotel updated successfully!");
        router.push(`/admin/hotels/${id}`);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to update hotel");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchHotel = async () => {
      setFetchLoading(true);
      setFetchError(null);
      try {
        const res = await apiClient.get(GET_HOTEL_DETAIL_URL(id), { withCredentials: true });
        const d = res.data?.data || res.data?.hotel;
        if (!d) throw new Error("Hotel not found");
        formik.setValues({
          name: d.name || "",
          address: d.address || "",
          city: d.city || "",
          country: d.country || "",
          rating: d.rating || 4.5,
          roomType: d.roomType || "",
          pricePerPerson: d.pricePerPerson || 0,
          availableRooms: d.availableRooms || 1,
          breakfast: d.meal?.breakfast ?? false,
          lunch: d.meal?.lunch ?? false,
          dinner: d.meal?.dinner ?? false,
          description: d.description || "",
          isActive: d.isActive !== false,
        });
        if (Array.isArray(d.amenities)) setSelectedAmenities(d.amenities);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message || "Failed to load hotel";
        setFetchError(msg);
        toast.error(msg);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const toggleAmenity = (item: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );

  if (fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-gray-400">
        <FiRefreshCw className="animate-spin mb-3" size={36} />
        <p className="text-sm">Loading hotel data…</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-red-500">
        <FiAlertCircle className="mb-3" size={36} />
        <p className="text-sm font-medium">{fetchError}</p>
        <Link href="/admin/hotels">
          <AdminButton variant="outline" className="mt-4">Back to Hotels</AdminButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/admin/hotels/${id}`}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600">
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit <span className="text-orange-500">Partner Hotel</span>
            </h1>
            <p className="font-mono text-xs text-gray-400">{id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/hotels/${id}`} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
          <AdminButton type="button" variant="primary" icon={FiSave} isLoading={formik.isSubmitting} onClick={formik.handleSubmit}>
            Save Changes
          </AdminButton>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Property Details */}
        <AdminCard title="Property Details" icon={FiHome}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField label="Hotel Name" name="name" required value={formik.values.name}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.errors.name} touched={formik.touched.name} />
            </div>
            <div className="md:col-span-2">
              <FormField label="Address" name="address" required value={formik.values.address}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.errors.address} touched={formik.touched.address} />
            </div>
            <FormField label="City / Island" name="city" value={formik.values.city}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.city} touched={formik.touched.city} />
            <FormField label="Country" name="country" value={formik.values.country}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.country} touched={formik.touched.country} />
            <div className="md:col-span-2">
              <TextareaField label="Overview / Highlights" name="description" rows={3}
                value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.errors.description} touched={formik.touched.description} />
            </div>
          </div>
        </AdminCard>

        {/* Room Specs & Pricing */}
        <AdminCard title="Room Specifications & Pricing" icon={FiDollarSign}>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <FormField label="Room Type" name="roomType" required value={formik.values.roomType}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.roomType} touched={formik.touched.roomType} />
            <FormField label="Price / Person ($)" name="pricePerPerson" type="number" min={1} required
              value={formik.values.pricePerPerson} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.pricePerPerson} touched={formik.touched.pricePerPerson} />
            <FormField label="Available Rooms" name="availableRooms" type="number" min={1} required
              value={formik.values.availableRooms} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.availableRooms} touched={formik.touched.availableRooms} />
            <FormField label="Star Rating" name="rating" type="number" step="0.1" min={1} max={5} required
              value={formik.values.rating} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.rating} touched={formik.touched.rating} />
          </div>
          <div className="mt-6 border-t border-gray-100 pt-4 flex items-center gap-6">
            <CheckboxField label="Breakfast" name="breakfast" checked={formik.values.breakfast}
              onChange={(e) => formik.setFieldValue("breakfast", e.target.checked)} />
            <CheckboxField label="Lunch" name="lunch" checked={formik.values.lunch}
              onChange={(e) => formik.setFieldValue("lunch", e.target.checked)} />
            <CheckboxField label="Dinner" name="dinner" checked={formik.values.dinner}
              onChange={(e) => formik.setFieldValue("dinner", e.target.checked)} />
          </div>
        </AdminCard>

        {/* Amenities */}
        <AdminCard title="Hotel Amenities & Services">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {AMENITIES.map((item) => (
              <label key={item} onClick={() => toggleAmenity(item)}
                className={`flex items-center gap-2.5 rounded-lg border p-3 text-xs font-medium cursor-pointer transition ${
                  selectedAmenities.includes(item)
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}>
                <div className={`flex h-4 w-4 items-center justify-center rounded border ${
                  selectedAmenities.includes(item)
                    ? "border-orange-500 bg-orange-500 text-white" : "border-gray-300 bg-white"
                }`}>
                  {selectedAmenities.includes(item) && <FiCheck size={11} />}
                </div>
                {item}
              </label>
            ))}
          </div>
        </AdminCard>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Link href={`/admin/hotels/${id}`} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
          <AdminButton type="submit" variant="primary" icon={FiSave} isLoading={formik.isSubmitting}>
            Save Changes
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
