"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { VELOT_CSV_URL } from "@/lib/parseCSV";
import DashboardShell from "@/components/layout/DashboardShell";
import GlobalFilters from "@/components/filters/GlobalFilters";
import Tabs from "@/components/Tabs";
import CampanhaTab from "@/components/campanha/CampanhaTab";
import LojasTab from "@/components/lojas/LojasTab";

export default function Home() {
  const loadCSV = useStore((s) => s.loadCSV);
  const loading = useStore((s) => s.loading);
  const error = useStore((s) => s.error);
  const leads = useStore((s) => s.leads);

  useEffect(() => {
    loadCSV(VELOT_CSV_URL);
  }, [loadCSV]);

  return (
    <DashboardShell>
      {loading && (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="animate-spin h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full mb-4" />
          <span className="text-gray-300 font-medium">
            Carregando dados da rede VELOT...
          </span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-950/40 border border-red-700 rounded-lg text-sm text-red-300">
          <strong className="text-red-400">Erro ao carregar dados:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <GlobalFilters />
          <div className="mb-3 text-xs text-gray-500">
            {leads.length.toLocaleString("pt-BR")} leads carregados da rede VELOT
          </div>
          <Tabs
            campanhaContent={<CampanhaTab />}
            lojasContent={<LojasTab />}
          />
        </>
      )}
    </DashboardShell>
  );
}
