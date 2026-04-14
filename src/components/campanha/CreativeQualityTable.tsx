"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { formatPercent } from "@/lib/format";

interface Row {
  criativo: string;
  total: number;
  ganhos: number;
  taxa: number;
}

export default function CreativeQualityTable() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  const rows = useMemo(() => {
    const map = new Map<string, { criativo: string; total: number; ganhos: number }>();
    for (const l of leads) {
      const key = l.cfUtmContent || "(sem criativo)";
      const r = map.get(key) || { criativo: key, total: 0, ganhos: 0 };
      r.total++;
      if (l.status === "Ganho") r.ganhos++;
      map.set(key, r);
    }
    return Array.from(map.values())
      .map<Row>((r) => ({
        ...r,
        taxa: r.total > 0 ? (r.ganhos / r.total) * 100 : 0,
      }))
      .sort((a, b) => b.taxa - a.taxa || b.total - a.total);
  }, [leads]);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white">
          Qualidade por Criativo (UTM Content)
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Ordenado pela taxa de conversão
        </p>
      </div>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-900">
            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <th className="px-4 py-2.5">Criativo</th>
              <th className="px-4 py-2.5 text-right">Leads</th>
              <th className="px-4 py-2.5 text-right">Ganhos</th>
              <th className="px-4 py-2.5 text-right">Conversão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Nenhum criativo encontrado
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.criativo} className="hover:bg-gray-700/40">
                <td
                  className="px-4 py-2.5 text-gray-200 max-w-[260px] truncate"
                  title={r.criativo}
                >
                  {r.criativo}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-200">
                  {r.total}
                </td>
                <td className="px-4 py-2.5 text-right text-green-400 font-semibold">
                  {r.ganhos}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                      r.taxa >= 20
                        ? "bg-green-950/60 text-green-400"
                        : r.taxa >= 5
                        ? "bg-amber-950/60 text-amber-400"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {formatPercent(r.taxa)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
