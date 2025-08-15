# Hooksmith

Hooksmith is a simple AI powered outreach tool. Given a company website and a one–sentence offer, it extracts a few signals from the site and uses an AI model to generate:

- a personalised opener
- a short cold email (60–100 words)
- a LinkedIn DM (40–70 words)
- three subject lines (each under 6 words)

It also supports batch generation via CSV upload.

## Features

### Single lead flow

- Enter a website URL, company name, optional role, and your offer.
- Click **Extract** to scrape the title, description, headings and keywords from the site. You can edit these signals before use.
- Choose a tone (direct, friendly or formal) and click **Write outreach**. The results will appear on the page with copy buttons.
- Click **Variant** to generate another version using the same inputs.

### CSV upload

Upload a CSV with columns:

- `company` – required
- `url` – optional URL to scrape
- `role` – optional
- `offer` – required sentence describing your product or service
- `notes` – optional free text to include in the signals

Hooksmith will generate the four outputs for each row and return a new CSV with additional columns: `opener`, `email`, `linkedin_dm`, `subject_1`, `subject_2`, `subject_3`, and `signals_used`.

## Getting started

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env.local` file at the project root with your OpenAI API key:

```
OPENAI_API_KEY=sk-...
RATE_LIMIT_PER_MIN=20
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Sample CSV

You can use this header row as a starting point for batch generation:

```
company,url,role,offer,notes
Acme Corp,https://acme.com,Marketing Director,"We help you reduce churn by 20% in 90 days","B2B SaaS platform"
Beta Co,https://beta.co,,"Automate your accounting processes",""
```

## Limitations

- The rate limiter is an in–memory counter keyed by IP. It is not suitable for multi–instance deployments.
- The scraping logic uses a simple heuristic and may not capture all relevant information from complex sites.
- The AI output parser assumes the model returns outputs in numbered sections (1–4) separated by new lines. If the model returns a different format, parsing may fail.

## License

MIT