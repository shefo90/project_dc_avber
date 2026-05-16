"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Counts } from "@/lib/types";

const cards = [
  { key: "departments" as const, label: "Departments", icon: "🏢", color: "bg-indigo-500" },
  { key: "employees" as const, label: "Employees", icon: "👥", color: "bg-blue-500" },
  { key: "projects" as const, label: "Projects", icon: "📁", color: "bg-cyan-500" },
];

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.counts().then(setCounts).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome to DevCo Manager — your company at a glance
        </p>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm animate-pulse">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.key}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5"
            >
              <div
                className={`${c.color} rounded-xl w-14 h-14 flex items-center justify-center text-2xl text-white shadow`}
              >
                {c.icon}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{counts?.[c.key] ?? 0}</p>
                <p className="text-sm text-gray-500">{c.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Quick Navigation</h2>
        <p className="text-sm text-gray-500">
          Use the sidebar to manage Employees, Departments, and Projects. Each section
          supports search by name, code, and date — plus insert and delete with confirmation.
        </p>
      </div>
    </div>
  );
}
