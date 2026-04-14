"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import DashboardShell from "@/components/layout/DashboardShell";
import GlobalFilters from "@/components/filters/GlobalFilters";
import KpiCards from "@/components/KpiCards";
import SalesFunnel from "@/components/SalesFunnel";
import SlaSpeedToLead from "@/components/SlaSpeedToLead";
import LeadOriginPanel from "@/components/LeadOriginPanel";
import SdrIaComparison from "@/components/SdrIaComparison";
import MarketingIntelligence from "@/components/MarketingIntelligence";
import LossAnalysis from "@/components/LossAnalysis";
import CrmAudit from "@/components/CrmAudit";

const CSV_URL = process.env.NEXT_PUBLIC_CSV_URL || "";

export default function Home() {
  const loadCSV = useStore((s) => s.loadCSV);
  const loading = useStore((s) => s.loading);
  const error = useStore((s) => s.error);

  useEffect(() => {
    if (CSV_URL) {
      loadCSV(CSV_URL);
    }
  }, [loadCSV]);

  return (
    <DashboardShell>
      {!CSV_URL && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          Configure a variável{" "}
          <code className="font-mono bg-yellow-100 px-1 rounded">
            NEXT_PUBLIC_CSV_URL
          </code>{" "}
          no arquivo{" "}
          <code className="font-mono bg-yellow-100 px-1 rounded">
            .env.local
          </code>{" "}
          com a URL pública do Google Sheets em formato CSV.
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-orange-400 border-t-transparent rounded-full" />
          <span className="ml-3 text-gray-500">Carregando dados...</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          Erro: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <GlobalFilters />
          <KpiCards />
          <SalesFunnel />
          <SlaSpeedToLead />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <LeadOriginPanel />
            <SdrIaComparison />
          </div>
          <MarketingIntelligence />
          <LossAnalysis />
          <CrmAudit />
        </>
      )}
    </DashboardShell>
  );
}
