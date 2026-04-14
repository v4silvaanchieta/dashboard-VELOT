"use client";

import Image from "next/image";

const VELOT_LOGO_URL =
  "https://github.com/v4silvaanchieta/dashboard-VELOT/blob/main/velot-cor-1.png?raw=true";

export default function Header() {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-6 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-32">
          <Image
            src={VELOT_LOGO_URL}
            alt="VELOT Motors"
            fill
            sizes="128px"
            className="object-contain object-left"
            priority
            unoptimized
          />
        </div>
        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-gray-700">
          <span className="text-sm font-medium text-gray-300">
            Dashboard de Vendas
          </span>
          <span className="text-xs text-red-600 font-bold uppercase tracking-wider">
            • Live
          </span>
        </div>
      </div>
    </header>
  );
}
