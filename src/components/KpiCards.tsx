"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { parseISO, differenceInDays } from "date-fns";
import {
  DollarSign,
  Users,
  MessageSquare,
  Trophy,
  XCircle,
  Percent,
  AlertTriangle,
  Wallet,
} from "lucide-react";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function KpiCards() {
  const filteredLeads = useStore((s) => s.filteredLeads);
  const investimento = useStore((s) => s.investimento);
  const setInvestimento = useStore((s) => s.setInvestimento);

  const leads = filteredLeads();

  const kpis = useMemo(() => {
    const now = new Date();
    const leadsGerados = leads.length;
    const ganhos = leads.filter((l) => l.status === "Ganho");
    const perdidos = leads.filter((l) => l.status === "Perdido");
    const abertos = leads.filter((l) => l.status === "Aberto");

    const faturamento = ganhos.reduce((sum, l) => sum + l.quantia, 0);
    const vendasRealizadas = ganhos.length;
    const vendasPerdidas = perdidos.length;
    const negociacoes = abertos.length;
    const taxaConversao =
      leadsGerados > 0 ? (vendasRealizadas / leadsGerados) * 100 : 0;

    const leadsParados = abertos.filter((l) => {
      if (!l.dataAtualizacao) return false;
      try {
        const dataAtt = parseISO(l.dataAtualizacao);
        return differenceInDays(now, dataAtt) > 5;
      } catch {
        return false;
      }
    }).length;

    return {
      faturamento,
      leadsGerados,
      negociacoes,
      vendasRealizadas,
      vendasPerdidas,
      taxaConversao,
      leadsParados,
    };
  }, [leads]);

  const cards = [
    {
      label: "Faturamento",
      value: formatCurrency(kpis.faturamento),
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Leads Gerados",
      value: kpis.leadsGerados.toLocaleString("pt-BR"),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Negociações",
      value: kpis.negociacoes.toLocaleString("pt-BR"),
      icon: MessageSquare,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Vendas Realizadas",
      value: kpis.vendasRealizadas.toLocaleString("pt-BR"),
      icon: Trophy,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Vendas Perdidas",
      value: kpis.vendasPerdidas.toLocaleString("pt-BR"),
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Taxa de Conversão",
      value: `${kpis.taxaConversao.toFixed(1)}%`,
      icon: Percent,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Leads Parados",
      value: kpis.leadsParados.toLocaleString("pt-BR"),
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      alert: kpis.leadsParados > 0,
    },
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-lg shadow-sm border p-4 ${
              card.alert
                ? "border-red-300 ring-1 ring-red-200"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bg}`}>
                <card.icon size={16} className={card.color} />
              </div>
            </div>
            <p
              className={`text-xl font-bold ${
                card.alert ? "text-red-600" : "text-gray-900"
              }`}
            >
              {card.value}
            </p>
            {card.alert && (
              <p className="text-xs text-red-500 mt-1">
                Sem atualização há mais de 5 dias
              </p>
            )}
          </div>
        ))}

        {/* Investment card with input */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Investimento
            </span>
            <div className="p-1.5 rounded-lg bg-orange-50">
              <Wallet size={16} className="text-orange-600" />
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              R$
            </span>
            <input
              type="text"
              value={investimento}
              onChange={(e) => setInvestimento(e.target.value)}
              placeholder="0,00"
              className="w-full pl-8 pr-2 py-1.5 text-lg font-bold text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Verba do período</p>
        </div>
      </div>
    </div>
  );
}
