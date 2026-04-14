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
  "#3b82f6", // blue-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#a855f7", // purple-500
  "#d946ef", // fuchsia-500
  "#f97316", // orange-500
  "#22c55e", // green-500
];

export default function SalesFunnel() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  const funnelData = useMemo(() => {
    const countByStage = new Map<string, number>();
    for (const stage of FUNNEL_STAGES) {
      countByStage.set(stage, 0);
    }

    for (const lead of leads) {
      const stage = lead.estagio;
      if (countByStage.has(stage)) {
        countByStage.set(stage, countByStage.get(stage)! + 1);
      }
    }

    return FUNNEL_STAGES.map((stage, i) => ({
      name: stage,
      value: countByStage.get(stage) || 0,
      fill: FUNNEL_COLORS[i],
    }));
  }, [leads]);

  const maxValue = Math.max(...funnelData.map((d) => d.value), 1);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        Funil de Vendas
      </h2>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={funnelData}
            layout="vertical"
            margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, maxValue]} hide />
            <YAxis
              type="category"
              dataKey="name"
              width={220}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value) => [String(value), "Leads"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
            />
            <Bar
              dataKey="value"
              radius={[0, 6, 6, 0]}
              barSize={28}
            >
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                style={{ fontSize: 13, fontWeight: 600, fill: "#374151" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
