"use client";

import React from "react";
import { FiAlertCircle } from "react-icons/fi";

export interface TextareaFieldProps {
  label?: string;
  name: string;
  placeholder?: string;
  rows?: number;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  className?: string;
}

export const TextareaField = ({
  label,
  name,
  placeholder,
  rows = 3,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  helperText,
  className = "",
}: TextareaFieldProps) => {
  const hasError = Boolean(touched && error);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-700"
        >
          <span>
            {label} {required && <span className="text-orange-500">*</span>}
          </span>
        </label>
      )}

      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
          hasError
            ? "border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500/20"
            : "border-gray-200 text-gray-900 hover:border-gray-300 focus:border-orange-500 focus:ring-orange-500/20"
        } ${disabled ? "cursor-not-allowed bg-gray-100 opacity-60" : ""}`}
      />

      {hasError ? (
        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
          <FiAlertCircle size={13} className="flex-shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-gray-400">{helperText}</p>
      ) : null}
    </div>
  );
};
