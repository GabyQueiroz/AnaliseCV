import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const cleanHtml = (html: string) => {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const navigationNoise =
    /(mostre mais|mostre menos|locais próximos|outros empregos perto|indústria|registrar currículo|empregadores|publicar emprego|whatjobs menu|sobre nós|internacional|contatar|para candidatos|para empresas|termos|política de cookies|política de privacidade|login de afiliado|multiposting|helpful resources|search close|location_on|shopping_cart|local_hospital|gavel gerenciamento)/i;
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
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .split(/\n|•|- /)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.length <= 240)
    .filter((line) => line.split(/\s+/).length <= 34)
    .filter((line) => !navigationNoise.test(line))
    .join("\n")
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
