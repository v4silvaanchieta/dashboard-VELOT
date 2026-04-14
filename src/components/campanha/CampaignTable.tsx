"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { formatBRL } from "@/lib/format";

interface Row {
  campanha: string;
  leads: number;
  vendas: number;
  receita: number;
}

export default function CampaignTable() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  const rows = useMemo(() => {
    const map = new Map<string, Row>();
    for (const l of leads) {
      const key = l.cfUtmCampaign || "(sem campanha)";
      const r = map.get(key) || { campanha: key, leads: 0, vendas: 0, receita: 0 };
      r.leads++;
      if (l.status === "Ganho") {
        r.vendas++;
        r.receita += l.quantia;
      }
      map.set(key, r);
    }
    return Array.from(map.values()).sort((a, b) => b.leads - a.leads);
  }, [leads]);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white">
          Performance por Campanha (UTM Campaign)
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {rows.length} campanha{rows.length !== 1 ? "s" : ""} no período
        </p>
      </div>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-900">
            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <th className="px-4 py-2.5">Campanha</th>
              <th className="px-4 py-2.5 text-right">Leads</th>
              <th className="px-4 py-2.5 text-right">Vendas</th>
              <th className="px-4 py-2.5 text-right">Receita</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Nenhuma campanha encontrada
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.campanha} className="hover:bg-gray-700/40">
                <td
                  className="px-4 py-2.5 text-gray-200 max-w-[260px] truncate"
                  title={r.campanha}
                >
                  {r.campanha}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-200">
                  {r.leads}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="font-semibold text-green-400">
                    {r.vendas}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right text-gray-200 whitespace-nowrap">
                  {formatBRL(r.receita)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
