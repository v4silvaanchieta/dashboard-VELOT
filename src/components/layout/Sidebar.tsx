"use client";

import { LayoutDashboard, X } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-14 left-0 bottom-0 w-56 bg-gray-800 text-gray-200 z-40
          transform transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-sm font-semibold">Menu</span>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-700">
            <X size={18} />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-700 text-white text-sm font-medium"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </a>
        </nav>
      </aside>
    </>
  );
}
