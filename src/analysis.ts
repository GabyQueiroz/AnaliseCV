export type AtsEngine = {
  name: string;
  profile: string;
  focus: string[];
  score: number;
  risks: string[];
  wins: string[];
  detected?: boolean;
  region?: string;
};

export type AnalysisResult = {
  overallScore: number;
  passProbability: "Alta" | "Media" | "Baixa";
  atsPrediction: AtsPrediction;
  atsEngines: AtsEngine[];
  hardSkills: string[];
  softSignals: string[];
  missingCritical: string[];
  weakTerms: string[];
  matchedKeywords: string[];
  formatIssues: string[];
  rewriteBullets: string[];
  structureRecommendations: string[];
  blockerIssues: string[];
  linkedinSuggestions: LinkedInSuggestion[];
  optimizedResume: string;
  recruiterSummary: string;
  integrityWarnings: string[];
};

export type AtsPrediction = {
  name: string;
  confidence: "Alta" | "Media" | "Baixa";
  source: string;
  evidence: string[];
  recommendation: string;
};

export type LinkedInSuggestion = {
  title: string;
  reason: string;
  url: string;
};

const STOPWORDS = new Set([
  "a",
  "o",
  "os",
  "as",
  "um",
  "uma",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "em",
  "no",
  "na",
  "nos",
  "nas",
  "para",
  "por",
  "com",
  "sem",
  "e",
  "ou",
  "que",
  "como",
  "ao",
  "aos",
  "ser",
  "ter",
  "mais",
  "menos",
  "the",
  "and",
  "for",
  "with",
  "from",
  "this",
  "that",
  "you",
  "your",
  "our",
  "will",
  "are",
  "is",
  "to",
  "of",
  "in",
  "on",
  "at",
  "by",
  "or",
  "an",
  "be",
  "we",
]);

const TECH_TERMS = [
  "python",
  "java",
  "javascript",
  "typescript",
  "react",
  "node",
  "sql",
  "postgresql",
  "mysql",
  "mongodb",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "linux",
  "excel",
  "power bi",
  "tableau",
  "salesforce",
  "sap",
  "totvs",
  "erp",
  "crm",
  "scrum",
  "kanban",
  "agile",
  "machine learning",
  "inteligencia artificial",
  "ia",
  "api",
  "rest",
  "graphql",
  "etl",
  "data",
  "analytics",
  "seo",
  "sem",
  "google ads",
  "meta ads",
  "figma",
  "photoshop",
  "autocad",
  "solidworks",
  "customer success",
  "inside sales",
  "b2b",
  "b2c",
  "lgpd",
  "compliance",
];

const SECTION_HINTS = [
  "resumo",
  "objetivo",
  "experiencia",
  "experiencia profissional",
  "formacao",
  "educacao",
  "habilidades",
  "competencias",
  "certificacoes",
  "projetos",
  "idiomas",
];

const ACTION_VERBS = [
  "liderei",
  "desenvolvi",
  "implementei",
  "automatizei",
  "reduzi",
  "aumentei",
  "otimizei",
  "analisei",
  "coordenei",
  "entreguei",
  "estruturei",
  "criei",
  "melhorei",
  "negociei",
  "gerenciei",
  "monitorei",
  "designed",
  "built",
  "led",
  "improved",
  "reduced",
  "increased",
  "implemented",
];

const ROLE_RULES = [
  {
    title: "Analista de Dados",
    terms: ["sql", "power bi", "tableau", "excel", "etl", "analytics", "python", "dados", "indicadores"],
  },
  {
    title: "Analista de BI",
    terms: ["power bi", "tableau", "dashboard", "etl", "sql", "indicadores", "business intelligence"],
  },
  {
    title: "Desenvolvedor Front-end",
    terms: ["react", "javascript", "typescript", "figma", "html", "css", "frontend"],
  },
  {
    title: "Desenvolvedor Back-end",
    terms: ["node", "java", "python", "api", "rest", "sql", "docker", "backend"],
  },
  {
    title: "Analista de Marketing",
    terms: ["seo", "sem", "google ads", "meta ads", "crm", "analytics", "campanhas"],
  },
  {
    title: "Customer Success",
    terms: ["customer success", "crm", "atendimento", "b2b", "churn", "clientes", "sucesso do cliente"],
  },
  {
    title: "Analista Administrativo",
    terms: ["excel", "erp", "sap", "totvs", "relatorios", "processos", "administrativo"],
  },
  {
    title: "Analista de RH",
    terms: ["recrutamento", "selecao", "treinamento", "people", "rh", "talentos"],
  },
];

