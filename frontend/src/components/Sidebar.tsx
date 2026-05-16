"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/employees", label: "Employees", icon: "👥" },
  { href: "/departments", label: "Departments", icon: "🏢" },
  { href: "/projects", label: "Projects", icon: "📁" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 min-h-screen bg-blue-900 text-white flex flex-col shadow-xl">
      <div className="px-6 py-6 border-b border-blue-800">
        <h1 className="text-lg font-bold tracking-tight">💻 DevCo Manager</h1>
        <p className="text-xs text-blue-300 mt-1">Programming Company System</p>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-700 text-white"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-blue-800 text-xs text-blue-400">
        © 2026 DevCo — POC v1.0
      </div>
    </aside>
  );
}
