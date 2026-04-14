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
  CartesianGrid,
  LabelList,
} from "recharts";

export default function SourceBarChart() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  const data = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of leads) {
      const src = l.cfUtmSource || "(sem origem)";
      counts.set(src, (counts.get(src) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [leads]);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <h3 className="text-sm font-semibold text-white mb-1">
        Volume de Leads por Origem (UTM Source)
      </h3>
      <p className="text-xs text-gray-400 mb-4">Top 10 origens no período</p>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={{ stroke: "#374151" }}
              angle={-25}
              textAnchor="end"
              interval={0}
              height={70}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={{ stroke: "#374151" }}
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
              labelStyle={{ color: "#f3f4f6" }}
            />
            <Bar dataKey="value" fill="#dc2626" radius={[6, 6, 0, 0]} barSize={36}>
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontSize: 12, fontWeight: 600, fill: "#f3f4f6" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
