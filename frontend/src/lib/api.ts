import { Department, Employee, Project, Counts } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail ?? "Request failed");
  }
  return res.json();
}

function buildQuery(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) q.set(k, v);
  }
  return q.toString();
}

export const api = {
  departments: {
    list: () => req<Department[]>("/departments/"),
    search: (name?: string, code?: string, date?: string) =>
      req<Department[]>(`/departments/search?${buildQuery({ name, code, created_date: date })}`),
    create: (data: Record<string, string>) =>
      req<Department>("/departments/", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: number) =>
      req<Department>(`/departments/${id}`, { method: "DELETE" }),
  },
  employees: {
    list: () => req<Employee[]>("/employees/"),
    search: (name?: string, code?: string, date?: string) =>
      req<Employee[]>(`/employees/search?${buildQuery({ name, code, hire_date: date })}`),
    create: (data: Record<string, string>) =>
      req<Employee>("/employees/", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: number) =>
      req<Employee>(`/employees/${id}`, { method: "DELETE" }),
  },
  projects: {
    list: () => req<Project[]>("/projects/"),
    search: (name?: string, code?: string, date?: string) =>
      req<Project[]>(`/projects/search?${buildQuery({ name, code, start_date: date })}`),
    create: (data: Record<string, string>) =>
      req<Project>("/projects/", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: number) =>
      req<Project>(`/projects/${id}`, { method: "DELETE" }),
  },
  counts: () => req<Counts>("/health/counts"),
};
