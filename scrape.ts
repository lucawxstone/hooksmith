import * as cheerio from "cheerio";

export type SiteSignals = {
  url: string;
  title?: string;
  description?: string;
  h1?: string[];
  keywords?: string[];
};

// Fetch a web page and extract title, description, h1 headings and a simple keyword list.
export async function scrapeSite(url: string): Promise<SiteSignals> {
  // Ensure the URL has a scheme
  const safeUrl = url.startsWith("http") ? url : `https://${url}`;
  const res = await fetch(safeUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; Hooksmith/1.0)" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${safeUrl}: ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const title = $("title").first().text().trim();
  const description = $('meta[name="description"]').attr("content")?.trim();
  const h1 = $("h1")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean)
    .slice(0, 3);
  // Build a simple frequency map of keywords from headings and navigation text
  const text = $("h1, h2, nav, a").text().toLowerCase();
  const bag = text.match(/[a-z]+/g) || [];
  const freq: Record<string, number> = {};
  for (const w of bag) {
    if (w.length < 4) continue;
    freq[w] = (freq[w] || 0) + 1;
  }
  const keywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([k]) => k);
  return { url: safeUrl, title, description, h1, keywords };
}