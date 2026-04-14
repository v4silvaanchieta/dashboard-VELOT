"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { formatBRL, formatNumber, formatPercent } from "@/lib/format";
import { DollarSign, Trophy, XCircle, Percent } from "lucide-react";

export default function LojasKpis() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  const kpis = useMemo(() => {
    const ganhos = leads.filter((l) => l.status === "Ganho");
    const perdidos = leads.filter((l) => l.status === "Perdido");
    const faturamento = ganhos.reduce((s, l) => s + l.quantia, 0);
    const total = leads.length;
    const taxa = total > 0 ? (ganhos.length / total) * 100 : 0;
    return {
      faturamento,
      vendas: ganhos.length,
      perdidas: perdidos.length,
      taxa,
    };
  }, [leads]);

  const cards = [
    {
      label: "Faturamento",
      value: formatBRL(kpis.faturamento),
      icon: DollarSign,
      iconColor: "text-green-400",
      iconBg: "bg-green-950/60",
    },
    {
      label: "Vendas Realizadas",
      value: formatNumber(kpis.vendas),
      icon: Trophy,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-950/60",
    },
    {
      label: "Vendas Perdidas",
      value: formatNumber(kpis.perdidas),
      icon: XCircle,
      iconColor: "text-red-400",
      iconBg: "bg-red-950/60",
    },
    {
      label: "Taxa de Conversão",
      value: formatPercent(kpis.taxa),
      icon: Percent,
      iconColor: "text-red-500",
      iconBg: "bg-red-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          <p className="text-2xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
