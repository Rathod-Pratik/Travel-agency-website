"use client";

import React from "react";
import { FiLoader } from "react-icons/fi";

export interface AdminButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  className?: string;
}

export const AdminButton = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  onClick,
  icon: Icon,
  className = "",
}: AdminButtonProps) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-medium gap-1.5 rounded-md",
    md: "px-4 py-2 text-sm font-medium gap-2 rounded-lg",
    lg: "px-6 py-2.5 text-base font-semibold gap-2.5 rounded-lg",
  }[size];

  const variantClasses = {
    primary:
      "bg-orange-500 text-white shadow-sm shadow-orange-500/20 hover:bg-orange-600 active:bg-orange-700",
    secondary:
      "bg-gray-900 text-white shadow-sm hover:bg-gray-800 active:bg-black",
    outline:
      "border border-gray-200 bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 active:bg-orange-100",
    danger:
      "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200",
    ghost:
      "text-gray-600 hover:bg-orange-50 hover:text-orange-600 active:bg-orange-100",
  }[variant];

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${sizeClasses} ${variantClasses} ${
        disabled || isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${className}`}
    >
      {isLoading ? (
        <>
          <FiLoader className="animate-spin" size={size === "sm" ? 14 : 16} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={size === "sm" ? 14 : 16} />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
