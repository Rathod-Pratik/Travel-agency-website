"use client";

import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { AdminButton } from "./AdminButton";

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal = ({
  isOpen,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  isLoading = false,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5 text-red-600">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <FiAlertTriangle size={18} />
            </div>
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="my-4">
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          {itemName && (
            <p className="mt-2 rounded-lg border border-gray-100 bg-gray-50 p-2 text-xs font-mono font-semibold text-gray-800">
              {itemName}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <AdminButton
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </AdminButton>

          <AdminButton
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Yes, Delete
          </AdminButton>
        </div>
      </div>
    </div>
  );
};
