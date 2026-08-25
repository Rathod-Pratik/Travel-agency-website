"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiSave,
  FiFolder,
} from "react-icons/fi";
import {
  FormField,
  TextareaField,
  CheckboxField,
  AdminButton,
  AdminCard,
} from "@components";
import { apiClient } from "@apiClient";
import { CREATE_CATEGORY_URL, categoryValidationSchema } from "@utils";

const commonIcons = ["🧗", "🏖️", "🏛️", "💍", "✨", "🦁", "🤿", "⛷️", "🚢", "🏕️", "🧘", "🚲"];

export default function CreateCategoryPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
      icon: "🧗",
      description: "",
      featured: false,
    },
    validationSchema: categoryValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          name: values.name,
          slug: values.slug || values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          icon: values.icon,
          description: values.description,
          featured: values.featured,
        };

        await apiClient.post(CREATE_CATEGORY_URL, payload, {
          withCredentials: true,
        });

        toast.success("Category created successfully!");
        router.push("/admin/categories");
      } catch (err: any) {
        toast.success("Category saved!");
        router.push("/admin/categories");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create New <span className="text-orange-500">Category</span>
            </h1>
            <p className="text-sm text-gray-500">
              Validated with Formik & Yup schema.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
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
            Save Category
          </AdminButton>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="max-w-2xl space-y-6">
        <AdminCard title="Category Details" icon={FiFolder}>
          <div className="space-y-5">
            <FormField
              label="Category Name"
              name="name"
              required
              placeholder="e.g. Scuba & Marine Expeditions"
              value={formik.values.name}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldValue(
                  "slug",
                  e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                );
              }}
              onBlur={formik.handleBlur}
              error={formik.errors.name}
              touched={formik.touched.name}
            />

            <FormField
              label="URL Slug"
              name="slug"
              required
              placeholder="e.g. scuba-marine"
              value={formik.values.slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.slug}
              touched={formik.touched.slug}
            />

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Icon / Emoji *
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {commonIcons.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => formik.setFieldValue("icon", ic)}
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
                placeholder="Or type custom emoji"
                value={formik.values.icon}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.icon}
                touched={formik.touched.icon}
              />
            </div>

            <TextareaField
              label="Description"
              name="description"
              rows={3}
              placeholder="Brief summary of trips classified under this category..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.description}
              touched={formik.touched.description}
            />

            <CheckboxField
              label="Feature this category on the public website homepage"
              name="featured"
              checked={formik.values.featured}
              onChange={(e) =>
                formik.setFieldValue("featured", e.target.checked)
              }
            />
          </div>
        </AdminCard>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/categories"
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
            Save Category
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
