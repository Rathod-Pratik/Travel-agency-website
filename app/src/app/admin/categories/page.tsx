"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FiFolder,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiMap,
  FiLayers,
  FiCompass,
  FiRefreshCw,
  FiAlertCircle,
  FiInbox,
} from "react-icons/fi";
import { AdminButton, DeleteConfirmModal } from "@components";
import { apiClient } from "@apiClient";
import {
  GET_CATEGORY_URL,
  DELETE_CATEGORY_URL,
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

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] =
    useState<ICategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();

  const page = 1;
  const limit = 100;

  // Fetch categories
  const fetchCategories = async (): Promise<ICategory[]> => {
    const response = await apiClient.get(
      GET_CATEGORY_URL(page, limit),
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(
        response.data?.message ||
          "Failed to load categories"
      );
    }

    return response.data?.data || [];
  };

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ICategory[], Error>({
    queryKey: ["categories", page, limit],
    queryFn: fetchCategories,
  });

  // Delete category
  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      const response = await apiClient.delete(
        DELETE_CATEGORY_URL(deleteTarget._id),
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Category deleted successfully");

        setDeleteTarget(null);

        // Refetch categories
        await queryClient.invalidateQueries({
          queryKey: ["categories"],
        });
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to delete category"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Search
  const filtered = categories.filter((cat) => {
    const q = search.toLowerCase();

    return (
      cat.name.toLowerCase().includes(q) ||
      cat.slug.toLowerCase().includes(q) ||
      (cat.description || "")
        .toLowerCase()
        .includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Tour <span className="text-orange-500">Categories</span>
          </h1>

          <p className="text-xs text-gray-500 sm:text-sm">
            Organize tours into intuitive themes and discovery
            collections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            title="Refresh"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50"
          >
            <FiRefreshCw
              className={isLoading ? "animate-spin" : ""}
              size={16}
            />
          </button>

          <Link href="/admin/categories/create">
            <AdminButton
              variant="primary"
              icon={FiPlus}
            >
              Add New Category
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Categories",
            value: categories.length,
            icon: FiFolder,
            color: "orange",
            sub: "Active tags",
          },
          {
            label: "Featured Collections",
            value: categories.filter(
              (c) => c.featured
            ).length,
            icon: FiCompass,
            color: "amber",
            sub: "On homepage",
          },
          {
            label: "Total Listed",
            value: categories.length,
            icon: FiLayers,
            color: "emerald",
            sub: "In system",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {card.label}
              </span>

              <span
                className={`rounded-lg bg-${card.color}-50 p-2 text-${card.color}-500`}
              >
                <card.icon size={18} />
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {card.value}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <FiSearch
          className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />

        <input
          type="text"
          placeholder="Search categories by name, slug, or description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/20"
        />
      </div>

      {/* ── Cards / States ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <FiRefreshCw
            className="mb-3 animate-spin"
            size={32}
          />

          <p className="text-sm">
            Loading categories from server…
          </p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-24 text-red-500">
          <FiAlertCircle
            className="mb-3"
            size={32}
          />

          <p className="text-sm font-medium">
            {error?.message ||
              "Failed to load categories"}
          </p>

          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <FiInbox
            className="mb-3"
            size={32}
          />

          <p className="text-sm">
            No categories found. Try adjusting your
            search or create a new one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cat) => (
            <div
              key={cat._id}
              className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-orange-200 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                    {cat.icon || "🏷️"}
                  </span>

                  {cat.featured && (
                    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                      Featured
                    </span>
                  )}
                </div>

                <Link
                  href={`/admin/categories/${cat._id}`}
                  className="mt-4 block text-lg font-bold text-gray-900 hover:text-orange-600 transition"
                >
                  {cat.name}
                </Link>

                <p className="font-mono text-xs text-orange-600">
                  /{cat.slug}
                </p>

                {cat.description && (
                  <p className="mt-2 text-xs leading-relaxed text-gray-500 line-clamp-3">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <FiMap
                    className="text-orange-500"
                    size={13}
                  />
                  /{cat.slug}
                </span>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/categories/${cat._id}`}
                    className="rounded p-1.5 text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                    title="View"
                  >
                    <FiEye size={15} />
                  </Link>

                  <Link
                    href={`/admin/categories/${cat._id}/edit`}
                    className="rounded p-1.5 text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                    title="Edit"
                  >
                    <FiEdit2 size={15} />
                  </Link>

                  <button
                    onClick={() =>
                      setDeleteTarget(cat)
                    }
                    className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Category"
        message="This action cannot be undone. Tours mapped to this category may need reclassification."
        itemName={deleteTarget?.name}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}