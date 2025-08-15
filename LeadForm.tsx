"use client";

import { useState } from "react";

interface LeadFormProps {
  onResult: (text: string) => void;
}

export default function LeadForm({ onResult }: LeadFormProps) {
  const [url, setUrl] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [offer, setOffer] = useState("");
  const [signals, setSignals] = useState("");
  const [tone, setTone] = useState<"direct" | "friendly" | "formal">("direct");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastReq, setLastReq] = useState<{
    company: string;
    role?: string;
    offer: string;
    signals: string;
    tone: "direct" | "friendly" | "formal";
  } | null>(null);

  async function handleExtract() {
    setError(null);
    if (!url) {
      setError("Please provide a URL");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Extraction failed");
      } else {
        setSignals(data.signals || "");
      }
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function generate() {
    setError(null);
    if (!company || !offer) {
      setError("Company and offer are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, offer, signals, tone }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Generation failed");
      } else {
        onResult(data.text || "");
        setLastReq({ company, role, offer, signals, tone });
      }
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function runVariant() {
    if (!lastReq) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lastReq),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Generation failed");
      } else {
        onResult(data.text || "");
      }
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <label htmlFor="url" className="text-sm font-medium">
          Company website URL
        </label>
        <div className="flex gap-2">
          <input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            placeholder="acme.com"
          />
          <button
            type="button"
            onClick={handleExtract}
            disabled={!url || loading}
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          >
            {loading ? "..." : "Extract"}
          </button>
        </div>
        <small className="text-slate-500">
          We extract title, description, headings and keywords so you can edit.
        </small>
      </div>

      <div className="grid gap-2">
        <label htmlFor="company" className="text-sm font-medium">Company name</label>
        <input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="role" className="text-sm font-medium">Prospect role (optional)</label>
        <input
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="offer" className="text-sm font-medium">Your offer in one sentence</label>
        <input
          id="offer"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
          className="border rounded px-3 py-2"
          placeholder="We lift paid conversion 10 to 30 percent in 60 days"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="signals" className="text-sm font-medium">Signals to use</label>
        <textarea
          id="signals"
          value={signals}
          onChange={(e) => setSignals(e.target.value)}
          className="border rounded px-3 py-2 h-36"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="tone" className="text-sm font-medium">Tone</label>
        <select
          id="tone"
          value={tone}
          onChange={(e) => setTone(e.target.value as any)}
          className="border rounded px-3 py-2"
        >
          <option value="direct">Direct</option>
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="button"
        onClick={generate}
        disabled={loading || !company || !offer}
        className="px-4 py-3 rounded bg-emerald-600 text-white font-medium disabled:opacity-50"
      >
        {loading ? "Writing..." : "Write outreach"}
      </button>

      {lastReq && !loading && (
        <button
          type="button"
          onClick={runVariant}
          className="px-4 py-3 rounded bg-slate-700 text-white font-medium disabled:opacity-50 mt-2"
        >
          Variant
        </button>
      )}
    </div>
  );
}