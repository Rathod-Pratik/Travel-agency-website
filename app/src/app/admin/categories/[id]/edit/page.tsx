"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiSave,
  FiFolder,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import {
  FormField,
  TextareaField,
  CheckboxField,
  AdminButton,
  AdminCard,
} from "@components";
import { apiClient } from "@apiClient";
import {
  UPDATE_CATEGORY_URL,
  GET_CATEGORY_BY_ID_URL,
  categoryValidationSchema,
} from "@utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  featured?: boolean;
}

const commonIcons = [
  "🧗",
  "🏖️",
  "🏛️",
  "💍",
  "✨",
  "🦁",
  "🤿",
  "⛷️",
  "🚢",
  "🏕️",
  "🧘",
  "🚲",
];

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const categoryId = resolvedParams.id;

  // Fetch category
  const fetchCategory = async (): Promise<ICategory> => {
    const response = await apiClient.get(
      GET_CATEGORY_BY_ID_URL(categoryId),
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(
        response.data?.message ||
          "Failed to fetch category"
      );
    }

    /*
     * Supports different possible API responses:
     *
     * { data: {...} }
     * { category: {...} }
     * { categories: [...] }
     */
    const category =
      response.data?.data ||
      response.data?.category;

    if (category && !Array.isArray(category)) {
      return category;
    }

    if (Array.isArray(response.data?.categories)) {
      const match = response.data.categories.find(
        (item: ICategory) =>
          item._id === categoryId
      );

      if (match) {
        return match;
      }
    }

    throw new Error("Category not found");
  };

  const {
    data: category,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ICategory, Error>({
    queryKey: ["category", categoryId],
    queryFn: fetchCategory,
    enabled: Boolean(categoryId),
  });

  const formik = useFormik({
    initialValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      icon: category?.icon || "🧗",
      description: category?.description || "",
      featured: category?.featured ?? true,
    },

    validationSchema: categoryValidationSchema,

    enableReinitialize: true,

    onSubmit: async (
      values,
      { setSubmitting }
    ) => {
      try {
        const payload = {
          name: values.name,
          slug: values.slug,
          icon: values.icon,
          description: values.description,
          featured: values.featured,
        };

        const response = await apiClient.put(
          UPDATE_CATEGORY_URL(categoryId),
          payload,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          toast.success(
            "Category updated successfully!"
          );

          // Update/invalidate React Query cache
          await queryClient.invalidateQueries({
            queryKey: ["category", categoryId],
          });

          await queryClient.invalidateQueries({
            queryKey: ["categories"],
          });

          router.push(
            `/admin/categories/${categoryId}`
          );
        }
      } catch (err: any) {
        console.error(
          "Update category error:",
          err
        );

        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to update category"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <FiRefreshCw
          className="mb-3 animate-spin"
          size={32}
        />

        <p className="text-sm">
          Loading category...
        </p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-red-500">
        <FiAlertCircle
          className="mb-3"
          size={32}
        />

        <p className="text-sm font-medium">
          {error?.message ||
            "Failed to load category"}
        </p>

        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <FiAlertCircle
          className="mb-3"
          size={32}
        />

        <p className="text-sm">
          Category not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/categories/${categoryId}`}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <FiArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit{" "}
              <span className="text-orange-500">
                Category
              </span>
            </h1>

            <p className="text-sm text-gray-500">
              Updating ID:{" "}
              <span className="font-mono">
                {categoryId}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/categories/${categoryId}`}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <AdminButton
            type="button"
            variant="primary"
            icon={FiSave}
            isLoading={formik.isSubmitting}
            onClick={() =>
              formik.handleSubmit()
            }
          >
            Save Changes
          </AdminButton>
        </div>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="max-w-2xl space-y-6"
      >
        <AdminCard
          title="Category Details"
          icon={FiFolder}
        >
          <div className="space-y-5">
            {/* Name */}
            <FormField
              label="Category Name"
              name="name"
              required
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.name}
              touched={formik.touched.name}
            />

            {/* Slug */}
            <FormField
              label="URL Slug"
              name="slug"
              required
              value={formik.values.slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.slug}
              touched={formik.touched.slug}
            />

            {/* Icon */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Icon / Emoji *
              </label>

              <div className="flex flex-wrap gap-2 mb-2">
                {commonIcons.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() =>
                      formik.setFieldValue(
                        "icon",
                        ic
                      )
                    }
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xl transition ${
                      formik.values.icon === ic
                        ? "border-orange-500 bg-orange-50 scale-110 shadow-sm"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>

              <FormField
                name="icon"
                value={formik.values.icon}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.icon}
                touched={formik.touched.icon}
              />
            </div>

            {/* Description */}
            <TextareaField
              label="Description"
              name="description"
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.description}
              touched={formik.touched.description}
            />

            {/* Featured */}
            <CheckboxField
              label="Feature this category on the public website homepage"
              name="featured"
              checked={formik.values.featured}
              onChange={(e) =>
                formik.setFieldValue(
                  "featured",
                  e.target.checked
                )
              }
            />
          </div>
        </AdminCard>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href={`/admin/categories/${categoryId}`}
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
            Save Changes
          </AdminButton>
        </div>
      </form>

      {/* End Form */}
    </div>
  );
}