"use client";

interface Column<T> {
  key: keyof T;
  label: string;
}

interface DataGridProps<T extends { id: number }> {
  columns: Column<T>[];
  rows: T[];
  onDelete: (row: T) => void;
}

export default function DataGrid<T extends { id: number }>({
  columns,
  rows,
  onDelete,
}: DataGridProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-2">📭</p>
        <p className="text-sm">No records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-blue-700 text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left font-semibold tracking-wide"
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-left font-semibold tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id}
              className={`border-t border-gray-100 hover:bg-blue-50 transition-colors ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-gray-700">
                  {String(row[col.key] ?? "—")}
                </td>
              ))}
              <td className="px-4 py-3">
                <button
                  onClick={() => onDelete(row)}
                  className="px-3 py-1 text-xs rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
