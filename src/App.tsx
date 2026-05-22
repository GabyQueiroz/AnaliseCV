import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  Brain,
  Building2,
  CheckCircle2,
  Clipboard,
  Download,
  ExternalLink,
  FileSearch,
  FileText,
  Gauge,
  LayoutList,
  Link,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { jsPDF } from "jspdf";
import * as mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { analyzeResume, type AnalysisResult } from "./analysis";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

type InputMode = "upload" | "paste";
type JobMode = "description" | "link";

const jobPlaceholder = `Exemplo de descrição:

Cargo: Analista de Dados Pleno

Responsabilidades:
- Criar dashboards executivos em Power BI
- Construir consultas SQL para análise de bases comerciais
- Automatizar rotinas de relatórios e indicadores
- Trabalhar com times de vendas, marketing e produto

Requisitos:
- Experiência com SQL, Power BI e Excel avançado
- Conhecimento de ETL e modelagem de dados
- Boa comunicação com áreas de negócio
- Diferencial: Python, CRM e indicadores SaaS`;

type JobUrlResponse = {
  title?: string;
  text?: string;
  url?: string;
  error?: string;
};

const parseJobResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as JobUrlResponse;
  }

  const raw = await response.text();
  return {
    error: response.ok
      ? "A resposta da extração não veio em JSON."
      : `A rota de extração respondeu ${response.status}: ${raw.slice(0, 90).trim() || response.statusText}`,
  };
};

const fetchJobViaReader = async (targetUrl: string): Promise<JobUrlResponse> => {
  const readerUrl = `https://r.jina.ai/${targetUrl}`;
  const response = await fetch(readerUrl, { headers: { accept: "text/plain" } });
  const text = await response.text();

  if (!response.ok) {
    return { error: `Leitor público respondeu ${response.status}.` };
  }

  const title = text.match(/^Title:\s*(.+)$/m)?.[1]?.trim();
  const navigationNoise =
    /(mostre mais|mostre menos|locais próximos|outros empregos perto|indústria|registrar currículo|empregadores|publicar emprego|whatjobs menu|sobre nós|internacional|contatar|para candidatos|para empresas|termos|política de cookies|política de privacidade|login de afiliado|multiposting|helpful resources|search close|location_on|shopping_cart|local_hospital|gavel gerenciamento)/i;
  const cleanedText = text
    .replace(/^Title:.*$/m, "")
    .replace(/^URL Source:.*$/m, "")
    .replace(/^Published Time:.*$/m, "")
    .replace(/^Warning:.*$/m, "")
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

  if (cleanedText.length < 80) {
    return { error: "O link abriu, mas não trouxe texto suficiente da vaga." };
  }

  return { title, text: cleanedText.slice(0, 18000), url: targetUrl };
};

const readTextFile = async (file: File) => file.text();

const decodeXmlValue = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const cleanHtmlText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

