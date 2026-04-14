"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import type { Lead } from "@/types/lead";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { DollarSign } from "lucide-react";

/* ──────────────────────────────────────────────
   1. Gráfico de Barras — Leads por UTM Source
   (Google Ads vs Meta Ads vs Orgânico)
   ────────────────────────────────────────────── */

const SOURCE_BUCKETS = [
  { key: "Google Ads", match: "google", color: "#4285F4" },
  { key: "Meta Ads", match: "meta", color: "#0668E1" },
  { key: "Orgânico", match: "__organic__", color: "#22c55e" },
];

function classifySource(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("google")) return "Google Ads";
  if (lower.includes("meta") || lower.includes("facebook") || lower.includes("instagram"))
    return "Meta Ads";
  return "Orgânico";
}

function SourceBarChart({ leads }: { leads: Lead[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {
      "Google Ads": 0,
      "Meta Ads": 0,
      "Orgânico": 0,
    };
    for (const l of leads) {
      const bucket = classifySource(l.cfUtmSource);
      counts[bucket]++;
    }
    return SOURCE_BUCKETS.map((b) => ({
      name: b.key,
      value: counts[b.key] || 0,
      fill: b.color,
    }));
  }, [leads]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Leads por Origem (Mídia)
      </h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide />
            <Tooltip
              formatter={(value) => [String(value), "Leads"]}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={48}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
              <LabelList dataKey="value" position="top" style={{ fontSize: 13, fontWeight: 600, fill: "#374151" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   2. CPL Card
   ────────────────────────────────────────────── */

function CplCard({ leadsGerados }: { leadsGerados: number }) {
  const investimento = useStore((s) => s.investimento);

  const investimentoNum = useMemo(() => {
    if (!investimento) return 0;
    const cleaned = investimento
      .replace(/R\$\s?/g, "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim();
    return parseFloat(cleaned) || 0;
  }, [investimento]);

  const cpl = leadsGerados > 0 ? investimentoNum / leadsGerados : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          CPL (Custo por Lead)
        </span>
        <div className="p-1.5 rounded-lg bg-orange-50">
          <DollarSign size={16} className="text-orange-600" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {cpl.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </p>
      {investimentoNum === 0 && (
        <p className="text-xs text-gray-400 mt-1">
          Preencha o campo Investimento nos KPIs acima
        </p>
      )}
      {investimentoNum > 0 && (
        <p className="text-xs text-gray-400 mt-1">
          R$ {investimentoNum.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ÷ {leadsGerados} leads
        </p>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   3. Tabela — Performance por Campanha
   ────────────────────────────────────────────── */

interface CampaignRow {
  campanha: string;
  leads: number;
  vendas: number;
  receita: number;
}

function CampaignTable({ leads }: { leads: Lead[] }) {
  const rows = useMemo(() => {
    const map = new Map<string, CampaignRow>();
    for (const l of leads) {
      const key = l.cfUtmCampaign || "(sem campanha)";
      const existing = map.get(key) || { campanha: key, leads: 0, vendas: 0, receita: 0 };
      existing.leads++;
      if (l.status === "Ganho") {
        existing.vendas++;
        existing.receita += l.quantia;
      }
      map.set(key, existing);
    }
    return Array.from(map.values()).sort((a, b) => b.leads - a.leads);
  }, [leads]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">
          Performance por Campanha
        </h3>
      </div>
      <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-2">Campanha</th>
              <th className="px-4 py-2 text-right">Leads</th>
              <th className="px-4 py-2 text-right">Vendas</th>
              <th className="px-4 py-2 text-right">Receita</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  Nenhuma campanha encontrada
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.campanha} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-700 max-w-[220px] truncate" title={r.campanha}>
                  {r.campanha}
                </td>
                <td className="px-4 py-2 text-right text-gray-700">{r.leads}</td>
                <td className="px-4 py-2 text-right text-gray-700">{r.vendas}</td>
                <td className="px-4 py-2 text-right text-gray-700 whitespace-nowrap">
                  {r.receita.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   4. Tabela — Qualidade por Criativo
   ────────────────────────────────────────────── */

function CreativeQualityTable({ leads }: { leads: Lead[] }) {
  const rows = useMemo(() => {
    const map = new Map<string, { criativo: string; total: number; ganhos: number }>();
    for (const l of leads) {
      const key = l.cfUtmContent || "(sem criativo)";
      const existing = map.get(key) || { criativo: key, total: 0, ganhos: 0 };
      existing.total++;
      if (l.status === "Ganho") existing.ganhos++;
      map.set(key, existing);
    }
    return Array.from(map.values())
      .map((r) => ({ ...r, taxa: r.total > 0 ? (r.ganhos / r.total) * 100 : 0 }))
      .sort((a, b) => b.taxa - a.taxa);
  }, [leads]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">
          Qualidade por Criativo
        </h3>
      </div>
      <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-2">Criativo (UTM Content)</th>
              <th className="px-4 py-2 text-right">Leads</th>
              <th className="px-4 py-2 text-right">Ganhos</th>
              <th className="px-4 py-2 text-right">Conversão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  Nenhum criativo encontrado
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.criativo} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-700 max-w-[220px] truncate" title={r.criativo}>
                  {r.criativo}
                </td>
                <td className="px-4 py-2 text-right text-gray-700">{r.total}</td>
                <td className="px-4 py-2 text-right text-gray-700">{r.ganhos}</td>
                <td className="px-4 py-2 text-right">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                      r.taxa >= 20
                        ? "bg-green-100 text-green-700"
                        : r.taxa >= 5
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {r.taxa.toFixed(1)}%
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

/* ──────────────────────────────────────────────
   Componente Pai — Marketing Intelligence
   ────────────────────────────────────────────── */

export default function MarketingIntelligence() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const leads = filteredLeads();

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
        Inteligência de Marketing
      </h2>

      {/* Row 1: Bar chart + CPL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <SourceBarChart leads={leads} />
        </div>
        <CplCard leadsGerados={leads.length} />
      </div>

      {/* Row 2: Campaign table + Creative table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CampaignTable leads={leads} />
        <CreativeQualityTable leads={leads} />
      </div>
    </div>
  );
}
