"use client";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Project } from "@/lib/types";
import DataGrid from "@/components/DataGrid";
import SearchForm from "@/components/SearchForm";
import InsertForm, { FieldConfig } from "@/components/InsertForm";
import DeleteDialog from "@/components/DeleteDialog";
import Toast, { ToastType } from "@/components/Toast";

const columns = [
  { key: "id" as const, label: "ID" },
  { key: "project_code" as const, label: "Code" },
  { key: "project_name" as const, label: "Name" },
  { key: "department_id" as const, label: "Dept ID" },
  { key: "status" as const, label: "Status" },
  { key: "start_date" as const, label: "Start Date" },
  { key: "end_date" as const, label: "End Date" },
];

const fields: FieldConfig[] = [
  { name: "project_code", label: "Project Code", type: "text", required: true },
  { name: "project_name", label: "Project Name", type: "text", required: true },
  { name: "description", label: "Description", type: "text" },
  { name: "start_date", label: "Start Date", type: "date", required: true },
  { name: "end_date", label: "End Date", type: "date" },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "active", label: "Active" },
      { value: "completed", label: "Completed" },
      { value: "on-hold", label: "On Hold" },
    ],
  },
  { name: "budget", label: "Budget ($)", type: "number" },
  { name: "department_id", label: "Department ID", type: "number" },
];

export default function ProjectsPage() {
  const [rows, setRows] = useState<Project[]>([]);
  const [showInsert, setShowInsert] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const load = useCallback(() => api.projects.list().then(setRows), []);
  useEffect(() => { load(); }, [load]);

  const notify = useCallback((message: string, type: ToastType) => setToast({ message, type }), []);

  const handleSearch = (name: string, code: string, date: string) => {
    api.projects
      .search(name, code, date)
      .then(setRows)
      .catch(() => notify("Search failed", "error"));
  };

  const handleInsert = (data: Record<string, string>) => {
    api.projects
      .create(data)
      .then(() => { load(); setShowInsert(false); notify("Project added successfully", "success"); })
      .catch((e: Error) => notify(e.message, "error"));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    api.projects
      .delete(deleteTarget.id)
      .then(() => { load(); setDeleteTarget(null); notify("Project deleted", "success"); })
      .catch((e: Error) => notify(e.message, "error"));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📁 Projects</h1>
          <p className="text-gray-500 mt-1">{rows.length} record(s)</p>
        </div>
        <button
          onClick={() => setShowInsert(true)}
          className="px-5 py-2 bg-blue-700 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors shadow"
        >
          + New Project
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
        <SearchForm onSearch={handleSearch} onReset={load} datePlaceholder="Start Date" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <DataGrid columns={columns} rows={rows} onDelete={setDeleteTarget} />
      </div>

      {showInsert && (
        <InsertForm
          title="Add Project"
          fields={fields}
          onSubmit={handleInsert}
          onClose={() => setShowInsert(false)}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          recordName={deleteTarget.project_name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
