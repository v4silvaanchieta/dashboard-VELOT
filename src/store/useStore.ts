import { create } from "zustand";
import type { Lead, DateFilter } from "@/types/lead";
import { fetchAndParseCSV } from "@/lib/parseCSV";
import {
  startOfDay,
  subDays,
  startOfYear,
  isAfter,
  isEqual,
  parseISO,
} from "date-fns";

interface StoreState {
  // Data
  leads: Lead[];
  loading: boolean;
  error: string | null;

  // Filters
  dateFilter: DateFilter;
  pipelineFilter: string;
  utmSourceFilter: string;

  // Investimento (Etapa 2)
  investimento: string;

  // Actions
  loadCSV: (url: string) => Promise<void>;
  setDateFilter: (filter: DateFilter) => void;
  setPipelineFilter: (value: string) => void;
  setUtmSourceFilter: (value: string) => void;
  setInvestimento: (value: string) => void;

  // Derived
  filteredLeads: () => Lead[];
  uniquePipelines: () => string[];
  uniqueUtmSources: () => string[];
}

function getDateThreshold(filter: DateFilter): Date | null {
  const now = new Date();
  switch (filter) {
    case "today":
      return startOfDay(now);
    case "7days":
      return startOfDay(subDays(now, 7));
    case "30days":
      return startOfDay(subDays(now, 30));
    case "year":
      return startOfYear(now);
    case "all":
      return null;
  }
}

export const useStore = create<StoreState>((set, get) => ({
  leads: [],
  loading: false,
  error: null,

  dateFilter: "all",
  pipelineFilter: "",
  utmSourceFilter: "",
  investimento: "",

  loadCSV: async (url: string) => {
    set({ loading: true, error: null });
    try {
      const leads = await fetchAndParseCSV(url);
      set({ leads, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Erro ao carregar dados",
        loading: false,
      });
    }
  },

  setDateFilter: (filter) => set({ dateFilter: filter }),
  setPipelineFilter: (value) => set({ pipelineFilter: value }),
  setUtmSourceFilter: (value) => set({ utmSourceFilter: value }),
  setInvestimento: (value) => set({ investimento: value }),

  filteredLeads: () => {
    const { leads, dateFilter, pipelineFilter, utmSourceFilter } = get();
    const threshold = getDateThreshold(dateFilter);

    return leads.filter((lead) => {
      // Date filter
      if (threshold && lead.dataCriacao) {
        try {
          const leadDate = parseISO(lead.dataCriacao);
          if (!isAfter(leadDate, threshold) && !isEqual(leadDate, threshold)) {
            return false;
          }
        } catch {
          return false;
        }
      }

      // Pipeline filter
      if (pipelineFilter && lead.pipeline !== pipelineFilter) {
        return false;
      }

      // UTM Source filter
      if (utmSourceFilter && lead.cfUtmSource !== utmSourceFilter) {
        return false;
      }

      return true;
    });
  },

  uniquePipelines: () => {
    const { leads } = get();
    const set = new Set(leads.map((l) => l.pipeline).filter(Boolean));
    return Array.from(set).sort();
  },

  uniqueUtmSources: () => {
    const { leads } = get();
    const set = new Set(leads.map((l) => l.cfUtmSource).filter(Boolean));
    return Array.from(set).sort();
  },
}));
