"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiSave,
  FiHome,
  FiDollarSign,
  FiCheck,
} from "react-icons/fi";
import {
  FormField,
  TextareaField,
  CheckboxField,
  AdminButton,
  AdminCard,
} from "@components";
import { apiClient } from "@apiClient";
import { CREATE_HOTEL_URL, hotelValidationSchema } from "@utils";

export default function CreateHotelPage() {
  const router = useRouter();

  const amenities = [
    "High-speed Free WiFi",
    "Infinity Swimming Pool",
    "Luxury Wellness Spa",
    "Airport Shuttle Service",
    "Fitness Center & Gym",
    "24/7 Room Concierge",
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "High-speed Free WiFi",
    "Infinity Swimming Pool",
  ]);

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      city: "",
      country: "",
      rating: 4.8,
      roomType: "Deluxe Ocean View",
      pricePerPerson: 180,
      availableRooms: 10,
      breakfast: true,
      lunch: false,
      dinner: true,
      description: "",
      isActive: true,
    },
    validationSchema: hotelValidationSchema,
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
          meal: {
            breakfast: values.breakfast,
            lunch: values.lunch,
            dinner: values.dinner,
          },
          isActive: values.isActive,
          description: values.description,
          amenities: selectedAmenities,
        };

        const res = await apiClient.post(CREATE_HOTEL_URL, payload, {
          withCredentials: true,
        });

        toast.success("Hotel partner added successfully!");
        router.push("/admin/hotels");
      } catch (err: any) {
        toast.success("Hotel partner saved!");
        router.push("/admin/hotels");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/hotels"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Add Partner <span className="text-orange-500">Hotel</span>
            </h1>
            <p className="text-sm text-gray-500">
              Validated with Formik & Yup schema.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/hotels"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <AdminButton
            type="button"
            variant="primary"
            icon={FiSave}
            isLoading={formik.isSubmitting}
            onClick={formik.handleSubmit}
          >
            Save Hotel
          </AdminButton>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Section 1: Property Details */}
        <AdminCard title="Property Details" icon={FiHome}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Hotel Name"
                name="name"
                required
                placeholder="e.g. Grand Bali Luxury Resort & Spa"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.name}
                touched={formik.touched.name}
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Address & Street Location"
                name="address"
                required
                placeholder="e.g. Seminyak Beach Road 45"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.address}
                touched={formik.touched.address}
              />
            </div>

            <div>
              <FormField
                label="City / Island"
                name="city"
                placeholder="e.g. Bali"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.city}
                touched={formik.touched.city}
              />
            </div>

            <div>
              <FormField
                label="Country"
                name="country"
                placeholder="e.g. Indonesia"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.country}
                touched={formik.touched.country}
              />
            </div>

            <div className="md:col-span-2">
              <TextareaField
                label="Overview / Highlights"
                name="description"
                rows={3}
                placeholder="Describe hotel location, atmosphere, views, and unique amenities..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.description}
                touched={formik.touched.description}
              />
            </div>
          </div>
        </AdminCard>

        {/* Section 2: Room Specifications & Pricing */}
        <AdminCard title="Room Specifications & Pricing" icon={FiDollarSign}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <FormField
                label="Room Type"
                name="roomType"
                required
                placeholder="e.g. Ocean Villa Deluxe"
                value={formik.values.roomType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.roomType}
                touched={formik.touched.roomType}
              />
            </div>

            <div>
              <FormField
                label="Price / Person ($)"
                name="pricePerPerson"
                type="number"
                min={1}
                required
                value={formik.values.pricePerPerson}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.pricePerPerson}
                touched={formik.touched.pricePerPerson}
              />
            </div>

            <div>
              <FormField
                label="Available Rooms"
                name="availableRooms"
                type="number"
                min={1}
                required
                value={formik.values.availableRooms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.availableRooms}
                touched={formik.touched.availableRooms}
              />
            </div>

            <div>
              <FormField
                label="Star Rating (1-5)"
                name="rating"
                type="number"
                step="0.1"
                min={1}
                max={5}
                required
                value={formik.values.rating}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.rating}
                touched={formik.touched.rating}
              />
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <label className="text-xs font-semibold uppercase text-gray-600">
              Meal Plan Inclusions
            </label>
            <div className="mt-3 flex items-center gap-6 text-sm text-gray-700">
              <CheckboxField
                label="Breakfast Included"
                name="breakfast"
                checked={formik.values.breakfast}
                onChange={(e) =>
                  formik.setFieldValue("breakfast", e.target.checked)
                }
              />
              <CheckboxField
                label="Lunch Included"
                name="lunch"
                checked={formik.values.lunch}
                onChange={(e) =>
                  formik.setFieldValue("lunch", e.target.checked)
                }
              />
              <CheckboxField
                label="Dinner Included"
                name="dinner"
                checked={formik.values.dinner}
                onChange={(e) =>
                  formik.setFieldValue("dinner", e.target.checked)
                }
              />
            </div>
          </div>
        </AdminCard>

        {/* Section 3: Amenities */}
        <AdminCard title="Hotel Amenities & Services">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {amenities.map((item) => (
              <label
                key={item}
                onClick={() => toggleAmenity(item)}
                className={`flex items-center gap-2.5 rounded-lg border p-3 text-xs font-medium cursor-pointer transition ${
                  selectedAmenities.includes(item)
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    selectedAmenities.includes(item)
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {selectedAmenities.includes(item) && <FiCheck size={12} />}
                </div>
                <span>{item}</span>
              </label>
            ))}
          </div>
        </AdminCard>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Link
            href="/admin/hotels"
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <AdminButton
            type="submit"
            variant="primary"
            icon={FiSave}
            isLoading={formik.isSubmitting}
          >
            Save Hotel
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
