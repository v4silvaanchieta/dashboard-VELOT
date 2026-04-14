"use client";

import { useState, type ReactNode } from "react";
import { Megaphone, Store } from "lucide-react";

export type TabKey = "campanha" | "lojas";

interface TabsProps {
  campanhaContent: ReactNode;
  lojasContent: ReactNode;
}

const TABS: { key: TabKey; label: string; icon: typeof Megaphone }[] = [
  { key: "campanha", label: "Campanha e Otimização", icon: Megaphone },
  { key: "lojas", label: "Lojas e CRM", icon: Store },
];

export default function Tabs({ campanhaContent, lojasContent }: TabsProps) {
  const [active, setActive] = useState<TabKey>("campanha");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-gray-700 mb-6">
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                isActive
                  ? "border-red-600 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {active === "campanha" ? campanhaContent : lojasContent}
      </div>
    </div>
  );
}
