"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/store/useStore";
import { parseISO, differenceInDays } from "date-fns";
import { ShieldAlert, Clock, AlertCircle } from "lucide-react";

type AuditTab = "stagnant" | "empty";

export default function CrmAudit() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();
  const [activeTab, setActiveTab] = useState<AuditTab>("stagnant");

  const { stagnantLeads, emptyFieldLeads } = useMemo(() => {
    const now = new Date();

    // Leads Estagnados: abertos sem mudança de estágio há mais de 10 dias
    const stagnantLeads = leads.filter((l) => {
      if (l.status !== "Aberto") return false;
      if (!l.dataAtualizacao) return true; // sem data = estagnado
      try {
        const updated = parseISO(l.dataAtualizacao);
        return differenceInDays(now, updated) > 10;
      } catch {
        return true;
      }
    });

    // Campos Obrigatórios Vazios
    const emptyFieldLeads: {
      nomeDeal: string;
      pipeline: string;
      problema: string;
    }[] = [];

    for (const l of leads) {
      // Perdido sem MOTIVO DE PERDA
      if (l.status === "Perdido" && !l.motivoPerda) {
        emptyFieldLeads.push({
          nomeDeal: l.nomeDeal || "(sem nome)",
          pipeline: l.pipeline || "—",
          problema: "Perdido sem Motivo de Perda",
        });
      }
      // Lead finalizado (Ganho ou Perdido) sem CF_UTM_SOURCE
      if (
        (l.status === "Ganho" || l.status === "Perdido") &&
        !l.cfUtmSource
      ) {
        emptyFieldLeads.push({
          nomeDeal: l.nomeDeal || "(sem nome)",
          pipeline: l.pipeline || "—",
          problema: "Finalizado sem UTM Source",
        });
      }
    }

    return { stagnantLeads, emptyFieldLeads };
  }, [leads]);

  const totalAlerts = stagnantLeads.length + emptyFieldLeads.length;

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
        Auditoria e Higiene do CRM
      </h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Summary bar */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
          <ShieldAlert
            size={18}
            className={totalAlerts > 0 ? "text-red-500" : "text-green-500"}
          />
          <span className="text-sm font-medium text-gray-700">
            {totalAlerts > 0
              ? `${totalAlerts} alerta${totalAlerts > 1 ? "s" : ""} encontrado${totalAlerts > 1 ? "s" : ""}`
              : "Nenhum alerta — CRM saudável"}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("stagnant")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "stagnant"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Clock size={14} />
            Leads Estagnados
            {stagnantLeads.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-orange-100 text-orange-700 rounded-full">
                {stagnantLeads.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("empty")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "empty"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <AlertCircle size={14} />
            Campos Vazios
            {emptyFieldLeads.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                {emptyFieldLeads.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-h-[350px] overflow-y-auto">
          {activeTab === "stagnant" && (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Nome Deal</th>
                  <th className="px-4 py-2">Pipeline</th>
                  <th className="px-4 py-2">Estágio</th>
                  <th className="px-4 py-2">Proprietário</th>
                  <th className="px-4 py-2 text-right">Dias parado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stagnantLeads.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      Nenhum lead estagnado
                    </td>
                  </tr>
                )}
                {stagnantLeads.map((l, i) => {
                  let dias = "—";
                  if (l.dataAtualizacao) {
                    try {
                      dias = String(
                        differenceInDays(new Date(), parseISO(l.dataAtualizacao))
                      );
                    } catch {
                      /* keep — */
                    }
                  }
                  return (
                    <tr key={i} className="hover:bg-red-50/50">
                      <td className="px-4 py-2 text-gray-700">
                        {l.nomeDeal || "(sem nome)"}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {l.pipeline || "—"}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {l.estagio || "—"}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {l.proprietario || "—"}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                          {dias}d
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeTab === "empty" && (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Nome Deal</th>
                  <th className="px-4 py-2">Pipeline</th>
                  <th className="px-4 py-2">Problema</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {emptyFieldLeads.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      Nenhum campo obrigatório vazio
                    </td>
                  </tr>
                )}
                {emptyFieldLeads.map((r, i) => (
                  <tr key={i} className="hover:bg-red-50/50">
                    <td className="px-4 py-2 text-gray-700">{r.nomeDeal}</td>
                    <td className="px-4 py-2 text-gray-700">{r.pipeline}</td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                        {r.problema}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