const cleanRtfText = (rtf: string) =>
  rtf
    .replace(/\\'[0-9a-fA-F]{2}/g, " ")
    .replace(/\\[a-zA-Z]+\d* ?/g, " ")
    .replace(/[{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const readLattesXml = async (file: File) => {
  const raw = await file.text();
  const xml = new DOMParser().parseFromString(raw, "application/xml");
  const parserError = xml.querySelector("parsererror");

  if (parserError) {
    throw new Error("Não consegui ler esse XML do Lattes. Exporte novamente ou use TXT/HTML.");
  }

  const getAttr = (selector: string, attr: string) => xml.querySelector(selector)?.getAttribute(attr) || "";
  const getMany = (selector: string, attrs: string[]) =>
    Array.from(xml.querySelectorAll(selector))
      .slice(0, 16)
      .map((node) =>
        attrs
          .map((attr) => node.getAttribute(attr))
          .filter(Boolean)
          .map((value) => decodeXmlValue(value || ""))
          .join(" - "),
      )
      .filter(Boolean);

  const name = getAttr("DADOS-GERAIS", "NOME-COMPLETO");
  const summary =
    getAttr("RESUMO-CV", "TEXTO-RESUMO-CV-RH") ||
    getAttr("RESUMO-CV", "TEXTO-RESUMO-CV-RH-EN") ||
    getAttr("DADOS-GERAIS", "RESUMO-CV");
  const education = getMany("GRADUACAO, MESTRADO, DOUTORADO, ESPECIALIZACAO, POS-DOUTORADO", [
    "NOME-CURSO",
    "NOME-INSTITUICAO",
    "ANO-DE-CONCLUSAO",
    "STATUS-DO-CURSO",
  ]);
  const experience = getMany("ATUACAO-PROFISSIONAL", ["NOME-INSTITUICAO", "ANO-INICIO", "ANO-FIM"]);
  const projects = getMany("PROJETO-DE-PESQUISA, PROJETO-DE-DESENVOLVIMENTO, PROJETO-DE-EXTENSAO", [
    "NOME-DO-PROJETO",
    "ANO-INICIO",
    "ANO-FIM",
  ]);
  const areas = getMany("AREA-DE-ATUACAO", ["NOME-DA-ESPECIALIDADE", "NOME-DA-SUB-AREA-DO-CONHECIMENTO", "NOME-DA-AREA-DO-CONHECIMENTO"]);
  const languages = getMany("IDIOMA", ["DESCRICAO-DO-IDIOMA", "PROFICIENCIA-DE-LEITURA", "PROFICIENCIA-DE-FALA"]);
  const productions = getMany("ARTIGO-PUBLICADO, TRABALHO-EM-EVENTOS, LIVRO-PUBLICADO-OU-ORGANIZADO", [
    "TITULO-DO-ARTIGO",
    "TITULO-DO-TRABALHO",
    "TITULO-DO-LIVRO",
    "ANO-DO-ARTIGO",
    "ANO-DO-TRABALHO",
    "ANO",
  ]);

  return [
    name,
    "",
    "RESUMO PROFISSIONAL EXTRAIDO DO LATTES",
    decodeXmlValue(summary),
    "",
    "FORMACAO",
    education.map((item) => `- ${item}`).join("\n"),
    "",
    "EXPERIENCIA / ATUACAO",
    experience.map((item) => `- ${item}`).join("\n"),
    "",
    "PROJETOS",
    projects.map((item) => `- ${item}`).join("\n"),
    "",
    "AREAS E COMPETENCIAS",
    areas.map((item) => `- ${item}`).join("\n"),
    "",
    "IDIOMAS",
    languages.map((item) => `- ${item}`).join("\n"),
    "",
    "PRODUCAO ACADEMICA RELEVANTE",
    productions.map((item) => `- ${item}`).join("\n"),
  ]
    .filter((section) => section !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const readDocxFile = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
};

const readPdfFile = async (file: File) => {
  if (file.size === 0) {
    throw new Error("Esse PDF está vazio, com 0 bytes. Exporte novamente do Lattes em XML/HTML/TXT ou envie outro arquivo.");
  }

  const buffer = await file.arrayBuffer();
  const document = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const rows = new Map<number, string[]>();

    content.items.forEach((item) => {
      if (!("str" in item) || !item.str.trim()) return;
      const transform = "transform" in item ? item.transform : undefined;
      const y = Array.isArray(transform) && typeof transform[5] === "number" ? Math.round(transform[5] / 4) * 4 : 0;
      rows.set(y, [...(rows.get(y) || []), item.str]);
    });

    pages.push(
      [...rows.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([, row]) => row.join(" ").replace(/\s+/g, " ").trim())
        .join("\n"),
    );
  }

  const text = pages.join("\n").trim();
  if (!text) {
    throw new Error("Não encontrei texto selecionável nesse PDF. Se veio do Lattes, prefira exportar XML/HTML/TXT.");
  }

  return text;
};

const parseFile = async (file: File) => {
  if (file.size === 0) {
    throw new Error("O arquivo está vazio, com 0 bytes. Exporte novamente ou selecione outro arquivo.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return readPdfFile(file);
  if (extension === "docx") return readDocxFile(file);
  if (extension === "xml") return readLattesXml(file);
  if (["html", "htm"].includes(extension || "")) return cleanHtmlText(await file.text());
  if (extension === "rtf") return cleanRtfText(await file.text());
  if (["txt", "md", "csv"].includes(extension || "")) return readTextFile(file);
  throw new Error("Formato não suportado. Use PDF, DOCX, TXT, XML, HTML ou RTF.");
};

const splitResumeSections = (text: string) => {
  const sectionNames = new Set([
    "RESUMO PROFISSIONAL",
    "COMPETÊNCIAS-CHAVE",
    "COMPETENCIAS-CHAVE",
    "EXPERIÊNCIA PROFISSIONAL",
    "EXPERIENCIA PROFISSIONAL",
    "FORMAÇÃO",
    "FORMACAO",
    "PROJETOS RELEVANTES",
    "CERTIFICAÇÕES E CURSOS",
    "CERTIFICACOES E CURSOS",
    "IDIOMAS",
  ]);
  ["COMPETÊNCIAS-CHAVE", "EXPERIÊNCIA PROFISSIONAL", "FORMAÇÃO", "CERTIFICAÇÕES E CURSOS"].forEach((heading) =>
    sectionNames.add(heading),
  );
  const normalizeHeading = (value: string) =>
    value
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const normalizedSectionNames = new Set([...sectionNames].map(normalizeHeading));
  const isSection = (value: string) => sectionNames.has(value.toUpperCase()) || normalizedSectionNames.has(normalizeHeading(value));
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const name = lines[0] || "Currículo";
  const contact = lines[1] && !isSection(lines[1]) ? lines[1] : "";
  const titleIndex = contact ? 2 : 1;
  const title = lines[titleIndex] && !isSection(lines[titleIndex]) ? lines[titleIndex] : "";
  const sections: Array<{ title: string; lines: string[] }> = [];
  let current: { title: string; lines: string[] } | null = null;

  lines.slice(title ? titleIndex + 1 : titleIndex).forEach((line) => {
    const upper = line.toUpperCase();
    if (isSection(line)) {
      current = { title: upper, lines: [] };
      sections.push(current);
      return;
    }
    if (current) current.lines.push(line);
  });

  return { name, contact, title, sections };
};

const downloadOptimizedPdf = (text: string) => {
  const resume = splitResumeSections(text);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 52;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  let y = 50;

  const addPageIfNeeded = (height = 22) => {
    if (y + height > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const writeWrapped = (value: string, options: { size?: number; bold?: boolean; indent?: number; gap?: number } = {}) => {
    const size = options.size || 10;
    const indent = options.indent || 0;
    const lines = doc.splitTextToSize(value, contentWidth - indent) as string[];
    doc.setFont("helvetica", options.bold ? "bold" : "normal");
    doc.setFontSize(size);
    lines.forEach((line) => {
      addPageIfNeeded(16);
      doc.text(line, margin + indent, y);
      y += options.gap || 13.5;
    });
  };

  doc.setTextColor("#111827");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(resume.name, margin, y);
  y += 18;

  if (resume.title) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor("#374151");
    doc.text(resume.title, margin, y);
    y += 15;
  }

  if (resume.contact) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor("#4b5563");
    const contactLines = doc.splitTextToSize(resume.contact, contentWidth) as string[];
    doc.text(contactLines, margin, y);
    y += contactLines.length * 12 + 8;
  }

  doc.setDrawColor("#111827");
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  resume.sections.forEach((section) => {
    if (!section.lines.length) return;
    addPageIfNeeded(34);
    doc.setTextColor("#111827");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(section.title, margin, y);
    y += 5;
    doc.setDrawColor("#d1d5db");
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 13;

    section.lines.forEach((line) => {
      const normalizedLine = line.replace(/^-\s*/, "");
      if (line.startsWith("-")) {
        addPageIfNeeded(18);
        doc.setFillColor("#111827");
        doc.circle(margin + 3, y - 4, 1.5, "F");
        doc.setTextColor("#111827");
        writeWrapped(normalizedLine, { indent: 14, size: 9.8, gap: 13.2 });
      } else {
        doc.setTextColor("#111827");
        writeWrapped(line, { size: 9.8, gap: 13.2 });
      }
    });

    y += 8;
  });

  doc.save("curriculo-otimizado-ats.pdf");
};

const scoreColor = (score: number) => {
  if (score >= 76) return "good";
  if (score >= 55) return "warn";
  return "bad";
};

function MetricCard({
  icon,
  label,
  value,
  detail,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "good" | "warn" | "bad";
}) {
  return (
    <section className={`metric ${tone}`}>
      <div className="metricIcon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </section>
  );
}

function TagList({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) return <p className="empty">{empty}</p>;
  return (
    <div className="tags">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function ResultPanel({ result }: { result: AnalysisResult }) {
  const bestEngine = [...result.atsEngines].sort((a, b) => b.score - a.score)[0];
  const weakestEngine = [...result.atsEngines].sort((a, b) => a.score - b.score)[0];

  return (
    <div className="results">
      <div className="metricsGrid">
        <MetricCard
          icon={<Gauge size={22} />}
          label="Score IA"
          value={`${result.overallScore}/100`}
          detail={`Probabilidade ${result.passProbability.toLowerCase()}`}
          tone={scoreColor(result.overallScore)}
        />
        <MetricCard
          icon={<CheckCircle2 size={22} />}
          label="Melhor ATS"
          value={bestEngine.name}
          detail={`${bestEngine.score}/100 na simulação`}
          tone="good"
        />
        <MetricCard
          icon={<AlertTriangle size={22} />}
          label="Maior risco"
          value={weakestEngine.name}
          detail={`${weakestEngine.score}/100 na simulação`}
          tone={scoreColor(weakestEngine.score)}
        />
      </div>

      <section className="insightBand">
        <div>
          <Brain size={24} />
          <h2>Diagnóstico principal</h2>
        </div>
        <p>{result.recruiterSummary}</p>
      </section>

      <div className="twoColumns">
        <section className="panel fitGood">
          <div className="sectionTitle">
            <CheckCircle2 size={20} />
            <h2>O que está bom para esta vaga</h2>
          </div>
          <ul className="cleanList">
            {result.fitStrengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="panel fitImprove">
          <div className="sectionTitle">
            <AlertTriangle size={20} />
            <h2>O que melhorar para esta vaga</h2>
          </div>
          <ul className="cleanList">
            {result.fitImprovements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className={`panel atsDetected confidence${result.atsPrediction.confidence}`}>
        <div className="sectionTitle sectionTitleSplit">
          <div>
            <Building2 size={20} />
            <h2>ATS provável desta empresa</h2>
          </div>
          <span>{result.atsPrediction.confidence}</span>
        </div>
        <strong>{result.atsPrediction.name}</strong>
        <p>{result.atsPrediction.source}</p>
        <ul className="cleanList">
          {result.atsPrediction.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{result.atsPrediction.recommendation}</p>
      </section>

      <section className="panel">
        <div className="sectionTitle">
          <FileSearch size={20} />
          <h2>Simulação por ATS</h2>
        </div>
        <div className="engineGrid">
          {result.atsEngines.map((engine) => (
            <article className="engine" key={engine.name}>
              <div className="engineHead">
                <strong>
                  {engine.name}
                  {engine.detected ? <em>Detectado</em> : null}
                </strong>
                <span className={scoreColor(engine.score)}>{engine.score}</span>
              </div>
              <p>{engine.profile}</p>
              {engine.region ? <p className="engineRegion">{engine.region}</p> : null}
              <div className="miniTags">
                {engine.focus.map((focus) => (
                  <span key={focus}>{focus}</span>
                ))}
              </div>
              <ul>
                {[...engine.wins, ...engine.risks].slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <div className="twoColumns">
        <section className="panel">
          <div className="sectionTitle">
            <Sparkles size={20} />
            <h2>Termos encontrados</h2>
          </div>
          <TagList items={result.matchedKeywords} empty="Nenhum termo forte da vaga foi encontrado no currículo." />
        </section>

        <section className="panel">
          <div className="sectionTitle">
            <AlertTriangle size={20} />
            <h2>Lacunas críticas</h2>
          </div>
          <ul className="cleanList">
            {(result.missingCritical.length ? result.missingCritical : ["Sem lacunas obrigatórias claras detectadas."]).map(
              (item) => (
                <li key={item}>{item}</li>
              ),
            )}
          </ul>
        </section>
      </div>

      <div className="twoColumns">
        <section className="panel">
          <div className="sectionTitle">
            <ShieldCheck size={20} />
            <h2>Otimizar</h2>
          </div>
          <ul className="cleanList">
            {result.rewriteBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="sectionTitle">
            <FileText size={20} />
            <h2>Problemas de parsing</h2>
          </div>
          <ul className="cleanList">
            {(result.formatIssues.length ? result.formatIssues : ["Estrutura textual parece boa para parsing inicial."]).map(
              (item) => (
                <li key={item}>{item}</li>
              ),
            )}
          </ul>
        </section>
      </div>

      <div className="twoColumns">
        <section className="panel riskPanel">
          <div className="sectionTitle">
            <AlertTriangle size={20} />
            <h2>O que pode enroscar</h2>
          </div>
          <ul className="cleanList">
            {result.blockerIssues.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="sectionTitle">
            <LayoutList size={20} />
            <h2>Estrutura e formato ideal</h2>
          </div>
          <ul className="cleanList">
            {result.structureRecommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="panel">
        <div className="sectionTitle">
          <BriefcaseBusiness size={20} />
          <h2>Vagas prováveis no LinkedIn</h2>
        </div>
        <div className="jobGrid">
          {result.linkedinSuggestions.map((suggestion) => (
            <a href={suggestion.url} target="_blank" rel="noreferrer" className="jobCard" key={suggestion.url}>
              <div className="jobCardHead">
                <strong>{suggestion.title}</strong>
                <b>{suggestion.fitScore}%</b>
              </div>
              <p>{suggestion.reason}</p>
              <span>
                Abrir busca <ExternalLink size={14} />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="panel resumePanel">
        <div className="sectionTitle sectionTitleSplit">
          <div>
            <Clipboard size={20} />
            <h2>Currículo sugerido</h2>
          </div>
          <button className="downloadButton" onClick={() => downloadOptimizedPdf(result.optimizedResume)}>
            <Download size={18} />
            Gerar PDF
          </button>
        </div>
        <textarea value={result.optimizedResume} readOnly />
      </section>

      <section className="panel">
        <div className="sectionTitle">
          <ShieldCheck size={20} />
          <h2>Guardrails éticos</h2>
        </div>
        <ul className="cleanList">
          {result.integrityWarnings.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState<InputMode>("upload");
  const [jobMode, setJobMode] = useState<JobMode>("description");
  const [resumeText, setResumeText] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [resolvedJobUrl, setResolvedJobUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [isFetchingJob, setIsFetchingJob] = useState(false);
  const [error, setError] = useState("");
  const [jobError, setJobError] = useState("");
  const [jobSource, setJobSource] = useState("");
  const canAnalyze = resumeText.trim().length > 120 && jobText.trim().length > 80;
  const result = useMemo(
    () => (canAnalyze ? analyzeResume(resumeText, jobText, companyName, resolvedJobUrl || jobUrl, searchLocation) : null),
    [canAnalyze, resumeText, jobText, companyName, resolvedJobUrl, jobUrl, searchLocation],
  );

  const handleFile = async (file?: File) => {
    if (!file) return;
    setIsReading(true);
    setError("");
    setFileName(file.name);
    try {
      const text = await parseFile(file);
      setResumeText(text);
      setMode("paste");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível ler o arquivo.");
    } finally {
      setIsReading(false);
    }
  };

  const fetchJobFromUrl = async () => {
    const trimmedUrl = jobUrl.trim();
    if (!trimmedUrl) {
      setJobError("Informe o link da vaga.");
      return;
    }

    setIsFetchingJob(true);
    setJobError("");
    setJobSource("");

    try {
      const response = await fetch(`/api/job-from-url?url=${encodeURIComponent(trimmedUrl)}`);
      let data = await parseJobResponse(response);

      if ((!response.ok || !data.text) && response.status === 404) {
        data = await fetchJobViaReader(trimmedUrl);
      }

      if (!data.text) {
        throw new Error(
          data.error ||
            "Não foi possível extrair a vaga desse link. Se a página exigir login ou bloquear leitores automáticos, cole a descrição no modo texto.",
        );
      }

      setJobText(data.text);
      setJobSource(data.title ? `${data.title} - ${data.url || trimmedUrl}` : data.url || trimmedUrl);
      setResolvedJobUrl(data.url || trimmedUrl);
      setJobMode("description");
    } catch (err) {
      setJobError(err instanceof Error ? err.message : "Não foi possível acessar a vaga.");
    } finally {
      setIsFetchingJob(false);
    }
  };

  return (
    <main>
      <header className="topbar">
        <div>
          <strong>AnáliseCV IA</strong>
          <span>Simulador ATS e reescrita honesta para vagas</span>
        </div>
        <div className="statusPill">
          <Brain size={16} />
          Multi-ATS
        </div>
      </header>

      <section className="hero">
        <div className="heroText">
          <span className="eyebrow">IA para currículos estratégicos</span>
          <h1>Descubra se seu currículo passaria pela triagem antes de se candidatar.</h1>
          <p>
            Cole a vaga, envie o currículo e receba uma análise inspirada nos principais ATS do mercado, com um novo
            texto reorganizado para destacar o que você realmente já tem.
          </p>
        </div>
        <div className="heroScore">
          <Gauge size={42} />
          <strong>{result ? `${result.overallScore}` : "--"}</strong>
          <span>score previsto</span>
        </div>
      </section>

      <section className="workspace">
        <div className="inputGrid">
          <section className="panel inputPanel">
            <div className="sectionTitle">
              <Upload size={20} />
              <h2>Currículo</h2>
            </div>
            <div className="segmented">
              <button className={mode === "upload" ? "active" : ""} onClick={() => setMode("upload")}>
                Upload
              </button>
              <button className={mode === "paste" ? "active" : ""} onClick={() => setMode("paste")}>
                Texto
              </button>
            </div>

            {mode === "upload" ? (
              <label className="dropzone">
                {isReading ? <Loader2 className="spin" size={28} /> : <Upload size={28} />}
                <strong>{fileName || "Enviar CV normal ou Lattes"}</strong>
                <span>PDF, DOCX, TXT, XML, HTML ou RTF. Lattes funciona melhor em XML.</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md,.csv,.xml,.html,.htm,.rtf"
                  onChange={(event) => void handleFile(event.target.files?.[0])}
                />
              </label>
            ) : (
              <textarea
                className="inputText"
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
                placeholder="Cole aqui o texto do currículo..."
              />
            )}
            {error ? <p className="error">{error}</p> : null}
          </section>

          <section className="panel inputPanel">
            <div className="sectionTitle">
              <FileText size={20} />
              <h2>Vaga desejada</h2>
            </div>
            <label className="companyField" htmlFor="companyName">
              <span>Empresa</span>
              <div>
                <Building2 size={18} />
                <input
                  id="companyName"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="Ex.: Nubank, Ambev, Hospital Albert Einstein..."
                />
              </div>
            </label>
            <label className="companyField" htmlFor="searchLocation">
              <span>Cidade ou país para vagas</span>
              <div>
                <MapPin size={18} />
                <input
                  id="searchLocation"
                  value={searchLocation}
                  onChange={(event) => setSearchLocation(event.target.value)}
                  placeholder="Ex.: Ponta Grossa, Portugal, França, Remote, Worldwide..."
                />
              </div>
            </label>
            <div className="segmented">
              <button className={jobMode === "description" ? "active" : ""} onClick={() => setJobMode("description")}>
                Descrição
              </button>
              <button className={jobMode === "link" ? "active" : ""} onClick={() => setJobMode("link")}>
                Link
              </button>
            </div>

            {jobMode === "link" ? (
              <div className="linkBox">
                <label htmlFor="jobUrl">Link da vaga</label>
                <div className="urlRow">
                  <div className="urlInput">
                    <Link size={18} />
                    <input
                      id="jobUrl"
                      value={jobUrl}
                      onChange={(event) => setJobUrl(event.target.value)}
                      placeholder="https://empresa.gupy.io/jobs/..."
                    />
                  </div>
                  <button onClick={() => void fetchJobFromUrl()} disabled={isFetchingJob}>
                    {isFetchingJob ? <Loader2 className="spin" size={18} /> : <Search size={18} />}
                    Buscar
                  </button>
                </div>
                <p>
                  Funciona melhor com páginas públicas. Se o site bloquear acesso automatizado, cole a descrição no modo
                  texto.
                </p>
                {jobError ? <p className="error">{jobError}</p> : null}
              </div>
            ) : (
              <>
                {jobSource ? <p className="sourceNote">Vaga importada de: {jobSource}</p> : null}
                <textarea
                  className="inputText"
                  value={jobText}
                  onChange={(event) => {
                    setJobText(event.target.value);
                    setJobSource("");
                    setResolvedJobUrl("");
                  }}
                  placeholder={jobPlaceholder}
                />
              </>
            )}
          </section>
        </div>

        {!result ? (
          <section className="emptyState">
            <Brain size={34} />
            <h2>Pronto para analisar</h2>
            <p>Adicione um currículo com pelo menos 120 caracteres e uma vaga com pelo menos 80 caracteres.</p>
          </section>
        ) : (
          <ResultPanel result={result} />
        )}
      </section>
    </main>
  );
}
