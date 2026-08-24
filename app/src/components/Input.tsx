import React from "react";

type Props = {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  isRedBorder?: boolean;
  error?: string;
};

export const Input = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  isRedBorder,
  error,
}: Props) => {
  return (
    <div className="w-full">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`bg-white border rounded-lg w-full p-3 outline-none ${
          isRedBorder ? "border-red-500" : "border-gray-300"
        }`}
      />

      {error && (
        <p className="text-red-700 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};