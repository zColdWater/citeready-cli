#!/usr/bin/env node
/**
 * CiteReady Lite CLI — Zero-dependency single-URL AI Search (GEO), llms.txt & Schema.org auditor.
 * Checks AI search crawler access in robots.txt (OAI-SearchBot, PerplexityBot, ClaudeBot,
 * Google-Extended), validates /llms.txt & /llms-full.txt, inspects Schema.org JSON-LD graphs,
 * canonical/OpenGraph tags, and /sitemap.xml.
 *
 * Need full-sitemap crawling (1,000+ pages), automatic llms.txt + llms-full.txt compilation,
 * Schema.org JSON-LD generator, CI regression gates, and white-label client PDF/HTML reports?
 * Upgrade to CiteReady Pro ($19 Solo / $39 Agency — one-time download):
 *   https://agentarenastudi.gumroad.com/l/omniforge-citeready
 */

const WEB_DIAGNOSTIC = "https://citeready-checker.appwrite.network";
const PRO_URL = "https://agentarenastudi.gumroad.com/l/omniforge-citeready";

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
  const opts = { url: "", json: false, help: false };
  const pos = [];
  for (const a of args) {
    if (a === "-h" || a === "--help") opts.help = true;
    else if (a === "--json") opts.json = true;
    else pos.push(a);
  }
  if (pos[0] === "check" || pos[0] === "audit") pos.shift();
  let u = (pos[0] || "").trim();
  if (u && !/^https?:\/\//i.test(u)) u = `https://${u}`;
  opts.url = u;
  return opts;
}

function printHelp() {
  console.log(`
${C.bold}${C.cyan}CiteReady CLI (Lite v1.0.0)${C.reset} — AI Search (GEO), llms.txt & Schema.org SEO Auditor

${C.bold}USAGE${C.reset}
  npx github:zColdWater/citeready-cli check <https://yoursite.com> [--json]

${C.bold}EXAMPLES${C.reset}
  npx github:zColdWater/citeready-cli check https://stripe.com
  npx github:zColdWater/citeready-cli check linear.app --json

${C.bold}FREE WEB DIAGNOSTIC${C.reset}
  ${WEB_DIAGNOSTIC}

${C.bold}UPGRADE TO CITEREADY PRO ($19 Solo / $39 Agency — One-Time Download)${C.reset}
  Auto-crawl your entire sitemap to compile spec-compliant llms.txt & llms-full.txt,
  generate validated Schema.org JSON-LD graphs, enforce CI gates & export white-label client reports:
  ${C.cyan}${PRO_URL}${C.reset}
`);
}

async function safeGet(url) {
  try {
    const r = await fetch(url, {
      headers: { "user-agent": "CiteReadyCLI/1.0 (+https://github.com/zColdWater/citeready-cli)" },
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
  const specificRules = [];
  const wildcardRules = [];

  for (const rawLine of lines) {
    const line = rawLine.split("#")[0].trim();
    if (!line) {
      currentAgents = [];
      continue;
    }
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const val = line.slice(idx + 1).trim();
    if (key === "user-agent") {
      currentAgents.push(val.toLowerCase());
    } else if (key === "disallow" || key === "allow") {
      for (const ua of currentAgents) {
        if (ua === botName.toLowerCase()) specificRules.push({ key, val });
        else if (ua === "*") wildcardRules.push({ key, val });
      }
    }
  }

  const rules = specificRules.length ? specificRules : wildcardRules;
  for (const r of rules) {
    if (r.key === "disallow" && r.val === "/") {
      return { allowed: false, rule: specificRules.length ? `Disallow: / (${botName})` : "Disallow: / (*)" };
    }
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

async function auditUrl(targetUrl) {
  const u = new URL(targetUrl);
  const origin = u.origin;

  const [page, robots, llms, llmsFull, sitemap] = await Promise.all([
    safeGet(u.href),
    safeGet(`${origin}/robots.txt`),
    safeGet(`${origin}/llms.txt`),
    safeGet(`${origin}/llms-full.txt`),
    safeGet(`${origin}/sitemap.xml`),
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

async function main() {
  const opts = parseArgs(process.argv);
  if (opts.help || !opts.url) {
    printHelp();
    process.exit(opts.help ? 0 : 1);
  }

  const r = await auditUrl(opts.url);
  if (opts.json) {
    console.log(JSON.stringify(r, null, 2));
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

  console.log(
    `\n${C.bold}${C.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n` +
      `${C.bold}Want to auto-generate /llms.txt + JSON-LD across your entire sitemap?${C.reset}\n` +
      `Upgrade to ${C.bold}CiteReady Pro${C.reset} ($19 Solo / $39 Agency — one-time download, $0/mo):\n` +
      `  • Multi-page sitemap crawler & automatic llms.txt + llms-full.txt compiler\n` +
      `  • Validated Schema.org JSON-LD generator + GitHub Actions CI regression gate\n` +
      `  • White-label HTML/PDF client GEO & Technical SEO audit reports\n` +
      `  👉 ${C.bold}${C.cyan}${PRO_URL}${C.reset}\n` +
      `  🌐 Free interactive web diagnostic: ${C.cyan}${WEB_DIAGNOSTIC}${C.reset}\n` +
      `${C.bold}${C.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`
  );
}

main();
