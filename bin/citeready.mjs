#!/usr/bin/env node
/**
 * CiteReady Lite CLI (v1.1.0) — Zero-dependency single-URL AI Search (GEO),
 * llms.txt & Schema.org Technical SEO auditor + GitHub Actions CI gate.
 *
 * Checks AI search crawler access in robots.txt (OAI-SearchBot, PerplexityBot,
 * ClaudeBot, Google-Extended), validates /llms.txt & /llms-full.txt, inspects
 * Schema.org JSON-LD graphs, canonical tags, and /sitemap.xml.
 *
 * Need full-sitemap crawling (1,000+ pages), automatic llms.txt + llms-full.txt
 * compilation, Schema.org JSON-LD generator, and white-label client PDF/HTML reports?
 * Upgrade to CiteReady Pro ($19 Solo / $39 Agency — one-time download):
 *   https://api.shipbastion.com/go/gumroad/citeready
 *   Instant Direct Checkout: https://api.shipbastion.com/checkout/citeready
 */

import { appendFileSync, writeFileSync } from "node:fs";

const VERSION = "1.1.0";
const WEB_DIAGNOSTIC = "https://cite.shipbastion.com";
const PRO_URL = "https://api.shipbastion.com/go/gumroad/citeready";
const DIRECT_CHECKOUT_URL = "https://api.shipbastion.com/checkout/citeready";
const COMPARE_URL = "https://zcoldwater.github.io/citeready-cli/compare.html";

const AI_BOTS = [
  { agent: "OAI-SearchBot", owner: "ChatGPT Search" },
  { agent: "GPTBot", owner: "OpenAI Crawler" },
  { agent: "PerplexityBot", owner: "Perplexity Search" },
  { agent: "ClaudeBot", owner: "Anthropic Claude" },
  { agent: "Google-Extended", owner: "Google Gemini / AI" },
  { agent: "Applebot-Extended", owner: "Apple Intelligence" },
];

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = {
    url: "",
    json: false,
    markdown: false,
    summaryFile: "",
    githubOutput: "",
    minScore: 0,
    requireLlmsTxt: false,
    requireJsonLd: false,
    help: false,
    version: false,
  };
  const pos = [];
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === "-h" || a === "--help") opts.help = true;
    else if (a === "-v" || a === "--version") opts.version = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--markdown") opts.markdown = true;
    else if (a === "--require-llms-txt") opts.requireLlmsTxt = true;
    else if (a === "--require-jsonld") opts.requireJsonLd = true;
    else if (a === "--min-score" && args[i + 1]) {
      opts.minScore = Math.max(0, Math.min(100, Number(args[++i]) || 0));
    } else if (a.startsWith("--min-score=")) {
      opts.minScore = Math.max(0, Math.min(100, Number(a.split("=")[1]) || 0));
    } else if (a === "--summary-file" && args[i + 1]) {
      opts.summaryFile = args[++i];
    } else if (a.startsWith("--summary-file=")) {
      opts.summaryFile = a.slice("--summary-file=".length);
    } else if (a === "--github-output" && args[i + 1]) {
      opts.githubOutput = args[++i];
    } else if (a.startsWith("--github-output=")) {
      opts.githubOutput = a.slice("--github-output=".length);
    } else {
      pos.push(a);
    }
  }
  if (pos[0] === "check" || pos[0] === "audit") pos.shift();
  let u = (pos[0] || "").trim();
  if (u && !/^https?:\/\//i.test(u)) u = `https://${u}`;
  opts.url = u;
  return opts;
}

