// Generate prompt messages for OpenAI chat completions.

export function outreachPrompt(input: {
  company: string;
  role?: string;
  offer: string;
  signals: string;
  tone: "direct" | "friendly" | "formal";
}) {
  return [
    {
      role: "system",
      content:
        "You write cold outreach that gets replies. British spelling. Be concrete. No fluff. Keep it short.",
    },
    {
      role: "user",
      content: `Prospect:\n- Company: ${input.company}\n- Role: ${input.role || "Unknown"}\n- Signals: ${input.signals}\n\nUser offer:\n${input.offer}\n\nTone: ${input.tone}\n\nOutput:\n1) One personalised opener line under 18 words.\n2) Email, 60 to 100 words, one clear ask, plain language.\n3) LinkedIn DM, 40 to 70 words, one clear ask.\n4) Three subject lines, each under 6 words.\n\nRules:\n- Use the signals to ground the copy.\n- No jargon. No filler. One idea per sentence.\n- Avoid \"I wanted to reach out\".\n- Put the ask once, clearly.`,
    },
  ];
}