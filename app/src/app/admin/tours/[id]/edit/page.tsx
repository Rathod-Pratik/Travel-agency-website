"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiSave,
  FiPlus,
  FiTrash2,
  FiMapPin,
  FiCalendar,
  FiLayers,
  FiCheck,
  FiHome,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import {
  FormField,
  SelectField,
  TextareaField,
  CheckboxField,
  AdminButton,
  AdminCard,
} from "@components";
import { apiClient } from "@apiClient";
import { GET_TOUR_DETAIL_URL, UPDATE_TOUR_URL, tourValidationSchema } from "@utils";

const CATEGORIES = ["Adventure", "Beach", "Cultural", "Family", "Honeymoon", "Luxury", "Pilgrimage", "Wildlife"];

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [inclusions, setInclusions] = useState<string[]>([]);
  const [newInclusion, setNewInclusion] = useState("");
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [newExclusion, setNewExclusion] = useState("");
  const [itinerary, setItinerary] = useState<{ day: number; title: string; description: string }[]>([]);

  const formik = useFormik({
    initialValues: {
      title: "",
      slug: "",
      description: "",
      category: "Adventure",
      country: "",
      city: "",
      days: 1,
      nights: 0,
      price: 0,
      discountPrice: 0,
      currency: "USD",
      maxSeats: 1,
      availableSeats: 0,
      hotelName: "",
      roomType: "",
      breakfast: false,
      lunch: false,
      dinner: false,
      status: "draft",
      featured: false,
    },
    validationSchema: tourValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          title: values.title,
          slug: values.slug,
          description: values.description,
          category: values.category,
          destination: { country: values.country, city: values.city },
          duration: { days: Number(values.days), nights: Number(values.nights) },
          price: Number(values.price),
          discountPrice: Number(values.discountPrice) || undefined,
          currency: values.currency,
          maxSeats: Number(values.maxSeats),
          availableSeats: Number(values.availableSeats),
          status: values.status,
          featured: values.featured,
          included: inclusions,
          notIncluded: exclusions,
          itinerary: itinerary.map((item, idx) => ({
            day: idx + 1,
            title: item.title,
            description: item.description,
            activities: [],
          })),
          hotel: values.hotelName
            ? { name: values.hotelName, address: `${values.city}, ${values.country}`, roomType: values.roomType }
            : undefined,
          food: { breakfast: values.breakfast, lunch: values.lunch, dinner: values.dinner },
        };

        await apiClient.put(UPDATE_TOUR_URL(id), payload, { withCredentials: true });
        toast.success("Tour updated successfully!");
        router.push(`/admin/tours/${id}`);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to update tour");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Fetch existing tour data and populate form
  useEffect(() => {
    const fetchTour = async () => {
      setFetchLoading(true);
      setFetchError(null);
      try {
        const res = await apiClient.get(GET_TOUR_DETAIL_URL(id), { withCredentials: true });
        const d = res.data?.data || res.data?.deata;
        if (!d) throw new Error("Tour not found");

        formik.setValues({
          title: d.title || "",
          slug: d.slug || "",
          description: d.description || "",
          category: d.category || "Adventure",
          country: d.destination?.country || "",
          city: d.destination?.city || "",
          days: d.duration?.days || 1,
          nights: d.duration?.nights || 0,
          price: d.price || 0,
          discountPrice: d.discountPrice || 0,
          currency: d.currency || "USD",
          maxSeats: d.maxSeats || 1,
          availableSeats: d.availableSeats || 0,
          hotelName: d.hotel?.name || "",
          roomType: d.hotel?.roomType || "",
          breakfast: d.food?.breakfast ?? false,
          lunch: d.food?.lunch ?? false,
          dinner: d.food?.dinner ?? false,
          status: d.status || "draft",
          featured: Boolean(d.featured),
        });
        setInclusions(Array.isArray(d.included) ? d.included : []);
        setExclusions(Array.isArray(d.notIncluded) ? d.notIncluded : []);
        setItinerary(
          Array.isArray(d.itinerary)
            ? d.itinerary.map((item: any) => ({
                day: item.day,
                title: item.title || "",
                description: item.description || "",
              }))
            : []
        );
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message || "Failed to load tour";
        setFetchError(msg);
        toast.error(msg);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const addInclusion = () => {
    if (newInclusion.trim()) { setInclusions([...inclusions, newInclusion.trim()]); setNewInclusion(""); }
  };
  const addExclusion = () => {
    if (newExclusion.trim()) { setExclusions([...exclusions, newExclusion.trim()]); setNewExclusion(""); }
  };
  const addDay = () =>
    setItinerary([...itinerary, { day: itinerary.length + 1, title: "", description: "" }]);
  const removeDay = (i: number) =>
    setItinerary(itinerary.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 })));

  if (fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-gray-400">
        <FiRefreshCw className="animate-spin mb-3" size={36} />
        <p className="text-sm">Loading tour data…</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-red-500">
        <FiAlertCircle className="mb-3" size={36} />
        <p className="text-sm font-medium">{fetchError}</p>
        <Link href="/admin/tours">
          <AdminButton variant="outline" className="mt-4">Back to Tours</AdminButton>
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
            href={`/admin/tours/${id}`}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600"
          >
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit <span className="text-orange-500">Tour Package</span>
            </h1>
            <p className="font-mono text-xs text-gray-400">{id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/tours/${id}`} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
          <AdminButton type="button" variant="primary" icon={FiSave} isLoading={formik.isSubmitting} onClick={formik.handleSubmit}>
            Save Changes
          </AdminButton>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <AdminCard title="Basic Information" icon={FiLayers}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField label="Tour Title" name="title" required
                value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.errors.title} touched={formik.touched.title} />
            </div>
            <FormField label="URL Slug" name="slug"
              value={formik.values.slug} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.slug} touched={formik.touched.slug} />
            <SelectField label="Category" name="category" required options={CATEGORIES}
              value={formik.values.category} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.category} touched={formik.touched.category} />
            <div className="md:col-span-2">
              <TextareaField label="Description" name="description" required rows={4}
                value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.errors.description} touched={formik.touched.description} />
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <CheckboxField label="Feature on homepage" name="featured" checked={formik.values.featured}
                onChange={(e) => formik.setFieldValue("featured", e.target.checked)} />
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-gray-600">Status:</span>
                <select name="status" value={formik.values.status} onChange={formik.handleChange}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium focus:border-orange-500 focus:outline-none">
                  {["active","draft","inactive","completed"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Destination & Pricing */}
        <AdminCard title="Destination & Pricing" icon={FiMapPin}>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <FormField label="Country" name="country" required value={formik.values.country}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.country} touched={formik.touched.country} />
            <FormField label="City / Region" name="city" required value={formik.values.city}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.city} touched={formik.touched.city} />
            <FormField label="Days" name="days" type="number" min={1} required value={formik.values.days}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.days} touched={formik.touched.days} />
            <FormField label="Nights" name="nights" type="number" min={0} required value={formik.values.nights}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.nights} touched={formik.touched.nights} />
            <FormField label="Price ($)" name="price" type="number" min={1} required value={formik.values.price}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.price} touched={formik.touched.price} />
            <FormField label="Discount Price ($)" name="discountPrice" type="number" min={0} value={formik.values.discountPrice}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.discountPrice} touched={formik.touched.discountPrice} />
            <FormField label="Max Seats" name="maxSeats" type="number" min={1} required value={formik.values.maxSeats}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.maxSeats} touched={formik.touched.maxSeats} />
            <FormField label="Available Seats" name="availableSeats" type="number" min={0} required value={formik.values.availableSeats}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.errors.availableSeats} touched={formik.touched.availableSeats} />
          </div>
        </AdminCard>

        {/* Itinerary */}
        <AdminCard title="Itinerary Schedule" icon={FiCalendar}
          action={
            <button type="button" onClick={addDay}
              className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-100">
              <FiPlus size={13} /> Add Day
            </button>
          }>
          {itinerary.length === 0 ? (
            <p className="py-6 text-center text-xs text-gray-400">No itinerary days yet. Click "Add Day" to start.</p>
          ) : (
            <div className="space-y-4">
              {itinerary.map((item, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-md bg-orange-500 px-2.5 py-1 text-xs font-bold text-white">Day {item.day}</span>
                    <button type="button" onClick={() => removeDay(i)} className="text-gray-400 hover:text-red-500">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                  <div className="grid gap-3">
                    <input type="text" placeholder="Day Title" value={item.title}
                      onChange={(e) => { const u = [...itinerary]; u[i].title = e.target.value; setItinerary(u); }}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none" />
                    <textarea rows={2} placeholder="Day description / activities…" value={item.description}
                      onChange={(e) => { const u = [...itinerary]; u[i].description = e.target.value; setItinerary(u); }}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Inclusions & Exclusions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AdminCard title="What's Included">
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="Add perk…" value={newInclusion} onChange={(e) => setNewInclusion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInclusion())}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none" />
              <button type="button" onClick={addInclusion}
                className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600">Add</button>
            </div>
            <ul className="space-y-2">
              {inclusions.map((item, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-xs text-emerald-900">
                  <span className="flex items-center gap-2"><FiCheck className="text-emerald-600" />{item}</span>
                  <button type="button" onClick={() => setInclusions(inclusions.filter((_, idx) => idx !== i))} className="text-emerald-400 hover:text-red-500"><FiTrash2 size={13} /></button>
                </li>
              ))}
            </ul>
          </AdminCard>
          <AdminCard title="What's Not Included">
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="Add exclusion…" value={newExclusion} onChange={(e) => setNewExclusion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExclusion())}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none" />
              <button type="button" onClick={addExclusion}
                className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600">Add</button>
            </div>
            <ul className="space-y-2">
              {exclusions.map((item, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700">
                  <span>{item}</span>
                  <button type="button" onClick={() => setExclusions(exclusions.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500"><FiTrash2 size={13} /></button>
                </li>
              ))}
            </ul>
          </AdminCard>
        </div>

        {/* Hotel */}
        <AdminCard title="Hotel Partner & Dining" icon={FiHome}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField label="Assigned Hotel" name="hotelName" value={formik.values.hotelName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            <FormField label="Room Category" name="roomType" value={formik.values.roomType} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            <div className="md:col-span-2 flex items-center gap-6">
              <CheckboxField label="Breakfast" name="breakfast" checked={formik.values.breakfast}
                onChange={(e) => formik.setFieldValue("breakfast", e.target.checked)} />
              <CheckboxField label="Lunch" name="lunch" checked={formik.values.lunch}
                onChange={(e) => formik.setFieldValue("lunch", e.target.checked)} />
              <CheckboxField label="Dinner" name="dinner" checked={formik.values.dinner}
                onChange={(e) => formik.setFieldValue("dinner", e.target.checked)} />
            </div>
          </div>
        </AdminCard>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Link href={`/admin/tours/${id}`} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
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
