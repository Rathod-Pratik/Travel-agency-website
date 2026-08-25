"use client";

import React from "react";

export interface CheckboxFieldProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const CheckboxField = ({
  label,
  name,
  checked,
  onChange,
  description,
  disabled = false,
  className = "",
}: CheckboxFieldProps) => {
  return (
    <label
      htmlFor={name}
      className={`flex items-start gap-3 cursor-pointer ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      } ${className}`}
    >
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-500 accent-orange-500 focus:ring-orange-500/20"
      />
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    </label>
  );
};
