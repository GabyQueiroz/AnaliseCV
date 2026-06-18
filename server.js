import { createReadStream, existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

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

const readRequestBody = (req, maxBytes = 16 * 1024 * 1024) =>
  new Promise((resolveBody, rejectBody) => {
    const chunks = [];
    let size = 0;

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        rejectBody(new Error("Arquivo maior que 16 MB."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolveBody(Buffer.concat(chunks)));
    req.on("error", rejectBody);
  });

const normalizeExtractedText = (text) => text.replace(/\s+/g, " ").trim();

const extractPdfText = async (buffer) => {
  const document = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const rows = new Map();
    const rawItems = [];

    content.items.forEach((item) => {
      if (!("str" in item) || !item.str.trim()) return;
      rawItems.push(item.str);
      const transform = "transform" in item ? item.transform : undefined;
      const y = Array.isArray(transform) && typeof transform[5] === "number" ? Math.round(transform[5] / 4) * 4 : 0;
      rows.set(y, [...(rows.get(y) || []), item.str]);
    });

    const structuredText = [...rows.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, row]) => row.join(" ").replace(/\s+/g, " ").trim())
      .join("\n");
    const rawText = rawItems.join(" ").replace(/\s+/g, " ").trim();
    pages.push(normalizeExtractedText(structuredText).length >= 30 ? structuredText : rawText);
  }

  await document.destroy();
  return pages.join("\n").trim();
};

const handleParseResume = async (req, res) => {
  try {
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "Use POST para enviar o currículo." });
      return;
    }

    const contentType = req.headers["content-type"] || "";
    const fileName = decodeURIComponent(String(req.headers["x-file-name"] || "curriculo.pdf"));

    if (!contentType.includes("pdf") && !fileName.toLowerCase().endsWith(".pdf")) {
      sendJson(res, 415, { error: "No momento, a extração no servidor aceita PDF." });
      return;
    }

    const body = await readRequestBody(req);
    if (!body.length) {
      sendJson(res, 400, { error: "Arquivo vazio." });
      return;
    }

    const text = await extractPdfText(body);
    if (!text) {
      sendJson(res, 422, { error: "Não encontrei texto selecionável nesse PDF. Se for imagem/scan, envie DOCX/TXT ou cole o texto." });
      return;
    }

    sendJson(res, 200, { text, chars: text.length });
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : "Não foi possível extrair o PDF no servidor." });
  }
};

const navigationNoise =
  /(mostre mais|mostre menos|locais próximos|outros empregos perto|indústria|registrar currículo|empregadores|publicar emprego|whatjobs menu|sobre nós|internacional|contatar|para candidatos|para empresas|termos|política de cookies|política de privacidade|login de afiliado|multiposting|helpful resources|search close|location_on|shopping_cart|local_hospital|gavel gerenciamento)/i;

const cleanExtractedText = (text) =>
  text
    .split(/\n|•|- /)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.length <= 240)
    .filter((line) => line.split(/\s+/).length <= 34)
    .filter((line) => !navigationNoise.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const cleanHtml = (html) => {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, "\n")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "\n")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "\n")
    .replace(/<(br|p|li|ul|ol|section|article|h[1-6]|div)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { title, text: cleanExtractedText(text) };
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
  if (req.url?.startsWith("/api/parse-resume")) {
    void handleParseResume(req, res);
    return;
  }

  if (req.url?.startsWith("/api/job-from-url")) {
    void handleJobFromUrl(req, res);
    return;
  }

  void serveStatic(req, res);
}).listen(port, () => {
  console.log(`AnaliseCV IA running on port ${port}`);
});
