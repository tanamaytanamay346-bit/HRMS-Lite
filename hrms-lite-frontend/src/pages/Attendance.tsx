import { useEffect, useMemo, useState } from "react";
import {
  api,
  type AttendanceRecord,
  type Employee,
} from "../services/api";
import { AttendanceForm } from "../components/AttendanceForm";
import { AttendanceTable } from "../components/AttendanceTable";

export function Attendance() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === selectedEmployeeId) || null,
    [employees, selectedEmployeeId]
  );

  const totalPresent = useMemo(
    () => records.filter((r) => r.status === "Present").length,
    [records]
  );

  const totalDays = records.length;

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setError(null);
        setLoadingEmployees(true);
        const data = await api.getEmployees();
        setEmployees(data);
        if (data.length > 0) setSelectedEmployeeId(data[0].id);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingEmployees(false);
      }
    };

    void loadEmployees();
  }, []);

  useEffect(() => {
    if (!selectedEmployeeId) {
      setRecords([]);
      return;
    }

    const loadRecords = async () => {
      try {
        setError(null);
        setLoadingRecords(true);
        const data = await api.getAttendanceByEmployee(selectedEmployeeId);
        setRecords(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingRecords(false);
      }
    };

    void loadRecords();
  }, [selectedEmployeeId]);

  const handleMarkAttendance = async (payload: {
    employee_id: number;
    date: string;
    status: "Present" | "Absent";
  }) => {
    try {
      setSaving(true);
      setError(null);
      await api.markAttendance(payload);
      if (selectedEmployeeId) {
        const updated = await api.getAttendanceByEmployee(selectedEmployeeId);
        setRecords(updated);
      }
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Attendance Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track and manage employee attendance records
        </p>
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Left: Form */}
        <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-lg backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Mark Attendance
              </h2>
              <p className="text-xs text-slate-500">
                Record daily presence or absence
              </p>
            </div>

            {loadingEmployees && (
              <span className="text-xs text-slate-400 animate-pulse">
                Loading employees…
              </span>
            )}
          </div>

          <AttendanceForm
            employees={employees}
            selectedEmployeeId={selectedEmployeeId}
            onChangeEmployee={setSelectedEmployeeId}
            onSubmit={handleMarkAttendance}
            loading={saving}
            error={error}
          />
        </section>

        {/* Right: Records */}
        <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-lg backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Attendance Records
              </h2>
              <p className="text-xs text-slate-500">
                History for selected employee
              </p>
            </div>

            {loadingRecords && (
              <span className="text-xs text-slate-400 animate-pulse">
                Loading records…
              </span>
            )}
          </div>

          {/* Employee Summary */}
          {selectedEmployee && (
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Employee</p>
                <p className="text-sm font-medium text-slate-900">
                  {selectedEmployee.full_name}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedEmployee.department}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 px-4 py-3">
                <p className="text-xs text-emerald-600">
                  Present Days
                </p>
                <p className="text-lg font-semibold text-emerald-700">
                  {totalPresent}
                  <span className="text-xs font-medium text-emerald-600">
                    {" "}
                    / {totalDays}
                  </span>
                </p>
              </div>
            </div>
          )}

          <AttendanceTable records={records} />

          {error && !saving && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
