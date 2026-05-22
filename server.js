import { createReadStream, existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const port = Number(process.env.PORT || 3000);
const distDir = resolve("dist");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const sendJson = (res, status, payload) => {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
};

const cleanHtml = (html) => {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();

  return { title, text };
};

const handleJobFromUrl = async (req, res) => {
  try {
    const requestUrl = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
    const target = requestUrl.searchParams.get("url");

    if (!target) {
      sendJson(res, 400, { error: "Link da vaga não informado." });
      return;
    }

    const parsed = new URL(target);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      sendJson(res, 400, { error: "Use um link http ou https." });
      return;
    }

    const response = await fetch(parsed.toString(), {
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7",
        "accept-language": "pt-BR,pt;q=0.9,en;q=0.8",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      sendJson(res, response.status, { error: `A página respondeu com status ${response.status}.` });
      return;
    }

    const contentType = response.headers.get("content-type") || "";
    const raw = await response.text();
    const { title, text } = contentType.includes("html") ? cleanHtml(raw) : { title: parsed.hostname, text: raw };
    const clippedText = text.slice(0, 18000);

    if (clippedText.length < 80) {
      sendJson(res, 422, { error: "O link abriu, mas não trouxe texto suficiente da vaga." });
      return;
    }

    sendJson(res, 200, { title, text: clippedText, url: response.url || parsed.toString() });
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : "Não foi possível buscar esse link." });
  }
};

const serveStatic = async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const requestedPath = decodeURIComponent(url.pathname);
  const safePath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  let filePath = join(distDir, safePath);

  if (!filePath.startsWith(distDir)) {
    sendJson(res, 403, { error: "Caminho inválido." });
    return;
  }

  if (!existsSync(filePath) || requestedPath === "/") {
    filePath = join(distDir, "index.html");
  }

  try {
    const ext = extname(filePath);
    res.writeHead(200, { "content-type": mimeTypes[ext] || "application/octet-stream" });
    createReadStream(filePath).pipe(res);
  } catch {
    const fallback = await readFile(join(distDir, "index.html"));
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(fallback);
  }
};

createServer((req, res) => {
  if (req.url?.startsWith("/api/job-from-url")) {
    void handleJobFromUrl(req, res);
    return;
  }

  void serveStatic(req, res);
}).listen(port, () => {
  console.log(`AnaliseCV IA running on port ${port}`);
});
