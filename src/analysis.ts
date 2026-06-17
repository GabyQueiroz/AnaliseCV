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
  passProbability: "Alta" | "Média" | "Baixa";
  atsPrediction: AtsPrediction;
  atsEngines: AtsEngine[];
  fitStrengths: string[];
  fitImprovements: string[];
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
  confidence: "Alta" | "Média" | "Baixa";
  source: string;
  evidence: string[];
  recommendation: string;
};

export type LinkedInSuggestion = {
  title: string;
  reason: string;
  fitScore: number;
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
  "sobre",
  "vaga",
  "vagas",
  "estamos",
  "salario",
  "salário",
  "vale",
  "beneficio",
  "benefício",
  "beneficios",
  "benefícios",
  "transporte",
  "alimentacao",
  "alimentação",
  "curitiba",
  "presencial",
  "hibrido",
  "híbrido",
  "remoto",
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
    title: "Cientista de Dados Júnior",
    terms: ["python", "machine learning", "inteligencia artificial", "ia", "sql", "dados", "analytics", "estatistica", "modelo"],
  },
  {
    title: "Analista de Machine Learning",
    terms: ["machine learning", "python", "ia", "inteligencia artificial", "modelo", "dados", "tensorflow", "pytorch", "algoritmos"],
  },
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
    title: "Engenheiro Eletricista Júnior",
    terms: ["engenharia eletrica", "engenharia elétrica", "eletrica", "elétrica", "autocad", "power bi", "projetos", "manutencao", "energia"],
  },
  {
    title: "Assistente de Projetos",
    terms: ["projetos", "relatorios", "processos", "organizacao", "excel", "power bi", "documentacao", "indicadores"],
  },
  {
    title: "Pesquisador em Engenharia",
    terms: ["pesquisa", "engenharia", "doutorado", "mestrado", "artigo", "projeto", "analise", "dados"],
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
    evidence: "link de candidatura em domínio Workday",
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
    patterns: ["teamtailor.com", "careers.teamtailor.com", "jobs.teamtailor.com"],
    evidence: "link de vaga em Teamtailor",
  },
  {
    name: "Recruitee / Tellent",
    patterns: ["recruitee.com", "jobs.recruitee.com", "tellent.com", "careers.recruitee.com"],
    evidence: "link de vaga em Recruitee/Tellent",
  },
  {
    name: "Manatal",
    patterns: ["manatal.com", "jobs.manatal.com", "careers.manatal.com"],
    evidence: "link de vaga em Manatal",
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
  {
    name: "Oracle Taleo",
    patterns: ["brassring.com", "sjobs.brassring.com", "kenexa.com"],
    evidence: "link de vaga em IBM/Kenexa BrassRing, comum em grandes empresas globais",
  },
  {
    name: "Bullhorn",
    patterns: ["bullhornstaffing.com", "bullhorn.com"],
    evidence: "link de vaga em Bullhorn",
  },
  {
    name: "JazzHR",
    patterns: ["applytojob.com", "jazz.co", "jazzhr.com"],
    evidence: "link de vaga em JazzHR",
  },
  {
    name: "Breezy HR",
    patterns: ["breezy.hr"],
    evidence: "link de vaga em Breezy HR",
  },
  {
    name: "Comeet",
    patterns: ["comeet.com", "apply.comeet.com"],
    evidence: "link de vaga em Comeet",
  },
  {
    name: "Jobylon",
    patterns: ["jobylon.com"],
    evidence: "link de vaga em Jobylon",
  },
  {
    name: "Homerun",
    patterns: ["homerun.co"],
    evidence: "link de vaga em Homerun",
  },
  {
    name: "Rippling Recruiting",
    patterns: ["rippling.com/careers", "rippling-ats.com"],
    evidence: "link de vaga em Rippling Recruiting",
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
    name: "Manatal",
    profile: "ATS com CRM e recursos de IA usado por agências, consultorias e PMEs; busca por skills e histórico pesa bastante.",
    focus: ["skills", "keywords", "CRM"],
    region: "Global / APAC / Europa / EUA",
    baseAdjust: 0.03,
    formatAdjust: 0,
    requirementAdjust: 0.01,
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
  {
    name: "Bullhorn",
    profile: "Muito usado por agências e consultorias de recrutamento; busca por palavras-chave e histórico recente pesa bastante.",
    focus: ["keywords", "histórico", "recrutador"],
    region: "EUA / Reino Unido / Global",
    baseAdjust: 0.02,
    formatAdjust: 0,
    requirementAdjust: 0,
  },
  {
    name: "JazzHR",
    profile: "ATS de pequenas e médias empresas; currículos simples, cargos claros e skills fáceis de buscar performam melhor.",
    focus: ["clareza", "keywords", "formato"],
    region: "EUA / Global SMB",
    baseAdjust: 0.01,
    formatAdjust: 0.01,
    requirementAdjust: 0,
  },
  {
    name: "Breezy HR",
    profile: "Plataforma visual para PMEs e startups; matching depende bastante de título, skills e experiência escaneável.",
    focus: ["perfil", "skills", "experiência"],
    region: "EUA / Europa / Global",
    baseAdjust: 0.02,
    formatAdjust: -0.01,
    requirementAdjust: 0,
  },
  {
    name: "Comeet",
    profile: "Usado por empresas tech globais; colaboração do time e scorecards tornam evidências objetivas importantes.",
    focus: ["scorecards", "skills", "evidências"],
    region: "EUA / Israel / Europa",
    baseAdjust: 0.04,
    formatAdjust: -0.01,
    requirementAdjust: 0.01,
  },
  {
    name: "Jobylon",
    profile: "Presente na Europa, especialmente países nórdicos; clareza, idioma e aderência aos requisitos são sinais importantes.",
    focus: ["requisitos", "idioma", "experiência"],
    region: "Europa",
    baseAdjust: 0.01,
    formatAdjust: 0,
    requirementAdjust: 0.02,
  },
  {
    name: "Homerun",
    profile: "Comum em empresas criativas e PMEs europeias; recrutador avalia portfólio, clareza e motivação além do currículo.",
    focus: ["perfil", "portfólio", "clareza"],
    region: "Europa",
    baseAdjust: 0.01,
    formatAdjust: -0.01,
    requirementAdjust: 0,
  },
  {
    name: "Rippling Recruiting",
    profile: "ATS/HCM moderno usado por empresas em crescimento; dados estruturados e skills rastreáveis ajudam o matching.",
    focus: ["skills", "formato", "histórico"],
    region: "EUA / Global",
    baseAdjust: 0.03,
    formatAdjust: 0.01,
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

const containsNormalizedTerm = (text: string, term: string) => {
  const normalizedText = ` ${normalize(text)} `;
  const normalizedTerm = normalize(term);
  if (!normalizedTerm) return false;
  if (normalizedTerm.length <= 3) return new RegExp(`(^|\\s)${normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`).test(normalizedText);
  return normalizedText.includes(` ${normalizedTerm} `) || normalizedText.includes(normalizedTerm);
};

const phraseScore = (phrase: string, text: string) => {
  const normalizedPhrase = normalize(phrase);
  const normalizedText = normalize(text);
  if (normalizedText.includes(normalizedPhrase)) return 1;
  const words = normalizedPhrase.split(" ").filter(Boolean);
  if (words.length <= 1) return 0;
  return words.filter((word) => normalizedText.includes(word)).length / words.length;
};

const NAVIGATION_NOISE =
  /(mostre mais|mostre menos|locais proximos|outros empregos perto|industria work|registrar curriculo|empregadores|publicar emprego|whatjobs menu|sobre nos|internacional|contatar|para candidatos|para empresas|termos|politica de cookies|politica de privacidade|login de afiliado|multiposting|helpful resources|search close|location_on|administrativo eco|palette artes|shopping_cart|local_hospital|gavel gerenciamento)/;

const isUsefulJobLine = (line: string) => {
  const normalizedLine = normalize(line);
  const tokenCount = tokenize(line).length;

  if (line.length < 4 || line.length > 240) return false;
  if (tokenCount < 2 || tokenCount > 32) return false;
  if (NAVIGATION_NOISE.test(normalizedLine)) return false;
  if (/\b(em|de|da|do|para|com|por|no|na|e|ou)$/i.test(normalizedLine)) return false;
  if (/^(menu|sim|nao|não|buscar|search|close|login|cadastre-se|registrar|publicar|cookies?)$/i.test(line.trim())) return false;
  return true;
};

const isRequirementLike = (line: string) => {
  const normalizedLine = normalize(line);
  if (!isUsefulJobLine(line)) return false;
  if (/^(reconhecimento|portfolio|portifolio|beneficios?|localizacao|curitiba|salario|empresa|sobre nos)$/i.test(normalizedLine)) {
    return false;
  }
  if (
    /(obrigatorio|required|must|necessario|requisito|experiencia|ensino|conhecimento|dominio|fluente|superior|bacharel|certifica|atendimento|comunicacao|organizacao|disponibilidade|responsavel|atuar|desenvolver|criar|analisar|gerenciar|suporte|habilidade)/i.test(
      normalizedLine,
    )
  ) {
    return true;
  }
  return TECH_TERMS.some((term) => containsNormalizedTerm(line, term));
};

const getUsefulJobLines = (jobText: string) =>
  jobText
    .replace(/(Mostre mais|Mostre menos|Locais próximos|Outros empregos perto de mim|Indústria)/g, "\n$1")
    .replace(/(Responsabilidades|Requisitos|Qualificações|Benefícios|Sobre a vaga|Descrição da vaga|Atividades):/gi, "\n$1:")
    .split(/\n|•|- /)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter(isUsefulJobLine);

const getUsefulJobText = (jobText: string) => getUsefulJobLines(jobText).join("\n");

const isUsefulMissingTerm = (term: string) => {
  const normalizedTerm = normalize(term);
  if (normalizedTerm.length < 4) return false;
  if (/^\d+$/.test(normalizedTerm)) return false;
  if (STOPWORDS.has(normalizedTerm)) return false;
  if (
    /^(rest|data|vaga|sobre|estamos|cargo|contratando|ensino|medio|completo|salario|beneficios?|vale|transporte|alimentacao|curitiba|modelo|trabalho|requisitos?)$/.test(
      normalizedTerm,
    )
  ) {
    return false;
  }
  if (
    /(sobre a vaga|estamos|contratando|ensino medio|vale transporte|vale alimentacao|salario|beneficios?|cidade|localizacao|curitiba|\blocal\b|\bcargo\b)/.test(
      normalizedTerm,
    )
  ) {
    return false;
  }
  return true;
};

const requirementCoveredByResume = (requirement: string, resumeText: string) => {
  const req = normalize(requirement);
  const resume = normalize(resumeText);
  const hasHigherEducation = /(graduacao|bacharel|licenciatura|tecnologo|superior|pos graduacao|especializacao|mestrado|doutorado|phd|mba)/.test(resume);
  if (/ensino medio|ensino fundamental|2 grau|segundo grau/.test(req) && hasHigherEducation) return true;
  if (/superior|graduacao|bacharel|licenciatura|tecnologo/.test(req) && /(graduacao|bacharel|licenciatura|tecnologo|superior|pos graduacao|mestrado|doutorado|phd|mba)/.test(resume)) return true;
  if (/experiencia na funcao|experiencia na area|desejavel experiencia/.test(req) && /(experiencia|atuei|trabalhei|aprendiz|estagio|estagi|assistente|analista|projeto)/.test(resume)) return true;
  if (/ingles|english/.test(req) && /(ingles|english|toefl|ielts|intermediario|avancado|fluente)/.test(resume)) return true;
  return phraseScore(requirement, resumeText) >= 0.42;
};

const extractKeywords = (jobText: string) => {
  const usefulJobText = getUsefulJobText(jobText) || jobText;
  const normalizedJob = normalize(usefulJobText);
  const tech = TECH_TERMS.filter((term) => containsNormalizedTerm(usefulJobText, term));
  const frequencies = tokenize(usefulJobText).reduce<Record<string, number>>((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  const frequent = Object.entries(frequencies)
    .filter(([word]) => !/^\d+$/.test(word))
    .filter(([word]) => isUsefulMissingTerm(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 28)
    .map(([word]) => word);

  const multiWord = Array.from(usefulJobText.matchAll(/\b[A-ZÁ-Ú][\wÁ-ú.+#-]*(?:[ \t]+[A-ZÁ-Úa-zá-ú][\wÁ-ú.+#-]*){1,3}/g))
    .map(([match]) => match)
    .filter((term) => tokenize(term).length <= 4 && tokenize(term).length > 1)
    .filter((term) => isUsefulMissingTerm(term))
    .slice(0, 18);

  return uniq([...tech, ...multiWord, ...frequent]).slice(0, 40);
};

const extractHardSkills = (resumeText: string, jobText: string) => {
  const combined = `${resumeText}\n${jobText}`;
  return uniq(TECH_TERMS.filter((term) => containsNormalizedTerm(combined, term))).slice(0, 18);
};

const findRequirements = (jobText: string) => {
  const lines = getUsefulJobLines(jobText)
    .filter((line) => !/^(sobre a vaga|responsabilidades?|requisitos?|benef[ií]cios?)\s*:?\s*$/i.test(line))
    .filter((line) => !/^(cargo|local)\s*:/i.test(line));

  const strongSignals = lines.filter(isRequirementLike);

  return strongSignals.slice(0, 14);
};

const getFormatIssues = (resumeText: string) => {
  const issues: string[] = [];
  const lines = resumeText.split("\n");
  const longLines = lines.filter((line) => line.length > 130).length;
  const hasSections = SECTION_HINTS.filter((section) => normalize(resumeText).includes(section)).length;
  const hasContact = /@|linkedin|github|\+\d{1,3}|\(\d{2}\)/i.test(resumeText);
  const hasTables =
    /\t{2,}/.test(resumeText) ||
    lines.some((line) => !/@|linkedin|github|telefone|phone/i.test(line) && (line.match(/\|/g) || []).length >= 2);
  const hasMetrics = /\d+%|\b\d+[xkKmM]?\b/.test(resumeText);

  if (!hasContact) issues.push("Contato pouco evidente para parsing automático.");
  if (hasSections < 4) issues.push("Poucas seções padronizadas; ATS antigos podem classificar dados no campo errado.");
  if (hasTables) issues.push("Possível uso de tabela/colunas; Taleo e Workday tendem a sofrer mais com parsing irregular.");
  if (longLines > 4) issues.push("Linhas muito longas reduzem escaneabilidade para recrutador e parser.");
  if (!hasMetrics) issues.push("Poucas métricas/resultados numéricos; matching humano e IA perdem evidência de impacto.");
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
  const jobTitle = getUsefulJobLines(jobText)
    .map((line) => line.match(/(?:vaga|cargo|position|role)\s*:?\s*([^\n|]{4,90})/i)?.[1]?.trim() || "")
    .find((line) => line && isUsefulJobLine(line));

  if (hasObjective && !hasSummary) {
    recommendations.push("Substituir 'Objetivo' por 'Resumo profissional' com 3 linhas focadas no cargo-alvo.");
  }
  if (!hasSkills) {
    recommendations.push("Criar uma seção 'Competências-chave' logo após o resumo, com habilidades comprovadas e palavras da vaga.");
  }
  if (!hasExperience) {
    recommendations.push("Adicionar 'Experiencia profissional' com empresas, cargos, datas e entregas em bullets.");
  }
  if (!hasEducation) {
    recommendations.push("Adicionar 'Formação' em formato simples: curso, instituição e ano/status.");
  }
  if (sectionCount < 4) {
    recommendations.push("Usar uma estrutura ATS-friendly: Contato, Resumo, Competências, Experiência, Formação, Certificações e Idiomas.");
  }
  if (missingCritical.length) {
    recommendations.push("Levar requisitos obrigatórios comprovados para o terço superior do currículo, antes de experiências menos relevantes.");
  }
  if (jobTitle) {
    recommendations.push(`Alinhar o título profissional ao cargo da vaga quando for verdadeiro: ${jobTitle}.`);
  }
  recommendations.push("Preferir uma coluna única, fundo branco, texto selecionável, sem foto, gráficos, barras de habilidade ou tabelas complexas.");
  recommendations.push("Manter o currículo em 1 a 2 páginas para mercado corporativo; Lattes completo deve virar uma versão profissional resumida.");

  return recommendations;
};

const getBlockerIssues = (
  resumeText: string,
  jobText: string,
  formatIssues: string[],
  missingCritical: string[],
  overallScore: number,
  weakTerms: string[],
) => {
  const blockers: string[] = [];
  const normalizedResume = normalize(resumeText);
  const normalizedJob = normalize(jobText);

  if (!/@/.test(resumeText)) blockers.push("Pode enroscar: e-mail ausente ou difícil de identificar.");
  if (overallScore < 55 && missingCritical.length) {
    blockers.push(
      `Score baixo principalmente porque ${missingCritical.length} requisito(s) da vaga não aparecem com prova clara no currículo.`,
    );
  }
  if (overallScore < 65 && weakTerms.length) {
    blockers.push(`Termos relevantes da vaga ainda não aparecem no CV: ${weakTerms.slice(0, 5).map(polishKeyword).join(", ")}.`);
  }
  if (!/linkedin/i.test(resumeText) && blockers.length < 3) {
    blockers.push("LinkedIn ausente: não derruba sozinho, mas reduz validação rápida de trajetória e projetos.");
  }
  if (formatIssues.some((issue) => issue.includes("tabela"))) blockers.push("Pode enroscar: tabelas e colunas podem quebrar o parser do ATS.");
  if (missingCritical.length >= 4) blockers.push("Pode enroscar: muitos requisitos obrigatórios da vaga não aparecem com evidência clara.");
  if (!/\d+%|\b\d{2,}\b|R\$\s?\d+/i.test(resumeText)) blockers.push("Pode enroscar: pouca evidência numérica de impacto, volume, prazo ou resultado.");
  if (normalizedResume.includes("curriculo lattes") || normalizedResume.includes("producao bibliografica")) {
    blockers.push("Pode enroscar: Lattes completo e acadêmico demais para ATS corporativo; converta para resumo profissional.");
  }
  if (normalizedJob.includes("ingles") && !normalizedResume.includes("ingles")) {
    blockers.push("Pode enroscar: a vaga menciona inglês e o currículo não evidencia nível do idioma.");
  }
  if (resumeText.length > 16000) {
    blockers.push("Pode enroscar: currículo longo demais para triagem rápida; priorize a versão direcionada à vaga.");
  }

  return blockers.length ? blockers : ["Nenhum bloqueio grave detectado. O foco agora é aumentar clareza, evidência e aderência textual."];
};

const buildFitStrengths = (
  matchedKeywords: string[],
  hardSkills: string[],
  coveredRequirements: string[],
  metricDensity: number,
  formatIssues: string[],
) => {
  const strengths: string[] = [];
  if (matchedKeywords.length) {
    strengths.push(`O currículo já conversa com a vaga em termos como: ${matchedKeywords.slice(0, 6).map(polishKeyword).join(", ")}.`);
  }
  if (hardSkills.length) {
    strengths.push(`Há habilidades rastreáveis por ATS: ${hardSkills.slice(0, 6).map(polishKeyword).join(", ")}.`);
  }
  if (coveredRequirements.length) {
    strengths.push(`${coveredRequirements.length} requisito(s) da vaga aparecem com algum sinal no currículo.`);
  }
  if (metricDensity > 0.35) {
    strengths.push("Existem números/resultados no currículo, o que ajuda ranking e leitura humana.");
  }
  if (!formatIssues.length) {
    strengths.push("A estrutura textual parece amigável para parser: seções claras e pouco risco de layout.");
  }
  return strengths.length ? strengths : ["O currículo tem base aproveitável, mas precisa evidenciar melhor os sinais da vaga."];
};

const cleanRequirementLabel = (value: string) =>
  value
    .replace(/^\s*(requisitos?|requirements?|qualifica[cç][oõ]es?)\s*:?\s*/i, "")
    .replace(/\s+/g, " ")
    .replace(/\.$/, "")
    .trim();

const buildFitImprovements = (
  missingCritical: string[],
  weakTerms: string[],
  formatIssues: string[],
  resumeText: string,
  jobText: string,
) => {
  const improvements: string[] = [];
  if (missingCritical.length) {
    const readableCritical = missingCritical.map(cleanRequirementLabel).filter(isUsefulJobLine).slice(0, 3);
    improvements.push(
      readableCritical.length
        ? `Comprovar no currículo estes pontos da vaga que ainda não ficaram claros: ${readableCritical.join(" | ")}.`
        : "A descrição importada parece ter ruído de navegação. Revise a vaga em modo texto para deixar apenas cargo, atividades e requisitos.",
    );
  }
  if (weakTerms.length) {
    improvements.push(`Ajustar linguagem com termos úteis da vaga: ${weakTerms.slice(0, 6).map(polishKeyword).join(", ")}.`);
  }
  if (!/\d+%|\b\d{2,}\b|R\$\s?\d+/i.test(resumeText)) {
    improvements.push("Adicionar impacto mensurável real: volume, prazo, resultado, redução, aumento, número de pessoas ou projetos.");
  }
  if (formatIssues.length) {
    improvements.push(`Corrigir risco de ATS: ${formatIssues.slice(0, 2).join(" ")}`);
  }
  if (/ingl[eê]s|english/i.test(jobText) && !/ingl[eê]s|english/i.test(resumeText)) {
    improvements.push("A vaga menciona inglês; inclua o nível somente se isso for verdadeiro.");
  }
  if (/remoto|remote|híbrido|hybrid|presencial/i.test(jobText) && !/remoto|remote|híbrido|hybrid|presencial/i.test(resumeText)) {
    improvements.push("Se houver preferência/disponibilidade de modelo de trabalho, deixe claro no topo ou em informações adicionais.");
  }
  return improvements.length ? improvements : ["Melhorias principais: deixar o resumo mais direto, manter termos da vaga e priorizar evidências reais."];
};

const buildLinkedinSuggestions = (resumeText: string, hardSkills: string[], searchLocation: string) => {
  const resumeOnlySkills = uniq([
    ...TECH_TERMS.filter((term) => containsNormalizedTerm(resumeText, term)),
    ...hardSkills.filter((term) => containsNormalizedTerm(resumeText, term)),
  ]);
  const combined = normalize(`${resumeText}\n${resumeOnlySkills.join(" ")}`);
  const ranked = ROLE_RULES.map((role) => {
    const hits = role.terms.filter((term) => combined.includes(normalize(term)));
    const titleSignal = normalize(resumeText).includes(normalize(role.title.replace(/\s+j[uú]nior/i, ""))) ? 2 : 0;
    return { ...role, hits, score: hits.length + titleSignal };
  })
    .filter((role) => role.score >= 2 || role.hits.some((hit) => ["machine learning", "power bi", "sql", "python"].includes(normalize(hit))))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const fallbackTitle =
    resumeText.match(/(?:cargo|objetivo|resumo)\s*:?\s*([^\n]{6,70})/i)?.[1]?.trim() ||
    (resumeOnlySkills.length >= 2 ? `Analista de ${resumeOnlySkills.slice(0, 2).join(" e ")}` : "") ||
    "Vagas alinhadas ao currículo";

  const suggestions = ranked.length
    ? ranked
    : [
        {
          title: fallbackTitle,
          terms: resumeOnlySkills,
          hits: resumeOnlySkills.slice(0, 3),
          score: 1,
        },
      ];

  return suggestions.map((suggestion) => {
    const keywords = uniq([suggestion.title, ...suggestion.hits.slice(0, 3)]).join(" ");
    const location = searchLocation.trim() || "Worldwide";
    return {
      title: suggestion.title,
      reason: suggestion.hits.length
        ? `Compatibilidade pelo currículo: ${suggestion.hits.slice(0, 4).map(polishKeyword).join(", ")}.`
        : "Sugestão baseada nos termos principais encontrados no currículo.",
      fitScore: Math.min(96, Math.max(42, suggestion.score * 16 + resumeOnlySkills.length * 2)),
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}`,
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
      evidence: [exact.evidence, "A simulação principal deve priorizar esse motor."],
      recommendation: "Use o card destacado como leitura principal; os outros cards continuam úteis como comparação de risco.",
    };
  }

  const companyHint = COMPANY_HINTS.find((hint) => hint.terms.some((term) => companySignal.includes(normalize(term))));
  if (companyHint) {
    return {
      name: companyHint.name,
      confidence: "Média",
      source: "Estimado pelo perfil informado da empresa",
      evidence: [companyHint.evidence, "Sem link de candidatura, não dá para confirmar a plataforma com segurança."],
      recommendation: "Cole o link real da vaga para aumentar a confiança da detecção.",
    };
  }

  if (companyName.trim()) {
    return {
      name: "ATS não identificado",
      confidence: "Baixa",
      source: "Empresa informada, mas sem assinatura técnica",
      evidence: [`Empresa informada: ${companyName.trim()}`, "Nenhum domínio conhecido de ATS apareceu no link ou no texto."],
      recommendation: "Cole o link da vaga ou da página de candidatura. O domínio costuma revelar o ATS real.",
    };
  }

  return {
    name: "ATS não identificado",
    confidence: "Baixa",
    source: "Sem empresa/link suficiente",
    evidence: ["Informe a empresa e, de preferência, o link da vaga."],
    recommendation: "Enquanto não houver detecção, use a simulação geral e corrija os riscos comuns de parsing, requisitos e palavras-chave.",
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

export function analyzeResume(resumeText: string, jobText: string, companyName = "", jobUrl = "", searchLocation = ""): AnalysisResult {
  const keywords = extractKeywords(jobText);
  const matchedKeywords = keywords.filter((keyword) => phraseScore(keyword, resumeText) >= 0.68);
  const missingKeywords = keywords.filter((keyword) => !matchedKeywords.includes(keyword));
  const requirements = findRequirements(jobText);
  const coveredRequirements = requirements.filter((req) => requirementCoveredByResume(req, resumeText));
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

  const weakTerms = missingKeywords
    .filter(isUsefulMissingTerm)
    .filter((term) => !requirementCoveredByResume(term, resumeText))
    .slice(0, 12);
  const missingCritical = requirements
    .filter((req) => !coveredRequirements.includes(req))
    .filter(isUsefulJobLine)
    .slice(0, 8);
  const structureRecommendations = getStructureRecommendations(resumeText, jobText, missingCritical);
  const blockerIssues = getBlockerIssues(resumeText, jobText, formatIssues, missingCritical, overallScore, weakTerms);
  const softSignals = uniq(
    ["lideranca", "comunicacao", "analise", "gestao", "colaboracao", "autonomia", "negociacao", "atendimento"].filter(
      (term) => normalize(jobText).includes(term) || normalize(resumeText).includes(term),
    ),
  );
  const passProbability = overallScore >= 76 ? "Alta" : overallScore >= 55 ? "Média" : "Baixa";

  const fitStrengths = buildFitStrengths(matchedKeywords, hardSkills, coveredRequirements, metricDensity, formatIssues);
  const fitImprovements = buildFitImprovements(missingCritical, weakTerms, formatIssues, resumeText, jobText);
  const rewriteBullets = [
    ...fitImprovements.slice(0, 4),
    matchedKeywords.length
      ? `Manter no topo os sinais que já batem com a vaga: ${matchedKeywords.slice(0, 5).map(polishKeyword).join(", ")}.`
      : "Reescrever o resumo profissional usando palavras reais da vaga que também existam na sua experiência.",
  ];

  const integrityWarnings = [
    "Não adicione ferramenta, certificação, idioma, senioridade ou resultado que não exista na sua experiência.",
    "Quando faltar requisito, use formulações honestas como 'exposição a', 'conhecimento prático em' ou deixe como plano de desenvolvimento.",
    "Currículo otimizado aumenta leitura e recuperação por busca, mas nenhuma ferramenta consegue garantir aprovação automática.",
  ];

  return {
    overallScore,
    passProbability,
    atsPrediction,
    atsEngines: orderedAtsEngines,
    fitStrengths,
    fitImprovements,
    hardSkills,
    softSignals,
    missingCritical,
    weakTerms,
    matchedKeywords: matchedKeywords.slice(0, 18),
    formatIssues,
    rewriteBullets,
    structureRecommendations,
    blockerIssues,
    linkedinSuggestions: buildLinkedinSuggestions(resumeText, hardSkills, searchLocation),
    optimizedResume: buildProfessionalResume(resumeText, jobText, matchedKeywords, hardSkills),
    recruiterSummary:
      overallScore >= 76
        ? "O currículo tem boa aderência inicial. O ganho principal agora está em evidenciar impacto e manter linguagem igual à vaga."
        : overallScore >= 55
          ? "O currículo tem base aproveitável, mas alguns requisitos e termos centrais precisam subir para o topo e aparecer com prova concreta."
          : "O currículo provavelmente seria fraco em filtros e busca. É preciso reposicionar resumo, habilidades e experiências antes de aplicar.",
    integrityWarnings,
  };
}
