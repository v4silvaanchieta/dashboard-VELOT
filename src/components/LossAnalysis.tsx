"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { TrendingDown } from "lucide-react";

const PIE_COLORS = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
  "#64748b", // slate-500
  "#a855f7", // purple-500
  "#f43f5e", // rose-500
];

export default function LossAnalysis() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  const { faturamentoPerdido, pieData } = useMemo(() => {
    const perdidos = leads.filter((l) => l.status === "Perdido");
    const faturamentoPerdido = perdidos.reduce((s, l) => s + l.quantia, 0);

    const countByMotivo = new Map<string, number>();
    for (const l of perdidos) {
      const motivo = l.motivoPerda || "(sem motivo)";
      countByMotivo.set(motivo, (countByMotivo.get(motivo) || 0) + 1);
    }

    const pieData = Array.from(countByMotivo.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { faturamentoPerdido, pieData };
  }, [leads]);

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
        Análise de Perdas
      </h2>

      {/* Faturamento Perdido Card */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Faturamento Perdido
          </span>
          <div className="p-1.5 rounded-lg bg-red-50">
            <TrendingDown size={16} className="text-red-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-red-600">
          {faturamentoPerdido.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {leads.filter((l) => l.status === "Perdido").length} leads perdidos
        </p>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Motivos de Perda
        </h3>
        {pieData.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            Nenhum lead perdido no período selecionado
          </p>
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  label={(props: PieLabelRenderProps) => {
                    const n = String(props.name || "");
                    const pct = Number(props.percent || 0);
                    return `${n.length > 18 ? n.slice(0, 18) + "…" : n} (${(pct * 100).toFixed(0)}%)`;
                  }}
                  labelLine={{ strokeWidth: 1 }}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [String(value), "Leads"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "13px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
