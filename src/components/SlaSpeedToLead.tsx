"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { parseISO, differenceInMinutes } from "date-fns";
import { Clock, Zap, ArrowRightLeft, Radio, AlertTriangle } from "lucide-react";

/** Estágios iniciais onde calculamos o "1º contato" */
const INITIAL_STAGES = ["Novos Leads", "SDR IA"];

/** Estágio da SDR IA */
const SDR_IA_STAGE = "SDR IA";

/** Estágios pós-SDR IA (transferência para loja) */
const POST_SDR_STAGES = [
  "PRÉ-QUALIFICAÇÃO (SDR / IA)",
  "NOVOS LEADS (Atendimento Humano)",
  "Triagem",
  "Análise/Crédito",
  "Ganho",
];

/** Estágio de prospecção IA → atendimento humano */
const PROSPECCAO_IA_STAGE = "PRÉ-QUALIFICAÇÃO (SDR / IA)";
const ATENDIMENTO_STAGES = [
  "NOVOS LEADS (Atendimento Humano)",
  "Triagem",
  "Análise/Crédito",
  "Ganho",
];

function calcAvgMinutes(
  leads: { dataCriacao: string; dataAtualizacao: string }[]
): number | null {
  const diffs: number[] = [];
  for (const lead of leads) {
    if (!lead.dataCriacao || !lead.dataAtualizacao) continue;
    try {
      const created = parseISO(lead.dataCriacao);
      const updated = parseISO(lead.dataAtualizacao);
      const diff = differenceInMinutes(updated, created);
      if (diff >= 0) diffs.push(diff);
    } catch {
      // skip invalid dates
    }
  }
  if (diffs.length === 0) return null;
  return diffs.reduce((a, b) => a + b, 0) / diffs.length;
}

function formatMinutes(mins: number | null): string {
  if (mins === null) return "—";
  if (mins < 1) return "< 1 min";
  if (mins < 60) return `${Math.round(mins)} min`;
  const hours = Math.floor(mins / 60);
  const remaining = Math.round(mins % 60);
  if (hours < 24) return `${hours}h ${remaining}min`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h`;
}

function getSlaColor(mins: number | null): string {
  if (mins === null) return "text-gray-400";
  if (mins <= 5) return "text-green-600";
  if (mins <= 30) return "text-amber-600";
  return "text-red-600";
}

function getSlaBg(mins: number | null): string {
  if (mins === null) return "bg-gray-50 border-gray-200";
  if (mins <= 5) return "bg-green-50 border-green-200";
  if (mins <= 30) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

export default function SlaSpeedToLead() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  const metrics = useMemo(() => {
    // 1) Tempo médio de 1º contato (leads nos estágios iniciais)
    const initialLeads = leads.filter((l) =>
      INITIAL_STAGES.includes(l.estagio)
    );
    const tempoMedioPrimeiroContato = calcAvgMinutes(initialLeads);

    // 2a) Tempo médio de atendimento SDR IA
    const sdrIaLeads = leads.filter((l) => l.estagio === SDR_IA_STAGE);
    const tempoMedioSdrIa = calcAvgMinutes(sdrIaLeads);

    // 2b) Tempo médio de transferência SDR IA → Lojas
    //     (leads que já passaram pelo SDR IA e estão em estágios posteriores)
    const postSdrLeads = leads.filter((l) =>
      POST_SDR_STAGES.includes(l.estagio)
    );
    const tempoTransferenciaSdrLojas = calcAvgMinutes(postSdrLeads);

    // 2c) Tempo transferência Prospecção IA → Atendimento
    const atendimentoLeads = leads.filter((l) =>
      ATENDIMENTO_STAGES.includes(l.estagio)
    );
    const tempoProspeccaoAtendimento = calcAvgMinutes(atendimentoLeads);

    // 3) Leads com proprietário "TI BH" (não transferidos para a ponta)
    const leadsTiBh = leads.filter(
      (l) =>
        l.proprietario.toUpperCase().includes("TI BH") &&
        l.status === "Aberto"
    );

    return {
      tempoMedioPrimeiroContato,
      tempoMedioSdrIa,
      tempoTransferenciaSdrLojas,
      tempoProspeccaoAtendimento,
      leadsTiBh,
    };
  }, [leads]);

  const subMetrics = [
    {
      label: "Tempo Médio SDR IA",
      value: metrics.tempoMedioSdrIa,
      icon: Zap,
    },
    {
      label: "Transferência SDR IA → Lojas",
      value: metrics.tempoTransferenciaSdrLojas,
      icon: ArrowRightLeft,
    },
    {
      label: "Prospecção IA → Atendimento",
      value: metrics.tempoProspeccaoAtendimento,
      icon: Radio,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        Gestão de SLA e Eficiência
      </h2>

      {/* Main SLA Card */}
      <div
        className={`rounded-lg border-2 p-5 mb-4 ${getSlaBg(
          metrics.tempoMedioPrimeiroContato
        )}`}
      >
        <div className="flex items-center gap-3 mb-1">
          <Clock
            size={20}
            className={getSlaColor(metrics.tempoMedioPrimeiroContato)}
          />
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Tempo Médio de 1º Contato (Meta: 5 min)
          </span>
        </div>
        <p
          className={`text-3xl font-bold ${getSlaColor(
            metrics.tempoMedioPrimeiroContato
          )}`}
        >
          {formatMinutes(metrics.tempoMedioPrimeiroContato)}
        </p>
        {metrics.tempoMedioPrimeiroContato !== null &&
          metrics.tempoMedioPrimeiroContato > 5 && (
            <p className="text-xs text-red-500 mt-1">
              Acima da meta de 5 minutos
            </p>
          )}
      </div>

      {/* Sub-metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {subMetrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-gray-200 bg-gray-50 p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <m.icon size={14} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                {m.label}
              </span>
            </div>
            <p className={`text-lg font-bold ${getSlaColor(m.value)}`}>
              {formatMinutes(m.value)}
            </p>
          </div>
        ))}
      </div>

      {/* TI BH Alert */}
      {metrics.leadsTiBh.length > 0 && (
        <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-600" />
            <span className="text-sm font-semibold text-red-700">
              Alerta: {metrics.leadsTiBh.length} lead
              {metrics.leadsTiBh.length > 1 ? "s" : ""} com proprietário
              &quot;TI BH&quot;
            </span>
          </div>
          <p className="text-xs text-red-600 mb-3">
            A loja matriz ainda não transferiu esses leads para a ponta.
          </p>
          <div className="max-h-32 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-red-400 uppercase">
                  <th className="pb-1 pr-3">Pipeline</th>
                  <th className="pb-1 pr-3">Estágio</th>
                  <th className="pb-1">Origem</th>
                </tr>
              </thead>
              <tbody className="text-red-700">
                {metrics.leadsTiBh.slice(0, 20).map((lead, i) => (
                  <tr key={i} className="border-t border-red-200">
                    <td className="py-1 pr-3">{lead.pipeline || "—"}</td>
                    <td className="py-1 pr-3">{lead.estagio || "—"}</td>
                    <td className="py-1">{lead.cfUtmSource || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {metrics.leadsTiBh.length > 20 && (
              <p className="text-xs text-red-400 mt-1 text-center">
                +{metrics.leadsTiBh.length - 20} leads adicionais
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