function printHelp() {
  console.log(`
${C.bold}${C.cyan}CiteReady CLI (Lite v${VERSION})${C.reset} — AI Search (GEO), llms.txt & Schema.org SEO Auditor

${C.bold}USAGE${C.reset}
  npx github:zColdWater/citeready-cli check <https://yoursite.com> [options]

${C.bold}OPTIONS${C.reset}
  --json                 Output structured JSON audit result
  --markdown             Output GitHub-Flavored Markdown audit table
  --min-score <0-100>    Exit with code 1 if GEO Visibility Score is below threshold
  --require-llms-txt     Exit with code 1 if spec-compliant /llms.txt is missing
  --require-jsonld       Exit with code 1 if valid Schema.org JSON-LD is missing
  --summary-file <path>  Append Markdown summary report to a file (e.g. $GITHUB_STEP_SUMMARY)
  -v, --version          Print CLI version

${C.bold}EXAMPLES${C.reset}
  npx github:zColdWater/citeready-cli check https://stripe.com
  npx github:zColdWater/citeready-cli check https://yoursite.com --min-score 75 --require-jsonld
  npx github:zColdWater/citeready-cli check linear.app --json

${C.bold}GITHUB ACTION (1-LINE CI GATE)${C.reset}
  - uses: zColdWater/citeready-cli@v1
    with:
      url: https://yoursite.com
      min-score: "75"

${C.bold}FREE WEB DIAGNOSTIC & COMPARISON${C.reset}
  Web Scanner:  ${WEB_DIAGNOSTIC}
  GEO Compare:  ${COMPARE_URL}

${C.bold}UPGRADE TO CITEREADY PRO ($19 Solo / $39 Agency — One-Time Download)${C.reset}
  Auto-crawl your entire sitemap to compile spec-compliant llms.txt & llms-full.txt,
  generate validated Schema.org JSON-LD graphs, enforce multi-URL CI gates & export client reports:
  Gumroad:      ${C.cyan}${PRO_URL}${C.reset}
  Instant ZIP:  ${C.cyan}${DIRECT_CHECKOUT_URL}${C.reset}
`);
}

