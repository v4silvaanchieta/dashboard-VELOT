"use client";

import { useStore } from "@/store/useStore";
import type { DateFilter } from "@/types/lead";

const DATE_OPTIONS: { label: string; value: DateFilter }[] = [
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
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* Date filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Período
          </label>
          <div className="flex gap-1">
            {DATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDateFilter(opt.value)}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                  dateFilter === opt.value
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline (Loja) filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Loja
          </label>
          <select
            value={pipelineFilter}
            onChange={(e) => setPipelineFilter(e.target.value)}
            className="h-9 px-3 text-sm border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent min-w-[180px]"
          >
            <option value="">Todas as lojas</option>
            {pipelines.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* UTM Source (Origem) filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Origem
          </label>
          <select
            value={utmSourceFilter}
            onChange={(e) => setUtmSourceFilter(e.target.value)}
            className="h-9 px-3 text-sm border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent min-w-[180px]"
          >
            <option value="">Todas as origens</option>
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
