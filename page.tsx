import LeadForm from "@/components/LeadForm";
import Output from "@/components/Output";
import { useState } from "react";

// This component is used as a client component wrapper around the page.  
export default function Page() {
  return <ClientPage />;
}

function ClientPage() {
  const [text, setText] = useState("");
  return (
    <div className="min-h-screen py-8 px-4 md:px-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Hooksmith</h1>
        <p className="text-slate-600 mb-6">
          Paste a website, add your offer, get a tailored opener, email, DM, and subjects.
        </p>
        <LeadForm onResult={setText} />
        <Output text={text} />
      </div>
    </div>
  );
}