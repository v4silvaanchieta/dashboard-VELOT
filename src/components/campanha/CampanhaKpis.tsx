"use client";

import { useStore } from "@/store/useStore";
import { formatNumber } from "@/lib/format";
import { Users, Wallet, Calculator } from "lucide-react";

export default function CampanhaKpis() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const total = filteredLeads().length;

  const cards = [
    {
      label: "Volume de Leads",
      value: formatNumber(total),
      icon: Users,
      iconColor: "text-red-500",
      iconBg: "bg-red-950/40",
      sub: "Leads no período filtrado",
    },
    {
      label: "Investimento",
      value: "Dados via API de Ads",
      icon: Wallet,
      iconColor: "text-gray-400",
      iconBg: "bg-gray-700",
      sub: "Custo não disponível no CRM",
      muted: true,
    },
    {
      label: "CPL Médio",
      value: "Aguardando API",
      icon: Calculator,
      iconColor: "text-gray-400",
      iconBg: "bg-gray-700",
      sub: "Custo por Lead automatizado",
      muted: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-gray-800 rounded-lg border border-gray-700 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {card.label}
            </span>
            <div className={`p-2 rounded-lg ${card.iconBg}`}>
              <card.icon size={16} className={card.iconColor} />
            </div>
          </div>
          <p
            className={`font-bold ${
              card.muted ? "text-base text-gray-400" : "text-2xl text-white"
            }`}
          >
            {card.value}
          </p>
          <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
