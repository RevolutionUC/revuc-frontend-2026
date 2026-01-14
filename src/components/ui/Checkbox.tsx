import type { ReactNode } from "react";

interface CheckboxProps {
  name: string;
  required?: boolean;
  children: ReactNode;
}

export function Checkbox({ name, required, children }: CheckboxProps) {
  return (
    <label className="flex items-start gap-2 text-gray-900">
      <input
        type="checkbox"
        name={name}
        required={required}
        className="mt-1 h-4 w-4 rounded border-gray-300"
      />
      <span>{children}</span>
    </label>
  );
}
