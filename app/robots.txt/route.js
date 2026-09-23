import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const AI_BOTS = [
  "ClaudeBot",
  "GPTBot",
  "Google-Extended",
  "ChatGPT-User",
  "CCBot",
  "anthropic-ai",
  "Bytespider",
  "Diffbot",
  "FacebookBot",
  "Omgilibot",
  "Applebot-Extended",
];

export async function GET() {
  // Read setting from DB — default to allowing AI bots
  const apiBase =
    process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let blockAiBots = false;
  try {
    const res = await fetch(`${apiBase}/api/settings/blockAiBots`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const { data } = await res.json();
      blockAiBots = data === true;
    }
  } catch {
    // DB offline or setting not found — allow all
  }

  const lines = ["User-Agent: *", "Allow: /"];

  if (blockAiBots) {
    for (const bot of AI_BOTS) {
      lines.push("", `User-Agent: ${bot}`, "Disallow: /");
    }
  }

  // Sitemap for crawlers, llms.txt for AI assistants. `Llms-txt` is not part of
  // the robots.txt spec, so crawlers ignore the unknown directive (RFC 9309) —
  // the comment above it is what readiness checkers and humans actually read.
  lines.push(
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
    `# llms.txt: ${SITE_URL}/llms.txt`,
    `Llms-txt: ${SITE_URL}/llms.txt`,
  );

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
