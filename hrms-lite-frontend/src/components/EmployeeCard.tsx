import type { Employee } from "../services/api";

interface EmployeeCardProps {
  employee: Employee;
  onDelete?: (id: number) => void;
}

export function EmployeeCard({ employee, onDelete }: EmployeeCardProps) {
  const initials = employee.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="group relative flex items-start justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Left */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-semibold text-white">
          {initials}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">
              {employee.full_name}
            </p>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-600">
              {employee.employee_id}
            </span>
          </div>

          <p className="mt-0.5 text-xs text-slate-500">
            {employee.email}
          </p>

          <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            {employee.department}
          </span>
        </div>
      </div>

      {/* Actions */}
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(employee.id)}
          className="rounded-md px-2 py-1 text-xs font-medium text-red-600 opacity-0 transition hover:bg-red-50 hover:text-red-700 group-hover:opacity-100"
          title="Delete employee"
        >
          Delete
        </button>
      )}
    </div>
  );
}

