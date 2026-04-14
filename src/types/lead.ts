export interface Lead {
  dataCriacao: string;
  dataAtualizacao: string;
  pipeline: string;
  estagio: string;
  status: string;
  motivoPerda: string;
  quantia: number;
  tags: string;
  proprietario: string;
  cfCidade: string;
  cfUtmSource: string;
  cfUtmCampaign: string;
  cfUtmContent: string;
  nomeDeal: string;
}

export type DateFilter = "today" | "7days" | "30days" | "year" | "all";
