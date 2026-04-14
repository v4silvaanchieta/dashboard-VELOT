"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { parseISO, differenceInDays } from "date-fns";
import { ShieldAlert } from "lucide-react";

interface RankRow {
  loja: string;
  estagnados: number;
  semMotivo: number;
  semOrigem: number;
  total: number;
}

function severityColor(total: number, max: number): {
  bg: string;
  text: string;
  bar: string;
} {
  if (max === 0)
    return { bg: "bg-gray-900", text: "text-gray-400", bar: "bg-gray-600" };
  const ratio = total / max;
  if (ratio >= 0.66)
    return {
      bg: "bg-red-950/40",
      text: "text-red-300",
      bar: "bg-red-600",
    };
  if (ratio >= 0.33)
    return {
      bg: "bg-amber-950/30",
      text: "text-amber-300",
      bar: "bg-amber-600",
    };
  return {
    bg: "bg-gray-900",
    text: "text-gray-300",
    bar: "bg-gray-600",
  };
}

export default function StoreRanking() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  const rows = useMemo(() => {
    const now = new Date();
    const map = new Map<string, RankRow>();

    for (const l of leads) {
      const loja = l.pipeline || "(sem pipeline)";
      const r =
        map.get(loja) ||
        { loja, estagnados: 0, semMotivo: 0, semOrigem: 0, total: 0 };

      // Estagnados: Aberto sem atualização há mais de 10 dias
      if (l.status === "Aberto") {
        let dias = Infinity;
        if (l.dataAtualizacao) {
          try {
            dias = differenceInDays(now, parseISO(l.dataAtualizacao));
          } catch {
            /* keep Infinity */
          }
        }
        if (dias > 10) r.estagnados++;
      }

      // Perdido sem motivo
      if (l.status === "Perdido" && !l.motivoPerda) r.semMotivo++;

      // Finalizado sem origem
      if ((l.status === "Ganho" || l.status === "Perdido") && !l.cfUtmSource) {
        r.semOrigem++;
      }

      map.set(loja, r);
    }

    const list = Array.from(map.values()).map((r) => ({
      ...r,
      total: r.estagnados + r.semMotivo + r.semOrigem,
    }));

    return list
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [leads]);

  const maxTotal = rows.length > 0 ? rows[0].total : 0;
  const totalErros = rows.reduce((s, r) => s + r.total, 0);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-red-500" />
            <h3 className="text-sm font-semibold text-white">
              Ranking de Ineficiência de CRM
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Lojas ordenadas pela soma de erros (mais ineficiente no topo)
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Total de erros
          </p>
          <p className="text-2xl font-bold text-red-500">{totalErros}</p>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-900">
            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <th className="px-4 py-2.5 w-8">#</th>
              <th className="px-4 py-2.5">Loja (Pipeline)</th>
              <th className="px-4 py-2.5 text-right">Estagnados &gt;10d</th>
              <th className="px-4 py-2.5 text-right">Perdidos s/ Motivo</th>
              <th className="px-4 py-2.5 text-right">Finalizados s/ Origem</th>
              <th className="px-4 py-2.5 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  Nenhuma ineficiência detectada — CRM saudável
                </td>
              </tr>
            )}
            {rows.map((r, i) => {
              const sev = severityColor(r.total, maxTotal);
              return (
                <tr key={r.loja} className={`${sev.bg} hover:bg-gray-700/40`}>
                  <td className={`px-4 py-2.5 font-bold ${sev.text}`}>
                    {i + 1}
                  </td>
                  <td className="px-4 py-2.5 text-gray-200 font-medium">
                    {r.loja}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-200">
                    {r.estagnados}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-200">
                    {r.semMotivo}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-200">
                    {r.semOrigem}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${sev.bar}`}
                          style={{
                            width: `${(r.total / maxTotal) * 100}%`,
                          }}
                        />
                      </div>
                      <span className={`font-bold ${sev.text}`}>
                        {r.total}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
