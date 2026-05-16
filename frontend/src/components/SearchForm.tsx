"use client";
import { useState } from "react";

interface SearchFormProps {
  onSearch: (name: string, code: string, date: string) => void;
  onReset: () => void;
  datePlaceholder?: string;
}

export default function SearchForm({
  onSearch,
  onReset,
  datePlaceholder = "Date",
}: SearchFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(name, code, date);
  };

  const handleReset = () => {
    setName("");
    setCode("");
    setDate("");
    onReset();
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search by name..."
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Code
        </label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Search by code..."
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {datePlaceholder}
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
      >
        Search
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        Reset
      </button>
    </form>
  );
}
