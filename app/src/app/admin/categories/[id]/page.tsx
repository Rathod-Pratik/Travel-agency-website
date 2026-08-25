"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiArrowLeft, FiEdit2, FiTrash2, FiCompass,
  FiRefreshCw, FiAlertCircle,
} from "react-icons/fi";
import { AdminButton, AdminCard, DeleteConfirmModal } from "@components";
import { apiClient } from "@apiClient";
import { GET_CATEGORY_URL, DELETE_CATEGORY_URL } from "@utils";

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  featured?: boolean;
}

export default function CategoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [category, setCategory] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        // Category API returns a list — find match by id
        const res = await apiClient.get(GET_CATEGORY_URL(1, 100), { withCredentials: true });
        const list: ICategory[] = res.data?.categories ?? res.data?.data ?? [];
        const match = list.find((c: any) => (c._id || c.id) === id);
        if (!match) throw new Error("Category not found");
        setCategory(match);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message || "Failed to load category";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleDelete = async () => {
    if (!category) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(DELETE_CATEGORY_URL(category._id), { withCredentials: true });
      toast.success("Category deleted successfully");
      router.push("/admin/categories");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-gray-400">
        <FiRefreshCw className="animate-spin mb-3" size={36} />
        <p className="text-sm">Loading category details…</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-red-500">
        <FiAlertCircle className="mb-3" size={36} />
        <p className="text-sm font-medium">{error || "Category not found"}</p>
        <Link href="/admin/categories">
          <AdminButton variant="outline" className="mt-4">Back to Categories</AdminButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/categories"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600">
            <FiArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
              {category.icon || "🏷️"}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-orange-600 font-semibold">/{category.slug}</span>
                {category.featured && (
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">FEATURED</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{category.name}</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/categories/${category._id}/edit`}>
            <AdminButton variant="primary" icon={FiEdit2}>Edit Category</AdminButton>
          </Link>
          <AdminButton variant="danger" icon={FiTrash2} onClick={() => setIsDeleteOpen(true)}>Delete</AdminButton>
        </div>
      </div>

      {/* ── Info cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <span className="text-xs text-gray-500 uppercase font-semibold">Display Status</span>
          <p className="mt-1 text-xl font-bold text-orange-600">
            {category.featured ? "Homepage Showcase" : "Standard Collection"}
          </p>
          <p className="text-xs text-gray-500">Public visibility</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <span className="text-xs text-gray-500 uppercase font-semibold">URL Slug</span>
          <p className="mt-1 text-xl font-mono font-bold text-gray-700">/{category.slug}</p>
          <p className="text-xs text-gray-500">Used in filters & URLs</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <span className="text-xs text-gray-500 uppercase font-semibold">System ID</span>
          <p className="mt-1 text-xs font-mono font-bold text-gray-700 break-all">{category._id}</p>
          <p className="text-xs text-gray-500">Database identifier</p>
        </div>
      </div>

      {/* ── Description ── */}
      <AdminCard title="Category Description" icon={FiCompass}>
        {category.description ? (
          <p className="text-sm leading-relaxed text-gray-600">{category.description}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">No description provided yet.</p>
        )}
      </AdminCard>

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Category"
        message="This action cannot be undone. Tours in this category may need reclassification."
        itemName={category.name}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