async function safeGet(url) {
  try {
    const r = await fetch(url, {
      headers: { "user-agent": `CiteReadyCLI/${VERSION} (+https://github.com/zColdWater/citeready-cli)` },
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    const text = r.ok ? await r.text() : "";
    return { ok: r.ok, status: r.status, text, contentType: r.headers.get("content-type") || "" };
  } catch {
    return { ok: false, status: 0, text: "", contentType: "" };
  }
}

function checkRobotsForBot(robotsText, botName) {
  if (!robotsText) return { allowed: true, rule: "no robots.txt (allowed)" };
  const lines = robotsText.split(/\r?\n/);
  let currentAgents = [];
  let lastWasAgent = false;
  const specificRules = [];
  const wildcardRules = [];

  for (const rawLine of lines) {
    const line = rawLine.split("#")[0].trim();
    if (!line) {
      currentAgents = [];
      lastWasAgent = false;
      continue;
    }
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const val = line.slice(idx + 1).trim();
    if (key === "user-agent") {
      if (!lastWasAgent) currentAgents = [];
      currentAgents.push(val.toLowerCase());
      lastWasAgent = true;
    } else if (key === "disallow" || key === "allow") {
      lastWasAgent = false;
      for (const ua of currentAgents) {
        if (ua === botName.toLowerCase()) specificRules.push({ key, val });
        else if (ua === "*") wildcardRules.push({ key, val });
      }
    }
  }

  const rules = specificRules.length ? specificRules : wildcardRules;
  let blocked = false;
  for (const r of rules) {
    if (r.key === "disallow" && r.val === "/") blocked = true;
    if (r.key === "allow" && r.val === "/") blocked = false;
  }
  if (blocked) {
    return { allowed: false, rule: specificRules.length ? `Disallow: / (${botName})` : "Disallow: / (*)" };
  }
  return { allowed: true, rule: specificRules.length ? `Explicit rule (${botName})` : "Allowed" };
}

function inspectJsonLd(html) {
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const types = [];
  let count = 0;
  let errors = 0;
  let m;
  while ((m = re.exec(html)) !== null) {
    count += 1;
    try {
      const parsed = JSON.parse(m[1].trim());
      const items = Array.isArray(parsed) ? parsed : parsed["@graph"] ? parsed["@graph"] : [parsed];
      for (const it of items) {
        if (it && it["@type"]) {
          const t = Array.isArray(it["@type"]) ? it["@type"].join(",") : String(it["@type"]);
          types.push(t);
        }
      }
    } catch {
      errors += 1;
    }
  }
  return { count, types: [...new Set(types)], errors };
}

async function safeGetWithBaseFallback(origin, baseDir, fileName) {
  const rootRes = await safeGet(`${origin}/${fileName}`);
  if (rootRes.ok || !baseDir || baseDir === origin) return rootRes;
  const subRes = await safeGet(`${baseDir}/${fileName}`);
  return subRes.ok ? subRes : rootRes;
}

async function auditUrl(targetUrl) {
  const u = new URL(targetUrl);
  const origin = u.origin;
  const cleanPath = u.pathname.endsWith("/")
    ? u.pathname.slice(0, -1)
    : u.pathname.replace(/\/[^/]*\.[^/]+$/, "");
  const baseDir = cleanPath ? `${origin}${cleanPath}` : origin;

  const [page, robots, llms, llmsFull, sitemap] = await Promise.all([
    safeGet(u.href),
    safeGetWithBaseFallback(origin, baseDir, "robots.txt"),
    safeGetWithBaseFallback(origin, baseDir, "llms.txt"),
    safeGetWithBaseFallback(origin, baseDir, "llms-full.txt"),
    safeGetWithBaseFallback(origin, baseDir, "sitemap.xml"),
  ]);

  const titleMatch = page.text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch =
    page.text.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    page.text.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const canonMatch = page.text.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  const jsonLd = inspectJsonLd(page.text);

  const botResults = AI_BOTS.map((b) => ({
    ...b,
    ...checkRobotsForBot(robots.ok ? robots.text : "", b.agent),
  }));

  const llmsLooksValid =
    llms.ok &&
    !llms.contentType.includes("text/html") &&
    llms.text.trim().startsWith("#");

  const llmsFullPresent =
    llmsFull.ok && !llmsFull.contentType.includes("text/html") && llmsFull.text.trim().length > 40;

  const sitemapPresent =
    sitemap.ok && (sitemap.text.includes("<urlset") || sitemap.text.includes("<sitemapindex"));

  let score = 0;
  const warnings = [];
  if (page.ok) score += 15;
  if (titleMatch && titleMatch[1].trim()) score += 10;
  else warnings.push("Missing <title> tag on page.");
  if (descMatch && descMatch[1].trim()) score += 10;
  else warnings.push("Missing meta description for search/citation snippets.");
  if (canonMatch) score += 5;

  const allowedBots = botResults.filter((b) => b.allowed).length;
  score += Math.round((allowedBots / AI_BOTS.length) * 25);
  if (allowedBots < AI_BOTS.length) {
    warnings.push(`${AI_BOTS.length - allowedBots} AI search crawler(s) blocked in robots.txt.`);
  }

  if (llmsLooksValid) score += 15;
  else warnings.push("No spec-compliant /llms.txt found (use CiteReady Pro to auto-compile from sitemap).");

  if (llmsFullPresent) score += 5;
  if (jsonLd.count > 0 && jsonLd.errors === 0) score += 10;
  else if (jsonLd.errors > 0) warnings.push(`${jsonLd.errors} malformed JSON-LD script block(s) failed JSON.parse.`);
  else warnings.push("No Schema.org JSON-LD structured data found on page.");

  if (sitemapPresent) score += 5;
  else warnings.push("No XML sitemap found at /sitemap.xml.");

  score = Math.min(100, Math.max(0, score));
  const grade = score >= 88 ? "A" : score >= 72 ? "B" : score >= 52 ? "C" : "D";

  return {
    url: u.href,
    origin,
    checkedAt: new Date().toISOString(),
    httpStatus: page.status,
    score,
    grade,
    title: titleMatch ? titleMatch[1].trim().replace(/\s+/g, " ").slice(0, 90) : null,
    hasDescription: Boolean(descMatch && descMatch[1].trim()),
    hasCanonical: Boolean(canonMatch),
    bots: botResults,
    llmsTxt: { present: llmsLooksValid, bytes: llmsLooksValid ? llms.text.length : 0 },
    llmsFullTxt: { present: llmsFullPresent },
    jsonLd,
    sitemapPresent,
    warnings,
  };
}

function renderMarkdown(r, gateFailures) {
  const allowedCount = r.bots.filter((b) => b.allowed).length;
  const statusEmoji = gateFailures.length === 0 && r.score >= 72 ? "✅" : gateFailures.length > 0 ? "❌" : "⚠️";
  const jldCell =
    r.jsonLd.count > 0 && r.jsonLd.errors === 0
      ? `✅ ${r.jsonLd.count} block(s) (\`${r.jsonLd.types.join(", ")}\`)`
      : r.jsonLd.errors > 0
      ? `❌ ${r.jsonLd.errors} syntax error(s)`
      : `⚠️ None detected`;

  const lines = [
    `## ${statusEmoji} CiteReady AI Search (GEO) & Technical SEO Audit`,
    ``,
    `**Audited URL:** ${r.url}  `,
    `**GEO Visibility Score:** **${r.score}/100 (Grade ${r.grade})**`,
    ``,
    `| Signal | Status | Details |`,
    `| :--- | :--- | :--- |`,
    `| **AI Search Crawlers (\`robots.txt\`)** | ${allowedCount === r.bots.length ? "✅ All Allowed" : `⚠️ ${allowedCount}/${r.bots.length} Allowed`} | ${r.bots.map((b) => `\`${b.agent}\` ${b.allowed ? "✔" : "✖"}`).join(" · ")} |`,
    `| **\`/llms.txt\` Index** | ${r.llmsTxt.present ? "✅ Present" : "⚠️ Missing"} | ${r.llmsTxt.present ? `${r.llmsTxt.bytes} bytes spec-compliant Markdown` : "Publish `/llms.txt` so answer engines map core pages"} |`,
    `| **\`/llms-full.txt\` Companion** | ${r.llmsFullTxt.present ? "✅ Present" : "➖ Optional"} | ${r.llmsFullTxt.present ? "Full Markdown context available" : "Not found"} |`,
    `| **Schema.org JSON-LD** | ${r.jsonLd.count > 0 && r.jsonLd.errors === 0 ? "✅ Valid" : "⚠️ Needs Attention"} | ${jldCell} |`,
    `| **\`/sitemap.xml\` & Canonical** | ${r.sitemapPresent && r.hasCanonical ? "✅ Present" : "⚠️ Partial"} | Sitemap: ${r.sitemapPresent ? "✔" : "✖"} · Canonical: ${r.hasCanonical ? "✔" : "✖"} |`,
    ``,
  ];

  if (gateFailures.length) {
    lines.push(`### ❌ CI Gate Failures`);
    for (const f of gateFailures) lines.push(`- ${f}`);
    lines.push(``);
  } else if (r.warnings.length) {
    lines.push(`### 💡 Optimization Opportunities`);
    for (const w of r.warnings) lines.push(`- ${w}`);
    lines.push(``);
  }

  lines.push(
    `> **Auto-fix missing \`/llms.txt\` & JSON-LD across your full sitemap:** [Interactive Web Diagnostic](${WEB_DIAGNOSTIC}/?url=${encodeURIComponent(r.url)}) · [CiteReady Pro ($19 One-Time)](${PRO_URL}) · [⚡ Instant Direct Checkout](${DIRECT_CHECKOUT_URL})`
  );
  lines.push(``);
  return lines.join("\n");
}