const ATS_SIGNATURES = [
  {
    name: "Workday + HiredScore/Paradox",
    patterns: ["myworkdayjobs.com", "workday.com", "wd1.myworkdaysite.com", "wd3.myworkdayjobs.com"],
    evidence: "link de candidatura em dominio Workday",
  },
  {
    name: "Greenhouse Real Talent",
    patterns: ["greenhouse.io", "boards.greenhouse.io", "job-boards.greenhouse.io"],
    evidence: "link de vaga em Greenhouse",
  },
  {
    name: "Lever / SmartRecruiters",
    patterns: ["lever.co", "jobs.lever.co"],
    evidence: "link de vaga em Lever",
  },
  {
    name: "Lever / SmartRecruiters",
    patterns: ["smartrecruiters.com", "jobs.smartrecruiters.com"],
    evidence: "link de vaga em SmartRecruiters",
  },
  {
    name: "iCIMS Talent Cloud",
    patterns: ["icims.com", "jobs.icims.com", "careers.icims.com"],
    evidence: "link de vaga em iCIMS",
  },
  {
    name: "Oracle Taleo",
    patterns: ["taleo.net", "oraclecloud.com/hcmui", "fa.ocs.oraclecloud.com"],
    evidence: "link de vaga em Taleo/Oracle Recruiting",
  },
  {
    name: "SAP SuccessFactors",
    patterns: ["successfactors.com", "sapsf.com", "career5.successfactors.eu", "career2.successfactors.eu"],
    evidence: "link de vaga em SAP SuccessFactors",
  },
  {
    name: "Gupy",
    patterns: ["gupy.io", "jobs.gupy.io", "portal.gupy.io"],
    evidence: "link de vaga em Gupy",
  },
  {
    name: "Kenoby / Gupy",
    patterns: ["kenoby.com"],
    evidence: "link de vaga em Kenoby",
  },
  {
    name: "Sólides",
    patterns: ["solides.jobs", "jobs.solides.com"],
    evidence: "link de vaga em Solides",
  },
  {
    name: "LinkedIn Easy Apply",
    patterns: ["linkedin.com/jobs", "linkedin.com/company"],
    evidence: "vaga aberta no LinkedIn",
  },
  {
    name: "Ashby",
    patterns: ["ashbyhq.com", "jobs.ashbyhq.com"],
    evidence: "link de vaga em Ashby",
  },
  {
    name: "Workable",
    patterns: ["workable.com", "apply.workable.com"],
    evidence: "link de vaga em Workable",
  },
  {
    name: "Teamtailor",
    patterns: ["teamtailor.com", "careers.teamtailor.com"],
    evidence: "link de vaga em Teamtailor",
  },
  {
    name: "Recruitee / Tellent",
    patterns: ["recruitee.com", "jobs.recruitee.com", "tellent.com"],
    evidence: "link de vaga em Recruitee/Tellent",
  },
  {
    name: "Personio Recruiting",
    patterns: ["personio.com", "jobs.personio.com"],
    evidence: "link de vaga em Personio",
  },
  {
    name: "Cegid Talentsoft",
    patterns: ["talent-soft.com", "talentsoft.com", "cegid.com"],
    evidence: "link de vaga em Cegid Talentsoft",
  },
  {
    name: "Flatchr",
    patterns: ["flatchr.io", "flatchr.com"],
    evidence: "link de vaga em Flatchr",
  },
  {
    name: "BambooHR",
    patterns: ["bamboohr.com", "applytojob.com"],
    evidence: "link de vaga em BambooHR",
  },
  {
    name: "Jobvite / Employ",
    patterns: ["jobvite.com", "jobs.jobvite.com", "employinc.com"],
    evidence: "link de vaga em Jobvite/Employ",
  },
  {
    name: "UKG Recruiting",
    patterns: ["ukg.com", "ultipro.com", "recruiting.ultipro.com"],
    evidence: "link de vaga em UKG/UltiPro",
  },
  {
    name: "ADP Recruiting",
    patterns: ["adp.com", "workforcenow.adp.com"],
    evidence: "link de vaga em ADP",
  },
  {
    name: "Dayforce",
    patterns: ["dayforcehcm.com", "ceridian.com"],
    evidence: "link de vaga em Dayforce/Ceridian",
  },
  {
    name: "Avature",
    patterns: ["avature.net", "avature.com"],
    evidence: "link de vaga em Avature",
  },
  {
    name: "Eightfold AI",
    patterns: ["eightfold.ai", "eightfold.com"],
    evidence: "link de vaga em Eightfold",
  },
  {
    name: "Phenom",
    patterns: ["phenompeople.com", "phenom.com"],
    evidence: "link de vaga em Phenom",
  },
];

const COMPANY_HINTS = [
  {
    name: "Workday + HiredScore/Paradox",
    terms: ["banco", "bank", "enterprise", "global", "multinacional", "industria", "varejo grande"],
    evidence: "empresas grandes tendem a usar ATS enterprise como Workday, SuccessFactors, Taleo ou iCIMS",
  },
  {
    name: "Greenhouse Real Talent",
    terms: ["startup", "fintech", "saas", "software", "tech", "produto digital"],
    evidence: "startups e empresas tech usam com frequencia Greenhouse, Lever ou SmartRecruiters",
  },
  {
    name: "Gupy",
    terms: ["brasil", "brasileira", "varejo", "estagio", "jovem aprendiz", "programa de talentos"],
    evidence: "empresas brasileiras e programas de alto volume frequentemente usam Gupy ou plataformas locais",
  },
];

type EngineDefinition = {
  name: string;
  profile: string;
  focus: string[];
  region: string;
  baseAdjust: number;
  formatAdjust: number;
  requirementAdjust: number;
};

