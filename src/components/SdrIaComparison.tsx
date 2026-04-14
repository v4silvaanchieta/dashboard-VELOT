"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { Bot, UserCheck } from "lucide-react";

/** Estágios que representam "processado pela SDR IA" */
const SDR_IA_PROCESSED_STAGES = [
  "SDR IA",
  "PRÉ-QUALIFICAÇÃO (SDR / IA)",
  "NOVOS LEADS (Atendimento Humano)",
  "Triagem",
  "Análise/Crédito",
  "Ganho",
];

/** Estágios que representam "aprovado para triagem humana" */
const TRIAGEM_HUMANA_STAGES = [
  "NOVOS LEADS (Atendimento Humano)",
  "Triagem",
  "Análise/Crédito",
  "Ganho",
];

export default function SdrIaComparison() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  const data = useMemo(() => {
    const processadosSdrIa = leads.filter((l) =>
      SDR_IA_PROCESSED_STAGES.includes(l.estagio)
    ).length;

    const aprovadosTriagem = leads.filter((l) =>
      TRIAGEM_HUMANA_STAGES.includes(l.estagio)
    ).length;

    const taxaAprovacao =
      processadosSdrIa > 0
        ? ((aprovadosTriagem / processadosSdrIa) * 100).toFixed(1)
        : "0.0";

    return { processadosSdrIa, aprovadosTriagem, taxaAprovacao };
  }, [leads]);

  const maxVal = Math.max(data.processadosSdrIa, data.aprovadosTriagem, 1);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        SDR IA: Processamento vs Aprovação
      </h3>

      <div className="space-y-5">
        {/* Processados pela SDR IA */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-indigo-50">
                <Bot size={14} className="text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-gray-600">
                Processados pela SDR IA
              </span>
            </div>
            <span className="text-lg font-bold text-indigo-700">
              {data.processadosSdrIa}
            </span>
          </div>
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{
                width: `${(data.processadosSdrIa / maxVal) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Aprovados para Triagem Humana */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-teal-50">
                <UserCheck size={14} className="text-teal-600" />
              </div>
              <span className="text-xs font-medium text-gray-600">
                Aprovados para Triagem Humana
              </span>
            </div>
            <span className="text-lg font-bold text-teal-700">
              {data.aprovadosTriagem}
            </span>
          </div>
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-500"
              style={{
                width: `${(data.aprovadosTriagem / maxVal) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Taxa de aprovação */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">Taxa de aprovação</span>
          <span className="text-sm font-bold text-gray-800">
            {data.taxaAprovacao}%
          </span>
        </div>
      </div>
    </div>
  );
}
