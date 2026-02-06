const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = (data as any)?.detail || (data as any)?.message || "Unexpected error";
    throw new Error(message);
  }

  return data as T;
}

export interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface AttendanceRecord {
  id: number;
  date: string;
  status: "Present" | "Absent" | string;
}

export interface EmployeeCreatePayload {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface AttendanceCreatePayload {
  employee_id: number;
  date: string;
  status: "Present" | "Absent";
}

export const api = {
  getEmployees: () => request<Employee[]>("/employees/"),
  createEmployee: (payload: EmployeeCreatePayload) =>
    request<Employee>("/employees/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteEmployee: (id: number) =>
    request<void>(`/employees/${id}`, {
      method: "DELETE",
    }),
  getAttendanceByEmployee: (id: number) =>
    request<AttendanceRecord[]>(`/attendance/${id}`),
  markAttendance: (payload: AttendanceCreatePayload) =>
    request<{ message: string; attendance_id: number }>("/attendance/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};


