import { useState } from "react";
import { EmployeeList } from "./EmployeeList";
import { Attendance } from "./Attendance";

type TabKey = "employees" | "attendance";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("employees");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-3xl font-bold text-transparent">
              HRMS Lite
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Lightweight HR tool for employee & attendance management
            </p>
          </div>

          {/* Status badge */}
          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 md:inline-flex">
            System Online
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Top Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              HR Operations Console
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage employees and track attendance seamlessly
            </p>
          </div>

          <Tabs active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content Container */}
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-lg backdrop-blur">
          {activeTab === "employees" ? (
            <EmployeeList />
          ) : (
            <Attendance />
          )}
        </div>
      </main>
    </div>
  );
}

interface TabsProps {
  active: TabKey;
  onChange: (value: TabKey) => void;
}

function Tabs({ active, onChange }: TabsProps) {
  const tabs: { value: TabKey; label: string; icon: string }[] = [
    { value: "employees", label: "Employees", icon: "👥" },
    { value: "attendance", label: "Attendance", icon: "📅" },
  ];

  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/70 p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            active === tab.value
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
