"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="h-14 bg-gray-900 text-white flex items-center px-4 shrink-0 z-20">
      <button
        onClick={onToggleSidebar}
        className="mr-4 p-1 rounded hover:bg-gray-700 lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu size={22} />
      </button>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-tight text-orange-400">
          VELOT
        </span>
        <span className="hidden sm:inline text-sm text-gray-400">
          Dashboard de Vendas
        </span>
      </div>
    </header>
  );
}
