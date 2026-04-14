"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { Bot, MessageCircle, FileText } from "lucide-react";

const ORIGIN_CATEGORIES = [
  {
    key: "SDR IA (Camila)",
    label: "SDR IA (Camila)",
    icon: Bot,
    color: "text-violet-600",
    bg: "bg-violet-50",
    bar: "bg-violet-500",
  },
  {
    key: "Botão de WhatsApp",
    label: "Botão de WhatsApp",
    icon: MessageCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    bar: "bg-green-500",
  },
  {
    key: "Formulário Landing Page",
    label: "Formulário Landing Page",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
    bar: "bg-blue-500",
  },
];

export default function LeadOriginPanel() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  const originData = useMemo(() => {
    const counts = ORIGIN_CATEGORIES.map((cat) => {
      const count = leads.filter((l) =>
        l.cfUtmSource.toLowerCase().includes(cat.key.toLowerCase())
      ).length;
      return { ...cat, count };
    });

    // Also count "Outros"
    const knownKeys = ORIGIN_CATEGORIES.map((c) => c.key.toLowerCase());
    const outros = leads.filter(
      (l) =>
        l.cfUtmSource &&
        !knownKeys.some((k) => l.cfUtmSource.toLowerCase().includes(k))
    ).length;

    const maxCount = Math.max(...counts.map((c) => c.count), outros, 1);

    return { counts, outros, maxCount };
  }, [leads]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Leads por Origem
      </h3>

      <div className="space-y-4">
        {originData.counts.map((cat) => (
          <div key={cat.key}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${cat.bg}`}>
                  <cat.icon size={14} className={cat.color} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  {cat.label}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-800">
                {cat.count}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${cat.bar}`}
                style={{
                  width: `${(cat.count / originData.maxCount) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}

        {/* Outros */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-400 ml-7">
              Outras origens
            </span>
            <span className="text-sm font-bold text-gray-500">
              {originData.outros}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gray-400"
              style={{
                width: `${(originData.outros / originData.maxCount) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
