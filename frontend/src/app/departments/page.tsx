"use client";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Department } from "@/lib/types";
import DataGrid from "@/components/DataGrid";
import SearchForm from "@/components/SearchForm";
import InsertForm, { FieldConfig } from "@/components/InsertForm";
import DeleteDialog from "@/components/DeleteDialog";
import Toast, { ToastType } from "@/components/Toast";

const columns = [
  { key: "id" as const, label: "ID" },
  { key: "dept_code" as const, label: "Code" },
  { key: "dept_name" as const, label: "Name" },
  { key: "description" as const, label: "Description" },
  { key: "created_date" as const, label: "Created Date" },
];

const fields: FieldConfig[] = [
  { name: "dept_code", label: "Department Code", type: "text", required: true },
  { name: "dept_name", label: "Department Name", type: "text", required: true },
  { name: "description", label: "Description", type: "text" },
  { name: "created_date", label: "Created Date", type: "date" },
];

export default function DepartmentsPage() {
  const [rows, setRows] = useState<Department[]>([]);
  const [showInsert, setShowInsert] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const load = useCallback(() => api.departments.list().then(setRows), []);
  useEffect(() => { load(); }, [load]);

  const notify = useCallback((message: string, type: ToastType) => setToast({ message, type }), []);

  const handleSearch = (name: string, code: string, date: string) => {
    api.departments
      .search(name, code, date)
      .then(setRows)
      .catch(() => notify("Search failed", "error"));
  };

  const handleInsert = (data: Record<string, string>) => {
    api.departments
      .create(data)
      .then(() => { load(); setShowInsert(false); notify("Department added successfully", "success"); })
      .catch((e: Error) => notify(e.message, "error"));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    api.departments
      .delete(deleteTarget.id)
      .then(() => { load(); setDeleteTarget(null); notify("Department deleted", "success"); })
      .catch((e: Error) => notify(e.message, "error"));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🏢 Departments</h1>
          <p className="text-gray-500 mt-1">{rows.length} record(s)</p>
        </div>
        <button
          onClick={() => setShowInsert(true)}
          className="px-5 py-2 bg-blue-700 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors shadow"
        >
          + New Department
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
        <SearchForm onSearch={handleSearch} onReset={load} datePlaceholder="Created Date" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <DataGrid columns={columns} rows={rows} onDelete={setDeleteTarget} />
      </div>

      {showInsert && (
        <InsertForm
          title="Add Department"
          fields={fields}
          onSubmit={handleInsert}
          onClose={() => setShowInsert(false)}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          recordName={deleteTarget.dept_name}
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
