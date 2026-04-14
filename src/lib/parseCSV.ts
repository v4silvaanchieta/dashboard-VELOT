import Papa from "papaparse";
import type { Lead } from "@/types/lead";

function parseBRDate(dateStr: string): string {
  if (!dateStr) return "";
  // Format: "DD/MM/YYYY HH:mm" or "DD/MM/YYYY"
  const parts = dateStr.trim().split(" ");
  const dateParts = parts[0].split("/");
  if (dateParts.length !== 3) return dateStr;
  const [day, month, year] = dateParts;
  const time = parts[1] || "00:00";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${time}`;
}

function parseQuantia(value: string): number {
  if (!value) return 0;
  // Remove "R$", dots (thousands), and replace comma with dot
  const cleaned = value
    .replace(/R\$\s?/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function mapRowToLead(row: Record<string, string>): Lead {
  return {
    dataCriacao: parseBRDate(row["DATA CRIAÇÃO"] || row["DATA CRIACAO"] || ""),
    dataAtualizacao: parseBRDate(row["DATA ATUALIZAÇÃO"] || row["DATA ATUALIZACAO"] || ""),
    pipeline: (row["PIPELINE"] || "").trim(),
    estagio: (row["ESTÁGIO"] || row["ESTAGIO"] || "").trim(),
    status: (row["STATUS"] || "").trim(),
    motivoPerda: (row["MOTIVO DE PERDA"] || "").trim(),
    quantia: parseQuantia(row["QUANTIA"] || ""),
    tags: (row["TAGS"] || "").trim(),
    proprietario: (row["PROPRIETÁRIO"] || row["PROPRIETARIO"] || "").trim(),
    cfCidade: (row["CF_CIDADE"] || "").trim(),
    cfUtmSource: (row["CF_UTM_SOURCE"] || "").trim(),
    cfUtmCampaign: (row["CF_UTM_CAMPAIGN"] || "").trim(),
    cfUtmContent: (row["CF_UTM_CONTENT"] || "").trim(),
    nomeDeal: (row["NOME DEAL"] || row["NOME"] || row["DEAL"] || "").trim(),
  };
}

export async function fetchAndParseCSV(url: string): Promise<Lead[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const leads = results.data.map(mapRowToLead);
        resolve(leads);
      },
      error(error: Error) {
        reject(error);
      },
    });
  });
}