const ENGINE_DEFINITIONS: EngineDefinition[] = [
  {
    name: "Workday + HiredScore/Paradox",
    profile: "Empresas globais e grandes corporações; parsing estruturado, requisitos e matching por habilidades.",
    focus: ["skills", "requisitos", "formato"],
    region: "Global / EUA / Europa",
    baseAdjust: 0,
    formatAdjust: 0.05,
    requirementAdjust: 0,
  },
  {
    name: "Greenhouse Real Talent",
    profile: "Startups, scale-ups e empresas tech; combina scorecards, histórico, palavras-chave e sinais de adequação.",
    focus: ["skills", "histórico", "scorecards"],
    region: "EUA / Europa",
    baseAdjust: 0.04,
    formatAdjust: 0,
    requirementAdjust: 0,
  },
  {
    name: "iCIMS Talent Cloud",
    profile: "Grandes operações de RH com CRM de talentos, automações, matching e alto volume.",
    focus: ["skills", "matching", "requisitos"],
    region: "EUA / Global",
    baseAdjust: 0,
    formatAdjust: 0,
    requirementAdjust: 0.03,
  },
  {
    name: "Oracle Taleo",
    profile: "ATS legado comum em grandes empresas; costuma valorizar palavras exatas e campos bem parseados.",
    focus: ["palavras exatas", "formato", "requisitos"],
    region: "Global / Enterprise",
    baseAdjust: -0.04,
    formatAdjust: 0.08,
    requirementAdjust: 0,
  },
  {
    name: "SAP SuccessFactors",
    profile: "Ambientes corporativos globais; extrai habilidades e compara com requisições de vaga.",
    focus: ["skills", "formato", "requisitos"],
    region: "Europa / Global",
    baseAdjust: 0.02,
    formatAdjust: 0,
    requirementAdjust: 0.02,
  },
  {
    name: "Lever / SmartRecruiters",
    profile: "Fluxos modernos de recruiting com busca, CRM, tags, automações e colaboração com hiring managers.",
    focus: ["skills", "histórico", "busca"],
    region: "EUA / Europa",
    baseAdjust: 0.05,
    formatAdjust: -0.02,
    requirementAdjust: 0,
  },
  {
    name: "Gupy",
    profile: "Muito usado no Brasil, especialmente alto volume, programas de talentos e vagas operacionais/corporativas.",
    focus: ["palavras exatas", "requisitos", "perguntas eliminatórias"],
    region: "Brasil",
    baseAdjust: -0.02,
    formatAdjust: 0.03,
    requirementAdjust: 0.01,
  },
  {
    name: "LinkedIn Easy Apply",
    profile: "Candidatura simplificada; recrutador cruza currículo, perfil LinkedIn e palavras de busca.",
    focus: ["perfil", "busca", "histórico"],
    region: "Global",
    baseAdjust: 0.03,
    formatAdjust: -0.04,
    requirementAdjust: -0.01,
  },
  {
    name: "Ashby",
    profile: "Muito usado por startups e scale-ups analíticas; forte em pipeline, scorecards e métricas de hiring.",
    focus: ["skills", "analytics", "scorecards"],
    region: "EUA / Europa",
    baseAdjust: 0.06,
    formatAdjust: -0.02,
    requirementAdjust: 0.01,
  },
  {
    name: "Workable",
    profile: "Usado por PMEs e empresas internacionais; valoriza descrição clara, keywords e histórico direto.",
    focus: ["keywords", "experiência", "formato"],
    region: "EUA / Europa / Portugal",
    baseAdjust: 0.03,
    formatAdjust: 0,
    requirementAdjust: 0,
  },
  {
    name: "Teamtailor",
    profile: "Popular na Europa e scale-ups; combina employer branding, pipeline e triagem colaborativa.",
    focus: ["perfil", "skills", "experiência"],
    region: "Europa / França / Portugal",
    baseAdjust: 0.03,
    formatAdjust: -0.01,
    requirementAdjust: 0,
  },
  {
    name: "Recruitee / Tellent",
    profile: "ATS europeu comum em PMEs e scale-ups; bom para busca por competências e colaboração do time.",
    focus: ["skills", "keywords", "histórico"],
    region: "Europa / Portugal / França",
    baseAdjust: 0.02,
    formatAdjust: -0.01,
    requirementAdjust: 0,
  },
  {
    name: "Personio Recruiting",
    profile: "Comum em PMEs europeias; ATS integrado a RH, com foco em dados estruturados e etapas do processo.",
    focus: ["formato", "requisitos", "experiência"],
    region: "Europa",
    baseAdjust: 0,
    formatAdjust: 0.02,
    requirementAdjust: 0.02,
  },
  {
    name: "Cegid Talentsoft",
    profile: "Plataforma europeia/francesa de gestão de talentos; forte em estrutura, requisitos e campos padronizados.",
    focus: ["formato", "requisitos", "skills"],
    region: "França / Europa",
    baseAdjust: -0.01,
    formatAdjust: 0.04,
    requirementAdjust: 0.03,
  },
  {
    name: "Flatchr",
    profile: "ATS francês voltado a PMEs; costuma depender de palavras-chave, clareza e aderência aos requisitos.",
    focus: ["keywords", "requisitos", "clareza"],
    region: "França",
    baseAdjust: 0.01,
    formatAdjust: 0.01,
    requirementAdjust: 0.02,
  },
  {
    name: "BambooHR",
    profile: "Muito usado por pequenas e médias empresas; triagem simples, dados claros e histórico objetivo contam bastante.",
    focus: ["formato", "histórico", "skills"],
    region: "EUA / Global SMB",
    baseAdjust: 0.01,
    formatAdjust: 0,
    requirementAdjust: 0,
  },
  {
    name: "Jobvite / Employ",
    profile: "Usado nos EUA em empresas mid-market; busca, CRM e automações valorizam palavras e evidências objetivas.",
    focus: ["keywords", "CRM", "experiência"],
    region: "EUA",
    baseAdjust: 0.02,
    formatAdjust: 0,
    requirementAdjust: 0.01,
  },
  {
    name: "UKG Recruiting",
    profile: "Comum em empresas com RH e folha integrados; parsing estruturado e requisitos eliminatórios pesam.",
    focus: ["requisitos", "formato", "compliance"],
    region: "EUA / Global",
    baseAdjust: -0.01,
    formatAdjust: 0.04,
    requirementAdjust: 0.03,
  },
  {
    name: "ADP Recruiting",
    profile: "HCM/ATS usado por empresas americanas; valoriza dados bem estruturados e compatibilidade com requisitos.",
    focus: ["formato", "requisitos", "histórico"],
    region: "EUA / Global",
    baseAdjust: 0,
    formatAdjust: 0.03,
    requirementAdjust: 0.02,
  },
  {
    name: "Dayforce",
    profile: "Plataforma HCM usada em organizações maiores; exige currículo limpo, requisitos claros e histórico parseável.",
    focus: ["formato", "requisitos", "skills"],
    region: "EUA / Canadá / Global",
    baseAdjust: -0.01,
    formatAdjust: 0.04,
    requirementAdjust: 0.02,
  },
  {
    name: "Avature",
    profile: "Muito usado em recrutamento corporativo e CRM de talentos; busca avançada e tags valorizam keywords fortes.",
    focus: ["CRM", "busca", "skills"],
    region: "Global Enterprise",
    baseAdjust: 0.04,
    formatAdjust: 0,
    requirementAdjust: 0,
  },
  {
    name: "Eightfold AI",
    profile: "Plataforma de talent intelligence; tende a comparar habilidades, trajetória e adjacência semântica.",
    focus: ["IA", "skills", "trajetória"],
    region: "EUA / Global",
    baseAdjust: 0.06,
    formatAdjust: -0.03,
    requirementAdjust: 0,
  },
  {
    name: "Phenom",
    profile: "Talent experience platform usada por grandes empresas; combina busca, matching e experiência do candidato.",
    focus: ["matching", "skills", "busca"],
    region: "EUA / Global",
    baseAdjust: 0.03,
    formatAdjust: 0,
    requirementAdjust: 0.01,
  },
];

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s.+#-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const uniq = <T,>(items: T[]) => [...new Set(items)];

