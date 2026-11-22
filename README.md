# CiteReady — Online AI Search (GEO), 10-Bot Crawler & `/llms.txt` Auditor (`v5.0` Web App + OSS CLI & GitHub Action)

**Verify whether ChatGPT Search (`OAI-SearchBot`), Perplexity (`PerplexityBot`), Claude (`ClaudeBot`), Google AI Overviews (`Google-Extended`), Apple Intelligence, Doubao (`Bytespider`), and Baidu AI can crawl and cite your site — free in 2 seconds directly in your browser, or in CI via `zColdWater/citeready-cli@v1`.**

[![AI CiteReady Live](https://citeready-checker.appwrite.network/badge/citeready/stripe.com.svg)](https://citeready-checker.appwrite.network/?url=https://stripe.com)
[![Email Security Live](https://inbox-checker.appwrite.network/badge/inbox/stripe.com.svg)](https://inbox-checker.appwrite.network/?domain=stripe.com)
[![BrandShield Live](https://brand-checker.appwrite.network/badge/brand/Zqxvora.svg)](https://brand-checker.appwrite.network/report/Zqxvora)
[![GitHub Action](https://img.shields.io/badge/GitHub%20Action-zColdWater%2Fciteready--cli%40v1-7c3aed?logo=githubactions&logoColor=white)](./action.yml)
[![Release](https://img.shields.io/github/v/release/zColdWater/citeready-cli?color=10b981)](https://github.com/zColdWater/citeready-cli/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](./package.json)

- **Flagship v5.0 Online Web App (Zero Signup, 2-Second Audit):** [https://citeready-checker.appwrite.network](https://citeready-checker.appwrite.network)
- **Free Online `/llms.txt` Compiler & Sitemap Gap Scanner:** [https://citeready-checker.appwrite.network/generator](https://citeready-checker.appwrite.network/generator)
- **Docs & Honest Comparisons ($12 Once vs. €89+/mo Trackers):** [https://zcoldwater.github.io/citeready-cli/](https://zcoldwater.github.io/citeready-cli/) · [Peec AI vs. CiteReady](https://zcoldwater.github.io/launch-audit-reports/compare/peec-ai-vs-citeready.html) · [Compare Guide](https://zcoldwater.github.io/citeready-cli/compare.html) · [GitHub Action CI Guide](https://zcoldwater.github.io/citeready-cli/llms-txt-github-action-guide.html)
- **CiteReady Web Pro ($12 One-Time — Instant In-Browser Unlock, 14-Day Refund):** [Gumroad Checkout](https://omnipulse-x402.appwrite.network/go/gumroad/citeready) · [Direct 7-Chain Checkout](https://omnipulse-x402.appwrite.network/checkout/citeready)
- **4-in-1 OmniForge Web Pro Suite ($29 One-Time — Unlocks VibeShield + BrandShield + CiteReady + InboxShield, Save $19):** [Gumroad Bundle](https://omnipulse-x402.appwrite.network/go/gumroad/launch-stack) · [Direct Checkout](https://omnipulse-x402.appwrite.network/checkout/launch-stack)

---

## Why Websites Miss AI Search Citations

1. **Accidental `robots.txt` & `X-Robots-Tag` Blocks:** WAF presets and legacy `robots.txt` rules routinely block `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, or `Bytespider`, preventing answer engines from crawling your product and pricing pages.
2. **Missing Schema.org Entity Graph (`@graph`):** Without valid `Organization`, `SoftwareApplication`/`Product`, `Offer`, and `FAQPage` JSON-LD entities, LLMs cannot reliably extract structured product facts.
3. **Missing `/llms.txt` & Low Server-Rendered Text:** Client-only JS apps without a clean root `/llms.txt` index leave AI crawlers guessing which docs matter most.

---

## Free Online Web App vs. CiteReady Web Pro (`$12` One-Time)

Zero software installs, zero monthly subscriptions. Unlock Web Pro right inside [citeready-checker.appwrite.network](https://citeready-checker.appwrite.network) with one-time payment (Gumroad or 7-chain USDT/USDC) and a **14-day refund guarantee**:

| Capability | Free Online Scanner & OSS CLI | CiteReady Web Pro ($12 Once) | 4-in-1 Web Pro Suite ($29 Once) |
| :--- | :---: | :---: | :---: |
| **10 Global & China AI Crawler Matrix + `X-Robots-Tag`** | Unlimited 1-by-1 | **Unlimited + exact `robots.txt` patch** | **All 4 v5.0 Web Apps Included** |
| **Schema.org Entity Graph Depth Score** | Live scan + score | **Unmasked `@graph` JSON-LD code** | **CiteReady + VibeShield ($9)** |
| **`/llms.txt` Online Compiler & Sitemap Gap Check** | Unlimited starter | **Full root `/llms.txt` + VS-Page blueprint** | **+ BrandShield Naming ($12)** |
| **5-Platform 3-Step Fix Wizard** | Step 1 preview | **Next.js, WordPress, Webflow/Shopify, Cloudflare & Cursor/Lovable** | **+ InboxShield Email ($15)** |
| **Online Batch Scanner + Excel/CSV Export** | Preview 3 URLs | **Up to 50 URLs / batch + UTF-8 CSV** | **50-item batch CSV on all 4 apps** |
| **Printable A4 Client GEO PDF Report** | Summary only | **Custom-header A4 PDF (`@media print`)** | **Branded A4 PDF on all 4 apps** |

> **Honest Scope:** CiteReady audits and generates **technical on-site AI crawlability, `robots.txt`, Schema.org entity markup, and `/llms.txt`** on demand — it is not a `$1,000+/yr` daily LLM prompt-polling tracker.

**[Unlock CiteReady Web Pro ($12 Once)](https://omnipulse-x402.appwrite.network/go/gumroad/citeready)** · **[Unlock 4-in-1 Suite ($29 Once — Save $19)](https://omnipulse-x402.appwrite.network/go/gumroad/launch-stack)** · **[Direct Multi-Chain Checkout](https://omnipulse-x402.appwrite.network/checkout/citeready)**

---

## Optional Open-Source CLI & GitHub Action (`uses: zColdWater/citeready-cli@v1`)

```bash
# Audit any live URL in seconds (Node.js 18+, zero dependencies)
npx github:zColdWater/citeready-cli check https://stripe.com
npx github:zColdWater/citeready-cli check https://yoursite.com --min-score 75 --require-llms-txt --require-jsonld
```

```yaml
name: AI Search (GEO) & Schema.org Audit
on: [push, pull_request]

jobs:
  citeready:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Audit Production AI Citation Signals
        id: geo
        uses: zColdWater/citeready-cli@v1
        with:
          url: "https://yoursite.com"
          min-score: "75"
          require-llms-txt: "true"
          require-jsonld: "true"
```

## Live Badge Embed

```markdown
[![AI CiteReady](https://citeready-checker.appwrite.network/badge/citeready/yourdomain.com.svg)](https://citeready-checker.appwrite.network/?url=https://yourdomain.com)
```

## Support & Contact

OmniForge · Agent Arena Studio — `agentarenastudio@proton.me` · [@agentarenastudi](https://x.com/agentarenastudi) · [Support Portal](https://omnipulse-x402.appwrite.network/support) · [14-Day Refund Policy](https://omnipulse-x402.appwrite.network/refund-policy)

## License

MIT © OmniForge · Agent Arena Studio
