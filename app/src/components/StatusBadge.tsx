"use client";

import React from "react";

export type StatusType =
  | "active"
  | "inactive"
  | "draft"
  | "completed"
  | "booked"
  | "pending"
  | "cancelled"
  | "refunded"
  | "paid"
  | "failed"
  | "admin"
  | "user"
  | string;

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export const StatusBadge = ({
  status,
  label,
  className = "",
}: StatusBadgeProps) => {
  const normalized = (status || "").toString().toLowerCase();

  const getStyle = () => {
    switch (normalized) {
      case "active":
      case "booked":
      case "completed":
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
      case "draft":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "inactive":
      case "cancelled":
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      case "refunded":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "admin":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getStyle()} ${className}`}
    >
      {label || status}
    </span>
  );
};
