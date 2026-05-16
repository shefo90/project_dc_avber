"use client";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Employee } from "@/lib/types";
import DataGrid from "@/components/DataGrid";
import SearchForm from "@/components/SearchForm";
import InsertForm, { FieldConfig } from "@/components/InsertForm";
import DeleteDialog from "@/components/DeleteDialog";
import Toast, { ToastType } from "@/components/Toast";

const columns = [
  { key: "id" as const, label: "ID" },
  { key: "emp_code" as const, label: "Code" },
  { key: "first_name" as const, label: "First Name" },
  { key: "last_name" as const, label: "Last Name" },
  { key: "email" as const, label: "Email" },
  { key: "position" as const, label: "Position" },
  { key: "hire_date" as const, label: "Hire Date" },
];

const fields: FieldConfig[] = [
  { name: "emp_code", label: "Employee Code", type: "text", required: true },
  { name: "first_name", label: "First Name", type: "text", required: true },
  { name: "last_name", label: "Last Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "text" },
  { name: "position", label: "Position", type: "text", required: true },
  { name: "hire_date", label: "Hire Date", type: "date", required: true },
  { name: "salary", label: "Salary ($)", type: "number" },
];

export default function EmployeesPage() {
  const [rows, setRows] = useState<Employee[]>([]);
  const [showInsert, setShowInsert] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const load = useCallback(() => api.employees.list().then(setRows), []);
  useEffect(() => { load(); }, [load]);

  const notify = useCallback((message: string, type: ToastType) => setToast({ message, type }), []);

  const handleSearch = (name: string, code: string, date: string) => {
    api.employees
      .search(name, code, date)
      .then(setRows)
      .catch(() => notify("Search failed", "error"));
  };

  const handleInsert = (data: Record<string, string>) => {
    api.employees
      .create(data)
      .then(() => { load(); setShowInsert(false); notify("Employee added successfully", "success"); })
      .catch((e: Error) => notify(e.message, "error"));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    api.employees
      .delete(deleteTarget.id)
      .then(() => { load(); setDeleteTarget(null); notify("Employee deleted", "success"); })
      .catch((e: Error) => notify(e.message, "error"));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">👥 Employees</h1>
          <p className="text-gray-500 mt-1">{rows.length} record(s)</p>
        </div>
        <button
          onClick={() => setShowInsert(true)}
          className="px-5 py-2 bg-blue-700 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors shadow"
        >
          + New Employee
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
        <SearchForm onSearch={handleSearch} onReset={load} datePlaceholder="Hire Date" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <DataGrid columns={columns} rows={rows} onDelete={setDeleteTarget} />
      </div>

      {showInsert && (
        <InsertForm
          title="Add Employee"
          fields={fields}
          onSubmit={handleInsert}
          onClose={() => setShowInsert(false)}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          recordName={`${deleteTarget.first_name} ${deleteTarget.last_name}`}
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
