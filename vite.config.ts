import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const cleanHtml = (html: string) => {
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
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();

  return { title, text };
};

const jobUrlPlugin = (): Plugin => ({
  name: "job-url-extractor",
  configureServer(server) {
    server.middlewares.use("/api/job-from-url", async (req, res) => {
      try {
        const requestUrl = new URL(req.url || "", "http://local-api");
        const target = requestUrl.searchParams.get("url");

        if (!target) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Link da vaga nao informado." }));
          return;
        }

        const parsed = new URL(target);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Use um link http ou https." }));
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
          res.statusCode = response.status;
          res.end(JSON.stringify({ error: `A pagina respondeu com status ${response.status}.` }));
          return;
        }

        const contentType = response.headers.get("content-type") || "";
        const raw = await response.text();
        const { title, text } = contentType.includes("html") ? cleanHtml(raw) : { title: parsed.hostname, text: raw };
        const clippedText = text.slice(0, 18000);

        if (clippedText.length < 80) {
          res.statusCode = 422;
          res.end(JSON.stringify({ error: "O link abriu, mas nao trouxe texto suficiente da vaga." }));
          return;
        }

        res.setHeader("content-type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ title, text: clippedText, url: response.url || parsed.toString() }));
      } catch (error) {
        res.statusCode = 500;
        res.setHeader("content-type", "application/json; charset=utf-8");
        res.end(
          JSON.stringify({
            error: error instanceof Error ? error.message : "Nao foi possivel buscar esse link.",
          }),
        );
      }
    });
  },
});

export default defineConfig({
  plugins: [react(), jobUrlPlugin()],
});
