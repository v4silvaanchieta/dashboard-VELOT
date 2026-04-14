import Papa from "papaparse";
import type { Lead } from "@/types/lead";

export const VELOT_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfANI6fzYqt3yWoXMkSFVt0E1pfZBeiPKp2m3nQnoEC2HUWrfBu-Vqx4kZxFvjWFN7EmSzFHpn6b6o/pub?output=csv";

function toStr(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function parseBRDate(raw: unknown): string {
  const dateStr = toStr(raw);
  if (!dateStr) return "";
  // Format: "DD/MM/YYYY HH:mm" or "DD/MM/YYYY"
  const parts = dateStr.split(" ");
  const dateParts = parts[0].split("/");
  if (dateParts.length !== 3) return dateStr;
  const [day, month, year] = dateParts;
  const time = parts[1] || "00:00";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${time}`;
}

function parseQuantia(raw: unknown): number {
  if (typeof raw === "number") return isNaN(raw) ? 0 : raw;
  const value = toStr(raw);
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

function mapRowToLead(row: Record<string, unknown>): Lead {
  return {
    dataCriacao: parseBRDate(row["DATA CRIAÇÃO"] ?? row["DATA CRIACAO"]),
    dataAtualizacao: parseBRDate(row["DATA ATUALIZAÇÃO"] ?? row["DATA ATUALIZACAO"]),
    pipeline: toStr(row["PIPELINE"]),
    estagio: toStr(row["ESTÁGIO"] ?? row["ESTAGIO"]),
    status: toStr(row["STATUS"]),
    motivoPerda: toStr(row["MOTIVO DE PERDA"]),
    quantia: parseQuantia(row["QUANTIA"]),
    tags: toStr(row["TAGS"]),
    proprietario: toStr(row["PROPRIETÁRIO"] ?? row["PROPRIETARIO"]),
    cfCidade: toStr(row["CF_CIDADE"]),
    cfUtmSource: toStr(row["CF_UTM_SOURCE"]),
    cfUtmCampaign: toStr(row["CF_UTM_CAMPAIGN"]),
    cfUtmContent: toStr(row["CF_UTM_CONTENT"]),
    nomeDeal: toStr(row["NOME DEAL"] ?? row["NOME"] ?? row["DEAL"]),
  };
}

export async function fetchAndParseCSV(url: string): Promise<Lead[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(url, {
      download: true,
      header: true,
      dynamicTyping: true,
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
