# CiteReady CLI (`citeready-cli`)

**Zero-dependency AI Search (`llms.txt` / GEO), Crawler & Schema.org Technical SEO Auditor — verify whether ChatGPT Search (`OAI-SearchBot`), Perplexity (`PerplexityBot`), Claude (`ClaudeBot`), and Google AI Overviews can crawl, understand, and cite your site.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](./package.json)

- **Live Free Web Diagnostic:** [https://citeready-checker.appwrite.network](https://citeready-checker.appwrite.network)
- **Interactive Docs & Landing Page:** [https://zcoldwater.github.io/citeready-cli/](https://zcoldwater.github.io/citeready-cli/)
- **CiteReady Pro (Auto `llms.txt` Compiler, JSON-LD Generator, CI Gate & Agency Reports):** [https://agentarenastudi.gumroad.com/l/omniforge-citeready](https://agentarenastudi.gumroad.com/l/omniforge-citeready)
- **⚡ Instant Direct / Agent Checkout (24/7 Instant ZIP Download):** [https://omnipulse-x402.appwrite.network/checkout/citeready](https://omnipulse-x402.appwrite.network/checkout/citeready) | **3-in-1 Founder Launch Stack ($49/$89):** [https://omnipulse-x402.appwrite.network/checkout/launch-stack](https://omnipulse-x402.appwrite.network/checkout/launch-stack)


---

## Why 80% of SaaS & DevTool Sites Miss AI Search Citations

1. **Accidental `robots.txt` Blocks:** WAF presets and legacy `robots.txt` templates routinely block `OAI-SearchBot`, `PerplexityBot`, or `ClaudeBot` — making your product invisible when buyers ask AI assistants for tool recommendations.
2. **Missing `/llms.txt` & `/llms-full.txt`:** Docs and marketing SPAs bury core product facts in client-side bundles instead of publishing a clean Markdown index at `/llms.txt`.
3. **Broken or Absent Schema.org JSON-LD:** Invalid JSON-LD syntax or missing `SoftwareApplication`, `Product`, and `FAQPage` graphs starve answer engines of structured pricing and feature facts.

---

## Quick Start (Zero Install via `npx`)

```bash
# Audit any live URL in seconds
npx github:zColdWater/citeready-cli check https://stripe.com

# JSON output for scripts & CI checks
npx github:zColdWater/citeready-cli check https://linear.app --json
```

---

## Free Lite CLI vs. CiteReady Pro

`citeready-cli` is our free MIT-licensed **1-URL quick diagnostic**. To automatically compile `/llms.txt` + `/llms-full.txt` from your live sitemap, generate validated Schema.org JSON-LD, and export branded client GEO audits, upgrade to **[CiteReady Pro](https://agentarenastudi.gumroad.com/l/omniforge-citeready)**:

| Capability | CiteReady Lite (Free OSS) | CiteReady Pro Solo ($19) | CiteReady Pro Agency ($39) |
| :--- | :---: | :---: | :---: |
| **AI Search Crawler `robots.txt` Audit** | 1 URL / run | **Full site + custom `robots.txt` builder** | **Unlimited client domains** |
| **`/llms.txt` & `/llms-full.txt` Compiler** | Spec check only | **Auto-crawls sitemap & compiles clean Markdown** | **Multi-site batch compiler** |
| **Schema.org JSON-LD Toolkit** | Syntax & `@type` check | **Validated JSON-LD generator (SaaS/Product/FAQ)** | **Client-ready JSON-LD snippet packs** |
| **GitHub Actions CI Regression Gate** | — | **Included** (blocks deploys that break GEO/SEO) | **Included** |
| **White-Label Client HTML/PDF Reports** | — | Solo / own projects | **10-seat agency license + `--brand` / `--client`** |

👉 **[Download CiteReady Pro ($19 Solo / $39 Agency — One-Time Payment) on Gumroad](https://agentarenastudi.gumroad.com/l/omniforge-citeready)**

## License

MIT © OmniForge Studio
