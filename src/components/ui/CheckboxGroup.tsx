interface CheckboxGroupProps {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
}

export function CheckboxGroup({ name, label, options, required }: CheckboxGroupProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-600">*</span>}
      </legend>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 text-gray-900">
            <input
              type="checkbox"
              name={name}
              value={option}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
