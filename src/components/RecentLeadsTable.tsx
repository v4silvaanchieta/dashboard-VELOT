"use client";

import { useStore } from "@/store/useStore";
import { format, parseISO } from "date-fns";

function formatDate(iso: string): string {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "dd/MM/yyyy HH:mm");
  } catch {
    return iso;
  }
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function RecentLeadsTable() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  // Sort by dataCriacao descending and take 10
  const recentLeads = [...leads]
    .sort((a, b) => (b.dataCriacao > a.dataCriacao ? 1 : -1))
    .slice(0, 10);

  if (recentLeads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
        Nenhum lead encontrado com os filtros selecionados.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">
          10 Leads Mais Recentes
          <span className="ml-2 text-xs font-normal text-gray-400">
            ({leads.length} leads no total)
          </span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">Data Criação</th>
              <th className="px-4 py-3">Pipeline</th>
              <th className="px-4 py-3">Estágio</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Quantia</th>
              <th className="px-4 py-3">Proprietário</th>
              <th className="px-4 py-3">Origem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentLeads.map((lead, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2.5 whitespace-nowrap text-gray-700">
                  {formatDate(lead.dataCriacao)}
                </td>
                <td className="px-4 py-2.5 text-gray-700">{lead.pipeline || "—"}</td>
                <td className="px-4 py-2.5 text-gray-700">{lead.estagio || "—"}</td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                      lead.status === "Ganho"
                        ? "bg-green-100 text-green-700"
                        : lead.status === "Perdido"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {lead.status || "—"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right whitespace-nowrap text-gray-700">
                  {formatCurrency(lead.quantia)}
                </td>
                <td className="px-4 py-2.5 text-gray-700">
                  {lead.proprietario || "—"}
                </td>
                <td className="px-4 py-2.5 text-gray-500">
                  {lead.cfUtmSource || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
