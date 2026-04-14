"use client";

import { useStore } from "@/store/useStore";
import type { DateFilter } from "@/types/lead";

const DATE_OPTIONS: { label: string; value: DateFilter }[] = [
  { label: "Todos", value: "all" },
  { label: "Hoje", value: "today" },
  { label: "7 dias", value: "7days" },
  { label: "30 dias", value: "30days" },
  { label: "Ano", value: "year" },
];

export default function GlobalFilters() {
  const dateFilter = useStore((s) => s.dateFilter);
  const pipelineFilter = useStore((s) => s.pipelineFilter);
  const utmSourceFilter = useStore((s) => s.utmSourceFilter);
  const setDateFilter = useStore((s) => s.setDateFilter);
  const setPipelineFilter = useStore((s) => s.setPipelineFilter);
  const setUtmSourceFilter = useStore((s) => s.setUtmSourceFilter);
  const uniquePipelines = useStore((s) => s.uniquePipelines);
  const uniqueUtmSources = useStore((s) => s.uniqueUtmSources);

  const pipelines = uniquePipelines();
  const utmSources = uniqueUtmSources();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* Date filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Período
          </label>
          <div className="flex gap-1">
            {DATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDateFilter(opt.value)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  dateFilter === opt.value
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Loja / Franquia
          </label>
          <select
            value={pipelineFilter}
            onChange={(e) => setPipelineFilter(e.target.value)}
            className="h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Todas</option>
            {pipelines.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* UTM Source filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Origem do Lead
          </label>
          <select
            value={utmSourceFilter}
            onChange={(e) => setUtmSourceFilter(e.target.value)}
            className="h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Todas</option>
            {utmSources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
