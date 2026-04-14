"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { parseISO, differenceInMinutes } from "date-fns";
import { Clock, Zap, Bot } from "lucide-react";

const INITIAL_STAGES = ["Novos Leads", "SDR IA"];
const SDR_IA_STAGE = "SDR IA";
const APROVADOS_TRIAGEM = [
  "NOVOS LEADS (Atendimento Humano)",
  "Triagem",
  "Análise/Crédito",
  "Ganho",
];

function avgMinutes(
  leads: { dataCriacao: string; dataAtualizacao: string }[]
): number | null {
  const diffs: number[] = [];
  for (const l of leads) {
    if (!l.dataCriacao || !l.dataAtualizacao) continue;
    try {
      const d = differenceInMinutes(
        parseISO(l.dataAtualizacao),
        parseISO(l.dataCriacao)
      );
      if (d >= 0) diffs.push(d);
    } catch {
      /* skip */
    }
  }
  if (diffs.length === 0) return null;
  return diffs.reduce((a, b) => a + b, 0) / diffs.length;
}

function formatMinutes(mins: number | null): string {
  if (mins === null) return "—";
  if (mins < 1) return "< 1 min";
  if (mins < 60) return `${Math.round(mins)} min`;
  const h = Math.floor(mins / 60);
  const r = Math.round(mins % 60);
  if (h < 24) return `${h}h ${r}min`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}

function colorFor(mins: number | null): string {
  if (mins === null) return "text-gray-400";
  if (mins <= 5) return "text-green-400";
  if (mins <= 30) return "text-amber-400";
  return "text-red-400";
}

export default function SpeedToLead() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  const metrics = useMemo(() => {
    const initialLeads = leads.filter((l) => INITIAL_STAGES.includes(l.estagio));
    const sdrLeads = leads.filter((l) => l.estagio === SDR_IA_STAGE);
    const sdrProcessados = leads.filter((l) =>
      [SDR_IA_STAGE, ...APROVADOS_TRIAGEM, "PRÉ-QUALIFICAÇÃO (SDR / IA)"].includes(
        l.estagio
      )
    ).length;
    const aprovados = leads.filter((l) =>
      APROVADOS_TRIAGEM.includes(l.estagio)
    ).length;
    const taxaAprovacao =
      sdrProcessados > 0 ? (aprovados / sdrProcessados) * 100 : 0;

    return {
      tempo1Contato: avgMinutes(initialLeads),
      tempoSdr: avgMinutes(sdrLeads),
      sdrProcessados,
      aprovados,
      taxaAprovacao,
    };
  }, [leads]);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 h-full">
      <h3 className="text-sm font-semibold text-white mb-1">
        Speed to Lead & Eficiência SDR IA
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        Meta de 1º contato: até 5 minutos
      </p>

      <div className="space-y-3">
        {/* Tempo 1º Contato (destaque) */}
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className={colorFor(metrics.tempo1Contato)} />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Tempo Médio de 1º Contato
            </span>
          </div>
          <p className={`text-3xl font-bold ${colorFor(metrics.tempo1Contato)}`}>
            {formatMinutes(metrics.tempo1Contato)}
          </p>
          {metrics.tempo1Contato !== null && metrics.tempo1Contato > 5 && (
            <p className="text-xs text-red-400 mt-1">Acima da meta</p>
          )}
        </div>

        {/* Tempo SDR IA */}
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={13} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-400">
              Tempo médio SDR IA
            </span>
          </div>
          <p className={`text-lg font-bold ${colorFor(metrics.tempoSdr)}`}>
            {formatMinutes(metrics.tempoSdr)}
          </p>
        </div>

        {/* Eficiência SDR IA */}
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Bot size={13} className="text-red-400" />
            <span className="text-xs font-medium text-gray-400">
              Eficiência SDR IA
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Processados</span>
            <span className="font-bold text-white">
              {metrics.sdrProcessados}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-300">Aprovados p/ Triagem</span>
            <span className="font-bold text-green-400">
              {metrics.aprovados}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-700 flex items-center justify-between">
            <span className="text-xs text-gray-400">Taxa de aprovação</span>
            <span className="text-sm font-bold text-red-400">
              {metrics.taxaAprovacao.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