function evaluateGates(r, opts) {
  const failures = [];
  if (opts.minScore > 0 && r.score < opts.minScore) {
    failures.push(`GEO Visibility Score ${r.score}/100 is below required --min-score ${opts.minScore}.`);
  }
  if (opts.requireLlmsTxt && !r.llmsTxt.present) {
    failures.push(`Required spec-compliant /llms.txt was not found at ${r.origin}/llms.txt.`);
  }
  if (opts.requireJsonLd && (r.jsonLd.count === 0 || r.jsonLd.errors > 0)) {
    failures.push(`Valid Schema.org JSON-LD structured data is required (--require-jsonld).`);
  }
  return failures;
}

function writeGithubOutputs(filePath, r) {
  const payload = [
    `score=${r.score}`,
    `grade=${r.grade}`,
    `llms-txt-present=${r.llmsTxt.present}`,
    `jsonld-count=${r.jsonLd.count}`,
    `json=${JSON.stringify(r)}`,
  ].join("\n") + "\n";
  appendFileSync(filePath, payload, "utf8");
}

async function main() {
  const opts = parseArgs(process.argv);
  if (opts.version) {
    console.log(VERSION);
    return;
  }
  if (opts.help || !opts.url) {
    printHelp();
    process.exit(opts.help ? 0 : 1);
  }

  const r = await auditUrl(opts.url);
  const gateFailures = evaluateGates(r, opts);
  const md = renderMarkdown(r, gateFailures);

  if (opts.summaryFile) {
    try {
      appendFileSync(opts.summaryFile, md + "\n", "utf8");
    } catch {
      writeFileSync(opts.summaryFile, md + "\n", "utf8");
    }
  }

  if (opts.githubOutput) {
    writeGithubOutputs(opts.githubOutput, r);
  }

  if (opts.json) {
    console.log(JSON.stringify({ ...r, gatePassed: gateFailures.length === 0, gateFailures }, null, 2));
    if (gateFailures.length > 0) process.exit(1);
    return;
  }

  if (opts.markdown) {
    console.log(md);
    if (gateFailures.length > 0) process.exit(1);
    return;
  }

  const scColor = r.score >= 80 ? C.green : r.score >= 55 ? C.yellow : C.red;
  console.log(`\n${C.bold}CiteReady AI Search (GEO) & Technical SEO Audit — ${r.url}${C.reset}`);
  console.log(`Visibility Score: ${scColor}${C.bold}${r.score}/100 (Grade ${r.grade})${C.reset}\n`);

  console.log(`  1. AI Crawler Access (robots.txt)`);
  for (const b of r.bots) {
    const st = b.allowed ? `${C.green}✔ ALLOWED${C.reset}` : `${C.red}✖ BLOCKED${C.reset}`;
    console.log(`     ${(b.agent + " (" + b.owner + ")").padEnd(40)} ${st}`);
  }

  console.log(`\n  2. LLM & Structured Discovery Signals`);
  console.log(
    `     /llms.txt Spec File                      ${
      r.llmsTxt.present ? `${C.green}✔ Present (${r.llmsTxt.bytes} B)${C.reset}` : `${C.yellow}✖ Missing${C.reset}`
    }`
  );
  console.log(
    `     /llms-full.txt Companion                 ${
      r.llmsFullTxt.present ? `${C.green}✔ Present${C.reset}` : `${C.dim}— Not found${C.reset}`
    }`
  );
  console.log(
    `     Schema.org JSON-LD                       ${
      r.jsonLd.count > 0 && r.jsonLd.errors === 0
        ? `${C.green}✔ ${r.jsonLd.count} block(s) [${r.jsonLd.types.join(", ")}]${C.reset}`
        : r.jsonLd.errors > 0
        ? `${C.red}✖ ${r.jsonLd.errors} syntax error(s)${C.reset}`
        : `${C.yellow}✖ None${C.reset}`
    }`
  );
  console.log(
    `     /sitemap.xml & Canonical                 Sitemap: ${
      r.sitemapPresent ? `${C.green}✔${C.reset}` : `${C.yellow}✖${C.reset}`
    }  |  Canonical: ${r.hasCanonical ? `${C.green}✔${C.reset}` : `${C.yellow}✖${C.reset}`}`
  );

  if (r.warnings.length) {
    console.log(`\n  ${C.bold}Optimization Opportunities:${C.reset}`);
    for (const w of r.warnings) {
      console.log(`     ${C.yellow}•${C.reset} ${w}`);
    }
  }

  if (gateFailures.length) {
    console.log(`\n  ${C.bold}${C.red}CI Gate Failed:${C.reset}`);
    for (const f of gateFailures) {
      console.log(`     ${C.red}✖${C.reset} ${f}`);
    }
  }

  console.log(
    `\n${C.bold}${C.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n` +
      `${C.bold}Want to auto-generate /llms.txt + JSON-LD across your entire sitemap?${C.reset}\n` +
      `Upgrade to ${C.bold}CiteReady Pro${C.reset} ($19 Solo / $39 Agency — one-time download, $0/mo):\n` +
      `  • Multi-page sitemap crawler & automatic llms.txt + llms-full.txt compiler\n` +
      `  • Validated Schema.org JSON-LD generator + GitHub Actions CI regression gate\n` +
      `  • White-label HTML/PDF client GEO & Technical SEO audit reports\n` +
      `  👉 Gumroad:         ${C.bold}${C.cyan}${PRO_URL}${C.reset}\n` +
      `  ⚡ Instant ZIP:     ${C.cyan}${DIRECT_CHECKOUT_URL}${C.reset}\n` +
      `  🌐 Free Web Audit:  ${C.cyan}${WEB_DIAGNOSTIC}${C.reset}\n` +
      `${C.bold}${C.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`
  );

  if (gateFailures.length > 0) {
    process.exit(1);
  }
}

main();