const tokenize = (text: string) =>
  normalize(text)
    .split(" ")
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));

const phraseScore = (phrase: string, text: string) => {
  const normalizedPhrase = normalize(phrase);
  const normalizedText = normalize(text);
  if (normalizedText.includes(normalizedPhrase)) return 1;
  const words = normalizedPhrase.split(" ").filter(Boolean);
  if (words.length <= 1) return 0;
  return words.filter((word) => normalizedText.includes(word)).length / words.length;
};

const extractKeywords = (jobText: string) => {
  const normalizedJob = normalize(jobText);
  const tech = TECH_TERMS.filter((term) => normalizedJob.includes(normalize(term)));
  const frequencies = tokenize(jobText).reduce<Record<string, number>>((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  const frequent = Object.entries(frequencies)
    .filter(([word]) => !/^\d+$/.test(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 28)
    .map(([word]) => word);

  const multiWord = Array.from(jobText.matchAll(/\b[A-ZÁ-Ú][\wÁ-ú.+#-]*(?:\s+[A-ZÁ-Úa-zá-ú][\wÁ-ú.+#-]*){1,3}/g))
    .map(([match]) => match)
    .filter((term) => tokenize(term).length <= 4 && tokenize(term).length > 1)
    .slice(0, 18);

  return uniq([...tech, ...multiWord, ...frequent]).slice(0, 40);
};

const extractHardSkills = (resumeText: string, jobText: string) => {
  const combined = `${resumeText}\n${jobText}`;
  return uniq(TECH_TERMS.filter((term) => normalize(combined).includes(normalize(term)))).slice(0, 18);
};

const findRequirements = (jobText: string) => {
  const lines = jobText
    .split(/\n|•|- /)
    .map((line) => line.trim())
    .filter(Boolean);

  const strongSignals = lines.filter((line) =>
    /(obrigatorio|required|must|necessario|requisito|experiencia|conhecimento|dominio|fluente|superior|bacharel|certifica)/i.test(
      line,
    ),
  );

  return strongSignals.length ? strongSignals.slice(0, 14) : lines.slice(0, 10);
};

const getFormatIssues = (resumeText: string) => {
  const issues: string[] = [];
  const lines = resumeText.split("\n");
  const longLines = lines.filter((line) => line.length > 130).length;
  const hasSections = SECTION_HINTS.filter((section) => normalize(resumeText).includes(section)).length;
  const hasContact = /@|linkedin|github|\+\d{1,3}|\(\d{2}\)/i.test(resumeText);
  const hasTables = /\t{2,}|\|/.test(resumeText);
  const hasMetrics = /\d+%|\b\d+[xkKmM]?\b/.test(resumeText);

  if (!hasContact) issues.push("Contato pouco evidente para parsing automatico.");
  if (hasSections < 4) issues.push("Poucas secoes padronizadas; ATS antigos podem classificar dados no campo errado.");
  if (hasTables) issues.push("Possivel uso de tabela/colunas; Taleo e Workday tendem a sofrer mais com parsing irregular.");
  if (longLines > 4) issues.push("Linhas muito longas reduzem escaneabilidade para recrutador e parser.");
  if (!hasMetrics) issues.push("Poucas metricas/resultados numericos; matching humano e IA perdem evidencia de impacto.");
  return issues;
};

const getStructureRecommendations = (resumeText: string, jobText: string, missingCritical: string[]) => {
  const normalizedResume = normalize(resumeText);
  const recommendations: string[] = [];
  const sectionCount = SECTION_HINTS.filter((section) => normalizedResume.includes(section)).length;
  const hasObjective = normalizedResume.includes("objetivo");
  const hasSummary = normalizedResume.includes("resumo");
  const hasSkills = normalizedResume.includes("habilidades") || normalizedResume.includes("competencias");
  const hasExperience = normalizedResume.includes("experiencia");
  const hasEducation = normalizedResume.includes("formacao") || normalizedResume.includes("educacao");
  const jobTitle = jobText.match(/(?:vaga|cargo|position|role)\s*:?\s*([^\n]+)/i)?.[1]?.trim();

  if (hasObjective && !hasSummary) {
    recommendations.push("Substituir 'Objetivo' por 'Resumo profissional' com 3 linhas focadas no cargo-alvo.");
  }
  if (!hasSkills) {
    recommendations.push("Criar uma secao 'Competencias-chave' logo apos o resumo, com habilidades comprovadas e palavras da vaga.");
  }
  if (!hasExperience) {
    recommendations.push("Adicionar 'Experiencia profissional' com empresas, cargos, datas e entregas em bullets.");
  }
  if (!hasEducation) {
    recommendations.push("Adicionar 'Formacao' em formato simples: curso, instituicao e ano/status.");
  }
  if (sectionCount < 4) {
    recommendations.push("Usar uma estrutura ATS-friendly: Contato, Resumo, Competencias, Experiencia, Formacao, Certificacoes e Idiomas.");
  }
  if (missingCritical.length) {
    recommendations.push("Levar requisitos obrigatorios comprovados para o terco superior do curriculo, antes de experiencias menos relevantes.");
  }
  if (jobTitle) {
    recommendations.push(`Alinhar o titulo profissional ao cargo da vaga quando for verdadeiro: ${jobTitle}.`);
  }
  recommendations.push("Preferir uma coluna unica, fundo branco, texto selecionavel, sem foto, graficos, barras de habilidade ou tabelas complexas.");
  recommendations.push("Manter o curriculo em 1 a 2 paginas para mercado corporativo; Lattes completo deve virar uma versao profissional resumida.");

  return recommendations;
};

const getBlockerIssues = (resumeText: string, jobText: string, formatIssues: string[], missingCritical: string[]) => {
  const blockers: string[] = [];
  const normalizedResume = normalize(resumeText);
  const normalizedJob = normalize(jobText);

  if (!/@/.test(resumeText)) blockers.push("Pode enroscar: e-mail ausente ou dificil de identificar.");
  if (!/linkedin/i.test(resumeText)) blockers.push("Pode enroscar: LinkedIn ausente; recrutadores usam muito para validar trajetoria.");
  if (formatIssues.some((issue) => issue.includes("tabela"))) blockers.push("Pode enroscar: tabelas e colunas podem quebrar o parser do ATS.");
  if (missingCritical.length >= 4) blockers.push("Pode enroscar: muitos requisitos obrigatorios da vaga nao aparecem com evidencia clara.");
  if (!/\d+%|\b\d{2,}\b|R\$\s?\d+/i.test(resumeText)) blockers.push("Pode enroscar: pouca evidencia numerica de impacto, volume, prazo ou resultado.");
  if (normalizedResume.includes("curriculo lattes") || normalizedResume.includes("producao bibliografica")) {
    blockers.push("Pode enroscar: Lattes completo e academico demais para ATS corporativo; converta para resumo profissional.");
  }
  if (normalizedJob.includes("ingles") && !normalizedResume.includes("ingles")) {
    blockers.push("Pode enroscar: a vaga menciona ingles e o curriculo nao evidencia nivel do idioma.");
  }
  if (resumeText.length > 16000) {
    blockers.push("Pode enroscar: curriculo longo demais para triagem rapida; priorize a versao direcionada a vaga.");
  }

  return blockers.length ? blockers : ["Nenhum bloqueio grave detectado. O foco agora e aumentar clareza, evidencia e aderencia textual."];
};

const buildLinkedinSuggestions = (resumeText: string, jobText: string, hardSkills: string[], matchedKeywords: string[]) => {
  const combined = normalize(`${resumeText}\n${hardSkills.join(" ")}`);
  const ranked = ROLE_RULES.map((role) => {
    const hits = role.terms.filter((term) => combined.includes(normalize(term)));
    return { ...role, hits, score: hits.length };
  })
    .filter((role) => role.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const fallbackTitle =
    resumeText.match(/(?:cargo|objetivo|resumo)\s*:?\s*([^\n]+)/i)?.[1]?.trim() ||
    hardSkills.slice(0, 2).join(" ") ||
    "analista";

  const suggestions = ranked.length
    ? ranked
    : [
        {
          title: fallbackTitle,
          terms: hardSkills,
          hits: hardSkills.slice(0, 3),
          score: 1,
        },
      ];

  return suggestions.map((suggestion) => {
    const keywords = uniq([suggestion.title, ...suggestion.hits.slice(0, 3)]).join(" ");
    return {
      title: suggestion.title,
      reason: suggestion.hits.length
        ? `Compatibilidade pelo currículo: ${suggestion.hits.slice(0, 4).join(", ")}.`
        : "Sugestão baseada nos termos principais encontrados no currículo.",
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=Brasil`,
    };
  });
};

const detectAts = (companyName: string, jobText: string, jobUrl: string): AtsPrediction => {
  const urlSignal = normalize(jobUrl);
  const textSignal = normalize(jobText);
  const companySignal = normalize(companyName);
  const combined = `${urlSignal} ${textSignal}`;
  const exact = ATS_SIGNATURES.find((signature) => signature.patterns.some((pattern) => combined.includes(normalize(pattern))));

  if (exact) {
    return {
      name: exact.name,
      confidence: "Alta",
      source: jobUrl ? "Detectado pelo link da vaga" : "Detectado pelo texto da vaga",
      evidence: [exact.evidence, "A simulacao principal deve priorizar esse motor."],
      recommendation: "Use o card destacado como leitura principal; os outros cards continuam uteis como comparacao de risco.",
    };
  }

  const companyHint = COMPANY_HINTS.find((hint) => hint.terms.some((term) => companySignal.includes(normalize(term))));
  if (companyHint) {
    return {
      name: companyHint.name,
      confidence: "Media",
      source: "Estimado pelo perfil informado da empresa",
      evidence: [companyHint.evidence, "Sem link de candidatura, nao da para confirmar a plataforma com seguranca."],
      recommendation: "Cole o link real da vaga para aumentar a confianca da deteccao.",
    };
  }

  if (companyName.trim()) {
    return {
      name: "ATS nao identificado",
      confidence: "Baixa",
      source: "Empresa informada, mas sem assinatura tecnica",
      evidence: [`Empresa informada: ${companyName.trim()}`, "Nenhum dominio conhecido de ATS apareceu no link ou no texto."],
      recommendation: "Cole o link da vaga ou da pagina de candidatura. O dominio costuma revelar o ATS real.",
    };
  }

  return {
    name: "ATS nao identificado",
    confidence: "Baixa",
    source: "Sem empresa/link suficiente",
    evidence: ["Informe a empresa e, de preferencia, o link da vaga."],
    recommendation: "Enquanto nao houver deteccao, use a simulacao geral e corrija os riscos comuns de parsing, requisitos e palavras-chave.",
  };
};

const scoreForEngine = (
  name: string,
  profile: string,
  focus: string[],
  baseMatch: number,
  formatPenalty: number,
  requirementCoverage: number,
  metricDensity: number,
  region?: string,
): AtsEngine => {
  const focusBias = focus.reduce((acc, item) => acc + (item.includes("formato") ? -formatPenalty : 0), 0);
  const score = Math.max(
    8,
    Math.min(98, Math.round(baseMatch * 58 + requirementCoverage * 27 + metricDensity * 12 + 8 + focusBias)),
  );
  const risks: string[] = [];
  const wins: string[] = [];
  if (baseMatch < 0.55) risks.push("Baixa sobreposição de termos com a vaga.");
  else wins.push("Boa cobertura de linguagem da vaga.");
  if (requirementCoverage < 0.55) risks.push("Requisitos obrigatórios pouco comprovados.");
  else wins.push("Requisitos principais aparecem com evidência suficiente.");
  if (formatPenalty > 0.16 && focus.some((item) => item.includes("formato"))) risks.push("Risco de parsing por layout complexo.");
  if (metricDensity > 0.5) wins.push("Impacto quantificado ajuda ranking e leitura humana.");

  return { name, profile, focus, score, risks, wins, region };
};

const SECTION_MARKERS = [
  "dados pessoais",
  "objetivo",
  "objetivos",
  "resumo",
  "resumo profissional",
  "experiência profissional",
  "experiencia profissional",
  "experiência",
  "experiencia",
  "formação",
  "formacao",
  "escolaridade",
  "competências",
  "competencias",
  "habilidades",
  "cursos",
  "certificações",
  "certificacoes",
  "idiomas",
  "projetos",
];

const cleanResumeForCv = (text: string) => {
  let cleaned = text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();

  SECTION_MARKERS.forEach((marker) => {
    const pattern = new RegExp(`\\s+(${marker})\\b`, "gi");
    cleaned = cleaned.replace(pattern, "\n$1");
  });

  return cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
};

const titleCaseName = (value: string) =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => (["de", "da", "do", "das", "dos", "e"].includes(part) ? part : `${part[0].toUpperCase()}${part.slice(1)}`))
    .join(" ");

const extractCandidateName = (resumeText: string) => {
  const clean = cleanResumeForCv(resumeText);
  const nameBeforePersonalData = clean.match(
    /([A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-Za-zÀ-ÿ']+(?:[ \t]+(?:de|da|do|das|dos|e|[A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-Za-zÀ-ÿ']+)){1,6})(?=[ \t]+(?:Brasileir|Solteir|Casad|Dados pessoais|[A-Z0-9._%+-]+@))/,
  )?.[1];
  if (nameBeforePersonalData && !/todos|vaga|estado|cidade|modo/i.test(nameBeforePersonalData)) return titleCaseName(nameBeforePersonalData);

  const lines = clean.split("\n");
  const emailIndex = lines.findIndex((line) => /@/.test(line));
  const candidates = lines
    .slice(0, emailIndex >= 0 ? Math.max(emailIndex, 5) : 10)
    .flatMap((line) => line.split(/\s{2,}| Dados pessoais | Brasileira | Brasileiro | Solteira | Solteiro | Casada | Casado /i))
    .map((line) => line.trim())
    .filter((line) => line.length >= 8 && line.length <= 70)
    .filter((line) => !/@|http|www|linkedin|telefone|celular|rua|avenida|objetivo|modo de trabalho|área da vaga|area da vaga/i.test(line))
    .filter((line) => line.split(/\s+/).length >= 2 && /^[A-Za-zÀ-ÿ' ]+$/.test(line));

  return candidates[0] ? titleCaseName(candidates[0]) : "Nome do candidato";
};

const extractContact = (resumeText: string) => {
  const email = resumeText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const phone = resumeText.match(/(?:\+55\s*)?(?:\(?\d{2}\)?\s*)?\d{4,5}[-\s]?\d{4}/)?.[0];
  const linkedin = resumeText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s|,;]+/i)?.[0];
  const location = resumeText.match(/\b[A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-Za-zÀ-ÿ\s]+,\s*(?:PR|SP|RJ|MG|RS|SC|BA|PE|CE|DF|Portugal|França|Brasil)\b/)?.[0];

  return [location, email, phone, linkedin].filter(Boolean).join(" | ");
};

const extractLinesByKeywords = (lines: string[], keywords: RegExp, limit: number) =>
  lines
    .filter((line) => keywords.test(line))
    .filter((line) => !/@|linkedin|github|https?:\/\/|www\.|dados pessoais|rua |avenida /i.test(line))
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter((line, index, arr) => line.length > 4 && arr.indexOf(line) === index)
    .slice(0, limit);

const polishKeyword = (term: string) => {
  const normalizedTerm = normalize(term);
  if (normalizedTerm === "comunica" || normalizedTerm === "comunicacao") return "comunicação";
  if (normalizedTerm === "seguran" || normalizedTerm === "seguranca") return "segurança";
  if (normalizedTerm === "organiz" || normalizedTerm === "organizacao") return "organização";
  if (normalizedTerm === "experiencia") return "experiência";
  return term;
};

const buildOptimizedResume = (
  resumeText: string,
  jobText: string,
  matchedKeywords: string[],
  missingCritical: string[],
  hardSkills: string[],
) => {
  const lines = resumeText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const nameLine = lines.find((line) => line.length <= 80 && !/@|linkedin|github|http|\d{4,}/i.test(line)) || "Nome do candidato";
  const contactLines = lines.filter((line) => /@|linkedin|github|\+\d{1,3}|\(\d{2}\)|http/i.test(line)).slice(0, 3);
  const titleGuess =
    jobText.match(/(?:vaga|cargo|position|role)\s*:?\s*([^\n]+)/i)?.[1]?.trim() ||
    lines.find((line) => line.length < 80 && !line.includes("@") && line !== nameLine) ||
    "Profissional alinhado à vaga";

  const strongestTerms = uniq([...matchedKeywords, ...hardSkills]).slice(0, 12);
  const existingBullets = lines
    .filter((line) => /^[-•*]/.test(line) || ACTION_VERBS.some((verb) => normalize(line).startsWith(verb)))
    .slice(0, 10);
  const educationLines = lines
    .filter((line) => /gradua|bacharel|licenciatura|tecn[oó]logo|universidade|faculdade|formação|formacao|curso/i.test(line))
    .slice(0, 5);
  const projectLines = lines
    .filter((line) => /projeto|pesquisa|extensão|extensao|dashboard|sistema|relatório|relatorio/i.test(line))
    .slice(0, 5);
  const languageLines = lines.filter((line) => /ingl[eê]s|espanhol|franc[eê]s|idioma/i.test(line)).slice(0, 4);
  const certificationLines = lines.filter((line) => /certifica|aws|azure|google|scrum|power bi/i.test(line)).slice(0, 5);

  const bullets = existingBullets.length
    ? existingBullets.map((line) => line.replace(/^[-•*]\s*/, "- "))
    : [
        "- Descreva uma entrega real com verbo de ação, contexto, ferramenta/método e resultado mensurável.",
        "- Inclua evidências específicas apenas quando elas existirem no currículo original.",
      ];

  return [
    nameLine.toUpperCase(),
    contactLines.join(" | "),
    "",
    titleGuess.toUpperCase(),
    "",
    "RESUMO PROFISSIONAL",
    `Profissional com experiência relacionada a ${strongestTerms.slice(0, 6).join(", ") || "requisitos centrais da vaga"}. Perfil reorganizado para evidenciar aderência à vaga, resultados comprováveis e competências presentes no currículo original, sem adicionar informações não verificadas.`,
    "",
    "COMPETÊNCIAS-CHAVE",
    strongestTerms.map((term) => `- ${term}`).join("\n") || "- Ajustar com habilidades comprovadas no currículo original.",
    "",
    "EXPERIÊNCIA PROFISSIONAL",
    bullets.join("\n"),
    "",
    educationLines.length ? "FORMAÇÃO" : "",
    educationLines.map((line) => `- ${line.replace(/^[-•*]\s*/, "")}`).join("\n"),
    "",
    projectLines.length ? "PROJETOS RELEVANTES" : "",
    projectLines.map((line) => `- ${line.replace(/^[-•*]\s*/, "")}`).join("\n"),
    "",
    certificationLines.length ? "CERTIFICAÇÕES E CURSOS" : "",
    certificationLines.map((line) => `- ${line.replace(/^[-•*]\s*/, "")}`).join("\n"),
    "",
    languageLines.length ? "IDIOMAS" : "",
    languageLines.map((line) => `- ${line.replace(/^[-•*]\s*/, "")}`).join("\n"),
  ]
    .filter((line) => line !== "")
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
};

const buildProfessionalResume = (
  resumeText: string,
  jobText: string,
  matchedKeywords: string[],
  hardSkills: string[],
) => {
  const cleanedResume = cleanResumeForCv(resumeText);
  const lines = cleanedResume.split("\n").map((line) => line.trim()).filter(Boolean);
  const name = extractCandidateName(cleanedResume);
  const contact = extractContact(cleanedResume);
  const title =
    jobText.match(/(?:vaga|cargo|position|role)\s*:?\s*([^\n]+)/i)?.[1]?.trim() ||
    "Profissional alinhado à vaga";
  const strongestTerms = uniq([...matchedKeywords, ...hardSkills].map(polishKeyword)).slice(0, 10);
  const educationLines = extractLinesByKeywords(
    lines,
    /gradua|bacharel|licenciatura|tecn[oó]logo|universidade|faculdade|utfpr|formação|formacao|ensino médio|ensino medio/i,
    4,
  );
  const experienceLines = lines
    .filter((line) => /^[-•*]/.test(line) || /^[-â€¢*]/.test(line) || ACTION_VERBS.some((verb) => normalize(line).startsWith(verb)))
    .map((line) => line.replace(/^[-•*]\s*/, "").replace(/^[-â€¢*]\s*/, "").trim())
    .filter((line, index, arr) => line.length >= 18 && line.length <= 180 && arr.indexOf(line) === index)
    .slice(0, 8);
  const projectLines = extractLinesByKeywords(lines, /projeto|pesquisa|extensão|extensao|dashboard|sistema|relatório|relatorio|aplicativo/i, 4);
  const certificationLines = extractLinesByKeywords(lines, /certifica|curso livre|capacitação|capacitacao|treinamento|formação complementar/i, 4);
  const languageLines = extractLinesByKeywords(lines, /ingl[eê]s|espanhol|franc[eê]s|idioma/i, 3);

  const experience =
    experienceLines.length > 0
      ? experienceLines.map((line) => `- ${line}`)
      : [
          "- Descreva uma entrega real com verbo de ação, contexto, ferramenta/método e resultado mensurável.",
          "- Inclua evidências específicas apenas quando elas existirem no currículo original.",
        ];

  return [
    name.toUpperCase(),
    contact,
    "",
    title.toUpperCase(),
    "",
    "RESUMO PROFISSIONAL",
    `Profissional com experiência relacionada a ${strongestTerms.slice(0, 6).join(", ") || "requisitos centrais da vaga"}. Currículo reorganizado para evidenciar aderência à vaga, resultados comprováveis e competências presentes no histórico original, sem adicionar informações não verificadas.`,
    "",
    "COMPETÊNCIAS-CHAVE",
    strongestTerms.map((term) => `- ${term}`).join("\n") || "- Ajustar com habilidades comprovadas no currículo original.",
    "",
    "EXPERIÊNCIA PROFISSIONAL",
    experience.join("\n"),
    "",
    educationLines.length ? "FORMAÇÃO" : "",
    educationLines.map((line) => `- ${line}`).join("\n"),
    "",
    projectLines.length ? "PROJETOS RELEVANTES" : "",
    projectLines.map((line) => `- ${line}`).join("\n"),
    "",
    certificationLines.length ? "CERTIFICAÇÕES E CURSOS" : "",
    certificationLines.map((line) => `- ${line}`).join("\n"),
    "",
    languageLines.length ? "IDIOMAS" : "",
    languageLines.map((line) => `- ${line}`).join("\n"),
  ]
    .filter((line) => line !== "")
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
};

export function analyzeResume(resumeText: string, jobText: string, companyName = "", jobUrl = ""): AnalysisResult {
  const keywords = extractKeywords(jobText);
  const matchedKeywords = keywords.filter((keyword) => phraseScore(keyword, resumeText) >= 0.68);
  const missingKeywords = keywords.filter((keyword) => !matchedKeywords.includes(keyword));
  const requirements = findRequirements(jobText);
  const coveredRequirements = requirements.filter((req) => phraseScore(req, resumeText) >= 0.42);
  const hardSkills = extractHardSkills(resumeText, jobText);
  const formatIssues = getFormatIssues(resumeText);
  const metricMatches = resumeText.match(/\d+%|\b\d{2,}\b|R\$\s?\d+/g) || [];
  const metricDensity = Math.min(1, metricMatches.length / 8);
  const baseMatch = keywords.length ? matchedKeywords.length / keywords.length : 0;
  const requirementCoverage = requirements.length ? coveredRequirements.length / requirements.length : 0.35;
  const formatPenalty = Math.min(0.32, formatIssues.length * 0.07);
  const overallScore = Math.max(
    5,
    Math.min(98, Math.round(baseMatch * 46 + requirementCoverage * 32 + metricDensity * 12 + 14 - formatPenalty * 35)),
  );

  const atsPrediction = detectAts(companyName, jobText, jobUrl);
  const atsEngines = ENGINE_DEFINITIONS.map((engine) =>
    scoreForEngine(
      engine.name,
      engine.profile,
      engine.focus,
      baseMatch + engine.baseAdjust,
      formatPenalty + engine.formatAdjust,
      requirementCoverage + engine.requirementAdjust,
      metricDensity,
      engine.region,
    ),
  );
  const detectedEngine = atsEngines.find((engine) => engine.name === atsPrediction.name);
  if (detectedEngine) detectedEngine.detected = true;
  const orderedAtsEngines = [...atsEngines].sort((a, b) => {
    if (a.detected) return -1;
    if (b.detected) return 1;
    return b.score - a.score;
  });

  const weakTerms = missingKeywords.slice(0, 12);
  const missingCritical = requirements
    .filter((req) => !coveredRequirements.includes(req))
    .slice(0, 8);
  const structureRecommendations = getStructureRecommendations(resumeText, jobText, missingCritical);
  const blockerIssues = getBlockerIssues(resumeText, jobText, formatIssues, missingCritical);
  const softSignals = uniq(
    ["lideranca", "comunicacao", "analise", "gestao", "colaboracao", "autonomia", "negociacao", "atendimento"].filter(
      (term) => normalize(jobText).includes(term) || normalize(resumeText).includes(term),
    ),
  );
  const passProbability = overallScore >= 76 ? "Alta" : overallScore >= 55 ? "Media" : "Baixa";

  const rewriteBullets = [
    "Trocar objetivo generico por resumo de 3 linhas com cargo-alvo, senioridade, setor e habilidades da vaga que ja aparecem no curriculo.",
    "Criar secao Competencias-chave com termos exatos da vaga apenas quando forem verdadeiros.",
    "Reescrever experiencias no padrao: acao + contexto + ferramenta/metodo + resultado mensuravel.",
    "Mover requisitos obrigatorios comprovados para o terco superior do curriculo.",
    "Remover ou encurtar informacoes sem relacao direta com a vaga para aumentar densidade de sinal.",
  ];

  const integrityWarnings = [
    "Nao adicione ferramenta, certificacao, idioma, senioridade ou resultado que nao exista na sua experiencia.",
    "Quando faltar requisito, use formulacoes honestas como 'exposicao a', 'conhecimento pratico em' ou deixe como plano de desenvolvimento.",
    "Curriculo otimizado aumenta leitura e recuperacao por busca, mas nenhuma ferramenta consegue garantir aprovacao automatica.",
  ];

  return {
    overallScore,
    passProbability,
    atsPrediction,
    atsEngines: orderedAtsEngines,
    hardSkills,
    softSignals,
    missingCritical,
    weakTerms,
    matchedKeywords: matchedKeywords.slice(0, 18),
    formatIssues,
    rewriteBullets,
    structureRecommendations,
    blockerIssues,
    linkedinSuggestions: buildLinkedinSuggestions(resumeText, jobText, hardSkills, matchedKeywords),
    optimizedResume: buildProfessionalResume(resumeText, jobText, matchedKeywords, hardSkills),
    recruiterSummary:
      overallScore >= 76
        ? "O curriculo tem boa aderencia inicial. O ganho principal agora esta em evidenciar impacto e manter linguagem igual a vaga."
        : overallScore >= 55
          ? "O curriculo tem base aproveitavel, mas alguns requisitos e termos centrais precisam subir para o topo e aparecer com prova concreta."
          : "O curriculo provavelmente seria fraco em filtros e busca. E preciso reposicionar resumo, habilidades e experiencias antes de aplicar.",
    integrityWarnings,
  };
}
