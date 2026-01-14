import type { ChangeEvent } from "react";

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export function InputField({
  name,
  label,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
  error,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
