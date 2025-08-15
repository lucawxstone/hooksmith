import { parse as csvParse, writeToString } from "fast-csv";

export async function parseCsv(data: Buffer | string): Promise<any[]> {
  const rows: any[] = [];
  return new Promise((resolve, reject) => {
    csvParse({ headers: true, ignoreEmpty: true })
      .on("error", reject)
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .write(typeof data === "string" ? data : data.toString());
  });
}

export interface ResultRow {
  company: string;
  role?: string;
  url?: string;
  opener: string;
  email: string;
  linkedin_dm: string;
  subject_1: string;
  subject_2: string;
  subject_3: string;
  signals_used: string;
}

export async function buildCsv(rows: ResultRow[]): Promise<string> {
  return writeToString(rows, { headers: true });
}