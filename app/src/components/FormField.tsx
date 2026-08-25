"use client";

import React from "react";
import { FiAlertCircle } from "react-icons/fi";

export interface FormFieldProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  helperText?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  className?: string;
}

export const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  min,
  max,
  step,
  helperText,
  icon: Icon,
  className = "",
}: FormFieldProps) => {
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

      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Icon size={16} />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
            Icon ? "pl-9" : ""
          } ${
            hasError
              ? "border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-200 text-gray-900 hover:border-gray-300 focus:border-orange-500 focus:ring-orange-500/20"
          } ${disabled ? "cursor-not-allowed bg-gray-100 opacity-60" : ""}`}
        />
      </div>

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
