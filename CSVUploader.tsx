"use client";

import { useState } from "react";

export default function CSVUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    setStatus("Processing...");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/batch", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const data = await res.json();
        setStatus(data.error || "Batch failed");
        return;
      }
      // If response is a blob (CSV file)
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("Completed");
    } catch (err: any) {
      setStatus(err?.message || "Network error");
    }
  }

  return (
    <div className="mt-8 border rounded p-4 bg-white">
      <h3 className="font-semibold mb-2">Batch upload</h3>
      <p className="text-sm text-slate-600 mb-2">
        Upload a CSV with columns: company, url, role, offer, notes. We'll return a new CSV with the outputs.
      </p>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          setDownloadUrl(null);
          const f = e.target.files?.[0];
          setFile(f || null);
        }}
        className="mb-3"
      />
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file}
          className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
        >
          Start
        </button>
        {status && <span className="text-sm">{status}</span>}
      </div>
      {downloadUrl && (
        <div className="mt-3">
          <a
            href={downloadUrl}
            download="results.csv"
            className="text-blue-600 underline"
          >
            Download CSV
          </a>
        </div>
      )}
    </div>
  );
}