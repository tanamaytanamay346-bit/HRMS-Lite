import { useState } from "react";
import type { EmployeeCreatePayload } from "../services/api";

interface EmployeeFormProps {
  onSubmit: (data: EmployeeCreatePayload) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
}

export function EmployeeForm({ onSubmit, loading, error }: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeCreatePayload>({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(form);
      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });
    } catch {}
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg bg-slate-50 p-4 border border-slate-200"
    >
      {/* Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Employee ID
          </label>
          <input
            required
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            placeholder="EMP-001"
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Must be unique
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Full Name
          </label>
          <input
            required
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Email Address
          </label>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane.doe@company.com"
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Department
          </label>
          <input
            required
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Engineering"
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Action */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-70"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}
          {loading ? "Saving..." : "Save Employee"}
        </button>
      </div>
    </form>
  );
}
