"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const FUNNEL_STAGES = [
  "Novos Leads",
  "SDR IA",
  "PRÉ-QUALIFICAÇÃO (SDR / IA)",
  "NOVOS LEADS (Atendimento Humano)",
  "Triagem",
  "Análise/Crédito",
  "Ganho",
];

const FUNNEL_COLORS = [
  "#7f1d1d",
  "#991b1b",
  "#b91c1c",
  "#dc2626",
  "#ef4444",
  "#f87171",
  "#22c55e",
];

export default function SalesFunnel() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  const data = useMemo(() => {
    const counts = new Map<string, number>();
    FUNNEL_STAGES.forEach((s) => counts.set(s, 0));
    for (const l of leads) {
      if (counts.has(l.estagio)) {
        counts.set(l.estagio, (counts.get(l.estagio) || 0) + 1);
      }
    }
    return FUNNEL_STAGES.map((s, i) => ({
      name: s,
      value: counts.get(s) || 0,
      fill: FUNNEL_COLORS[i],
    }));
  }, [leads]);

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 h-full">
      <h3 className="text-sm font-semibold text-white mb-1">
        Funil de Vendas Consolidado
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        Distribuição de leads por estágio
      </p>
      <div className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, maxValue]} hide />
            <YAxis
              type="category"
              dataKey="name"
              width={210}
              tick={{ fontSize: 11, fill: "#d1d5db" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(220, 38, 38, 0.1)" }}
              formatter={(value) => [String(value), "Leads"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #374151",
                backgroundColor: "#1f2937",
                fontSize: "13px",
                color: "#f3f4f6",
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={26}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                style={{ fontSize: 12, fontWeight: 600, fill: "#f3f4f6" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
