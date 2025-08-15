"use client";

import { useRef } from "react";

interface OutputProps {
  text: string;
}

export default function Output({ text }: OutputProps) {
  const preRef = useRef<HTMLPreElement>(null);

  function copyAll() {
    if (preRef.current) {
      navigator.clipboard.writeText(preRef.current.innerText);
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Output</h3>
        <button
          type="button"
          onClick={copyAll}
          className="px-3 py-1.5 bg-slate-900 text-white rounded"
        >
          Copy all
        </button>
      </div>
      <pre
        ref={preRef}
        className="whitespace-pre-wrap border rounded p-4 bg-white min-h-[160px]"
      >
        {text || "Run a generation to see results."}
      </pre>
    </div>
  );
}