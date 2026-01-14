interface SelectFieldProps {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
}

export function SelectField({ name, label, options, required }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
      >
        <option value="" disabled>
          Select...
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
