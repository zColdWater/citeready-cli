# CiteReady CLI & GitHub Action (`citeready-cli`)

**Zero-dependency AI Search (`llms.txt` / GEO), Crawler & Schema.org Technical SEO Auditor + GitHub Action — verify whether ChatGPT Search (`OAI-SearchBot`), Perplexity (`PerplexityBot`), Claude (`ClaudeBot`), and Google AI Overviews can crawl, understand, and cite your site.**

[![AI CiteReady Live](https://citeready-checker.appwrite.network/badge/citeready/stripe.com.svg)](https://citeready-checker.appwrite.network/?url=https://stripe.com)
[![Email Security Live](https://inbox-checker.appwrite.network/badge/inbox/stripe.com.svg)](https://inbox-checker.appwrite.network/?domain=stripe.com)
[![BrandShield Live](https://brand-checker.appwrite.network/badge/brand/Zqxvora.svg)](https://brand-checker.appwrite.network/report/Zqxvora)
[![GitHub Action](https://img.shields.io/badge/GitHub%20Action-zColdWater%2Fciteready--cli%40v1-7c3aed?logo=githubactions&logoColor=white)](./action.yml)
[![Release](https://img.shields.io/github/v/release/zColdWater/citeready-cli?color=10b981)](https://github.com/zColdWater/citeready-cli/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](./package.json)

- **Live Free Web Diagnostic:** [https://citeready-checker.appwrite.network](https://citeready-checker.appwrite.network)
- **Interactive Docs & Landing Page:** [https://zcoldwater.github.io/citeready-cli/](https://zcoldwater.github.io/citeready-cli/)
- **2026 GEO Tool Comparison ($19 One-Time vs. $99+/mo Trackers):** [https://zcoldwater.github.io/citeready-cli/compare.html](https://zcoldwater.github.io/citeready-cli/compare.html)
- **GitHub Action CI/CD Guide:** [https://zcoldwater.github.io/citeready-cli/llms-txt-github-action-guide.html](https://zcoldwater.github.io/citeready-cli/llms-txt-github-action-guide.html)
- **CiteReady Pro (Auto `llms.txt` Compiler, JSON-LD Generator, CI Gate & Agency Reports):** [https://omnipulse-x402.appwrite.network/go/gumroad/citeready](https://omnipulse-x402.appwrite.network/go/gumroad/citeready)
- **⚡ Instant Direct / Agent Checkout (24/7 Instant ZIP Download):** [https://omnipulse-x402.appwrite.network/checkout/citeready](https://omnipulse-x402.appwrite.network/checkout/citeready) | **3-in-1 Founder Launch Stack ($49/$89):** [https://omnipulse-x402.appwrite.network/checkout/launch-stack](https://omnipulse-x402.appwrite.network/checkout/launch-stack)

---

## Embed a Live AI CiteReady Trust Badge

Show developers and users that your docs and site are verified open to AI search engines — updates live via `/badge/citeready/<domain>.svg` (`flat`, `flat-square`, `for-the-badge`, or `card` footer widget):

[![AI CiteReady Card](https://citeready-checker.appwrite.network/badge/citeready/stripe.com.svg?style=card)](https://citeready-checker.appwrite.network/?url=https://stripe.com)

```markdown
[![AI CiteReady](https://citeready-checker.appwrite.network/badge/citeready/yourdomain.com.svg)](https://citeready-checker.appwrite.network/?url=https://yourdomain.com)
```

Generate & preview all 4 styles in the **[Live Trust Badge Studio](https://citeready-checker.appwrite.network/badge)**.

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

# Enforce CI thresholds (fail non-zero on regression)
npx github:zColdWater/citeready-cli check https://yoursite.com --min-score 75 --require-llms-txt --require-jsonld

# JSON or GitHub-Flavored Markdown output
npx github:zColdWater/citeready-cli check https://linear.app --json
npx github:zColdWater/citeready-cli check https://linear.app --markdown
```

---

## Use as a GitHub Action (1-Line CI/CD Gate)

Block pull requests or post-deploy regressions that accidentally break AI search crawler access, `/llms.txt`, or Schema.org JSON-LD — and render a clean Markdown scorecard directly inside `$GITHUB_STEP_SUMMARY`:

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

### Action Inputs & Outputs

| Input | Default | Description |
| :--- | :---: | :--- |
| `url` | *(required)* | Live URL or preview deployment URL to audit |
| `min-score` | `"0"` | Fail workflow if GEO Visibility Score (`0–100`) falls below threshold |
| `require-llms-txt` | `"false"` | Set `"true"` to fail when spec-compliant `/llms.txt` is missing |
| `require-jsonld` | `"false"` | Set `"true"` to fail when valid Schema.org JSON-LD is missing |

Outputs: `score`, `grade`, `llms-txt-present`, `jsonld-count`, and `json`.

---

## Free Lite CLI vs. CiteReady Pro

`citeready-cli` is our free MIT-licensed **1-URL quick diagnostic & GitHub Action**. To automatically compile `/llms.txt` + `/llms-full.txt` from your live sitemap (1,000+ pages), generate validated Schema.org JSON-LD, and export branded client GEO audits, upgrade to **[CiteReady Pro](https://omnipulse-x402.appwrite.network/go/gumroad/citeready)** (see [full comparison vs. $99+/mo GEO SaaS trackers](https://zcoldwater.github.io/citeready-cli/compare.html)):

| Capability | CiteReady Lite (Free OSS) | CiteReady Pro Solo ($19) | CiteReady Pro Agency ($39) |
| :--- | :---: | :---: | :---: |
| **AI Search Crawler `robots.txt` Audit** | 1 URL / run | **Full site + custom `robots.txt` builder** | **Unlimited client domains** |
| **`/llms.txt` & `/llms-full.txt` Compiler** | Spec check only | **Auto-crawls sitemap & compiles clean Markdown** | **Multi-site batch compiler** |
| **Schema.org JSON-LD Toolkit** | Syntax & `@type` check | **Validated JSON-LD generator (SaaS/Product/FAQ)** | **Client-ready JSON-LD snippet packs** |
| **GitHub Actions CI Regression Gate** | Single-URL `@v1` Action | **Multi-URL full-sitemap CI suite** | **Included** |
| **White-Label Client HTML/PDF Reports** | — | Solo / own projects | **10-seat agency license + `--brand` / `--client`** |

👉 **[Download CiteReady Pro ($19 Solo / $39 Agency — One-Time Payment) on Gumroad](https://omnipulse-x402.appwrite.network/go/gumroad/citeready)** · **[⚡ Instant Direct / Agent Checkout](https://omnipulse-x402.appwrite.network/checkout/citeready)**

## License

MIT © OmniForge Studio
