"use client";

import { useEffect, useState } from "react";
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
import { FiImage, FiX } from "react-icons/fi";
import Image from "next/image";

export default function CreateHotelPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));

    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const amenities = [
    "High-speed Free WiFi",
    "Infinity Swimming Pool",
    "Luxury Wellness Spa",
    "Airport Shuttle Service",
    "Fitness Center & Gym",
    "24/7 Room Concierge",
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "",
    "",
  ]);

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      city: "",
      country: "",
      rating: 0,
      roomType: "",
      pricePerPerson: null,
      availableRooms: null,
      breakfast: false,
      lunch: false,
      dinner: false,
      description: "",
      isActive: false,
      amenities: [],
    },
    validationSchema: hotelValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("address", values.address);
        formData.append("city", values.city);
        formData.append("country", values.country);
        formData.append("rating", String(Number(values.rating)));
        formData.append("roomType", values.roomType);
        formData.append(
          "pricePerPerson",
          String(Number(values.pricePerPerson))
        );
        formData.append(
          "availableRooms",
          String(Number(values.availableRooms))
        );

        formData.append(
          "meal",
          JSON.stringify({
            breakfast: values.breakfast,
            lunch: values.lunch,
            dinner: values.dinner,
          })
        );

        formData.append("isActive", String(values.isActive));
        formData.append("description", values.description);
        formData.append(
          "amenities",
          JSON.stringify(selectedAmenities)
        );

        // Multiple images
        images.forEach((image) => {
          formData.append("image", image);
        });

        const response = await apiClient.post(CREATE_HOTEL_URL, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 201) {
          toast.success("Hotel partner added successfully!");
          router.push("/admin/hotels");
        }

      } catch (err: any) {
        console.error("Create hotel error:", err);

        toast.error(
          err?.response?.data?.message ||
          "Failed to create hotel. Please try again."
        );
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
          <div className="space-y-4 mb-6">
            {/* Upload Card */}
            <label
              htmlFor="hotel-images"
              className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-orange-400 hover:bg-orange-50"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                <FiImage size={24} />
              </div>

              <p className="text-sm font-semibold text-gray-700">
                Upload Hotel Images
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Click to select multiple images
              </p>

              <p className="mt-2 text-xs text-gray-400">
                PNG, JPG, JPEG up to 5MB each
              </p>

              <input
                id="hotel-images"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                multiple
                hidden
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);

                  setImages((prev) => [...prev, ...files]);

                  // Allows selecting the same image again
                  e.target.value = "";
                }}
              />
            </label>

            {/* Image Preview */}
            {images.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">
                    Selected Images ({images.length})
                  </p>

                  <button
                    type="button"
                    onClick={() => setImages([])}
                    className="text-xs font-medium text-red-500 hover:text-red-600"
                  >
                    Remove All
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {previews.map((url, index) => (
                    <div
                      key={`${images[index].name}-${images[index].lastModified}-${index}`}
                      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white"
                    >
                      <Image
                        src={url}
                        alt={images[index].name}
                        className="h-32 w-full object-cover"
                        height={128}
                        width={128}
                        unoptimized
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
                      >
                        <FiX size={14} />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                        <p className="truncate text-[10px] text-white">
                          {images[index].name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
          <div className="mt-6 border-t border-gray-100 pt-4">
            <label className="text-xs font-semibold uppercase text-gray-600">
              Hotel Status
            </label>
            <div className="mt-3 flex items-center gap-6 text-sm text-gray-700">
          <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-gray-600">
                  Status:
                </span>
                <select
                  name="isActive"
                  value={formik.values.isActive ? "active" : "inactive"}
                  onChange={formik.handleChange}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium focus:border-orange-500 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
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
                className={`flex items-center gap-2.5 rounded-lg border p-3 text-xs font-medium cursor-pointer transition ${selectedAmenities.includes(item)
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  }`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border ${selectedAmenities.includes(item)
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
