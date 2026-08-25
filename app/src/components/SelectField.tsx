"use client";

import React from "react";
import { FiAlertCircle, FiChevronDown } from "react-icons/fi";

export interface Option {
  label: string;
  value: string | number;
}

export interface SelectFieldProps {
  label?: string;
  name: string;
  options: (string | Option)[];
  value: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
}

export const SelectField = ({
  label,
  name,
  options,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  helperText,
  placeholder,
  className = "",
}: SelectFieldProps) => {
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
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-sm transition focus:outline-none focus:ring-2 ${
            hasError
              ? "border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-200 text-gray-900 hover:border-gray-300 focus:border-orange-500 focus:ring-orange-500/20"
          } ${disabled ? "cursor-not-allowed bg-gray-100 opacity-60" : ""}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt, i) => {
            const isObj = typeof opt === "object" && opt !== null;
            const optVal = isObj ? opt.value : opt;
            const optLabel = isObj ? opt.label : opt;
            return (
              <option key={i} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
          <FiChevronDown size={16} />
        </div>
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
