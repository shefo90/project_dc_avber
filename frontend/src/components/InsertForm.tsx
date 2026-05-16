"use client";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "date" | "number" | "select";
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface InsertFormProps {
  title: string;
  fields: FieldConfig[];
  onSubmit: (data: Record<string, string>) => void;
  onClose: () => void;
}

export default function InsertForm({ title, fields, onSubmit, onClose }: InsertFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data: Record<string, string> = {};
    fields.forEach((f) => {
      const el = form.elements.namedItem(f.name) as HTMLInputElement | HTMLSelectElement;
      data[f.name] = el?.value ?? "";
    });
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">➕ {title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  required={field.required}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  step={field.type === "number" ? "0.01" : undefined}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              Insert Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
