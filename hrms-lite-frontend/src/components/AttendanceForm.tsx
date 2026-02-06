import { useState } from "react";
import type { AttendanceCreatePayload, Employee } from "../services/api";

interface AttendanceFormProps {
  employees: Employee[];
  selectedEmployeeId: number | null;
  onChangeEmployee: (id: number | null) => void;
  onSubmit: (data: AttendanceCreatePayload) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
}

export function AttendanceForm({
  employees,
  selectedEmployeeId,
  onChangeEmployee,
  onSubmit,
  loading,
  error,
}: AttendanceFormProps) {
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState<"Present" | "Absent">("Present");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId) return;

    await onSubmit({
      employee_id: selectedEmployeeId,
      date,
      status,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-lg backdrop-blur">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Mark Attendance
        </h2>
        <p className="text-xs text-slate-500">
          Select employee, date & status
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Employee */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Employee
          </label>

          <select
            value={selectedEmployeeId ?? ""}
            onChange={(e) =>
              onChangeEmployee(
                e.target.value ? Number(e.target.value) : null
              )
            }
            disabled={employees.length === 0}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-60"
          >
            <option value="" disabled>
              Select an employee
            </option>

            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name} · {emp.employee_id}
              </option>
            ))}
          </select>
        </div>

        {/* Date + Status */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Date */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Status Pills */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Status
            </label>

            <div className="flex gap-2 rounded-lg border border-slate-200 p-1">
              {(["Present", "Absent"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition
                    ${
                      status === s
                        ? s === "Present"
                          ? "bg-emerald-600 text-white shadow"
                          : "bg-red-500 text-white shadow"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || employees.length === 0}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Saving Attendance..." : "Save Attendance"}
        </button>
      </form>
    </div>
  );
}
