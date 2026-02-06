import { useEffect, useState } from "react";
import { api, type Employee, type EmployeeCreatePayload } from "../services/api";
import { EmployeeCard } from "../components/EmployeeCard";
import { EmployeeForm } from "../components/EmployeeForm";

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEmployees();
  }, []);

  const handleCreate = async (payload: EmployeeCreatePayload) => {
    try {
      setSaving(true);
      setError(null);
      await api.createEmployee(payload);
      await loadEmployees();
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this employee? This cannot be undone.")) return;
    try {
      setError(null);
      await api.deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      {/* Left: Add Employee */}
      <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-lg backdrop-blur">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-900">
            Add Employee
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Create a new employee record with a unique ID
          </p>
        </div>

        <EmployeeForm
          onSubmit={handleCreate}
          loading={saving}
          error={error}
        />
      </section>

      {/* Right: Employee List */}
      <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-lg backdrop-blur">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Employees
            </h2>
            <p className="text-xs text-slate-500">
              View and manage all employees
            </p>
          </div>

          {/* Count Badge */}
          {!loading && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {employees.length} total
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
            Loading employees…
          </div>
        )}

        {/* Error */}
        {error && !saving && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && employees.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-600">
              No employees yet
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Add your first employee to get started
            </p>
          </div>
        )}

        {/* List */}
        {!loading && employees.length > 0 && (
          <div className="space-y-3">
            {employees.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
