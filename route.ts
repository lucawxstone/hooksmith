import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { clampLen } from "@/lib/string";
import { outreachPrompt } from "@/lib/prompt";
import OpenAI from "openai";
import { z } from "zod";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

const reqSchema = z.object({
  company: z.string().min(1),
  role: z.string().optional(),
  offer: z.string().min(1),
  signals: z.string().optional(),
  tone: z.enum(["direct", "friendly", "formal"]).default("direct"),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const lim = rateLimit(ip, Number(process.env.RATE_LIMIT_PER_MIN) || 20);
  if (!lim.ok) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${lim.retryAfter}s` },
      { status: 429 }
    );
  }
  const json = await req.json();
  const parse = reqSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parse.error.flatten() },
      { status: 400 }
    );
  }
  const { company, role, offer, signals, tone } = parse.data;
  const msgs = outreachPrompt({
    company,
    role,
    offer: clampLen(offer, 600),
    signals: clampLen(signals || "", 1600),
    tone,
  });
  try {
    const res = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      messages: msgs as any,
    });
    const text = res.choices?.[0]?.message?.content?.trim() || "";
    return NextResponse.json({ ok: true, text });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "OpenAI error" },
      { status: 500 }
    );
  }
}