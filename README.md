# AnaliseCV IA

Sistema web para analisar um curriculo contra uma vaga, simulando criterios comuns de ATS e ferramentas de triagem com IA.

## O que faz

- Le PDF, DOCX, TXT, MD e CSV no navegador.
- Importa curriculos Lattes exportados em XML, HTML, RTF ou TXT.
- Aceita descricao da vaga manualmente ou importa o texto a partir de um link publico.
- Permite informar a empresa e detecta o ATS mais provavel pelo link/texto da vaga.
- Compara curriculo e vaga por termos, requisitos, habilidades, metricas e estrutura.
- Simula risco por plataformas como Workday, Greenhouse, iCIMS, Oracle Taleo, SAP SuccessFactors, Lever e SmartRecruiters.
- Inclui ATS internacionais usados nos EUA e Europa, como Ashby, Workable, Teamtailor, Recruitee/Tellent, Personio, Cegid Talentsoft, Flatchr, BambooHR, Jobvite/Employ, UKG, ADP, Dayforce, Avature, Eightfold AI e Phenom.
- Sugere ajustes honestos sem inventar experiencia, certificacao, idioma ou resultado.
- Gera uma versao textual reorganizada do curriculo com estrutura profissional.
- Gera PDF do curriculo sugerido em layout de uma coluna, mais aceito por ATS e pela industria.
- Mostra pontos que podem enroscar, estrutura recomendada e buscas provaveis no LinkedIn.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://127.0.0.1:5173`.

No campo da vaga, use `Descricao` para colar o texto manualmente ou `Link` para buscar uma pagina publica de vaga. Alguns portais exigem login ou bloqueiam acesso automatizado; nesses casos, cole a descricao manualmente.

Para identificar o ATS real, preencha o nome da empresa e, sempre que possivel, cole o link da vaga. Dominios como `myworkdayjobs.com`, `greenhouse.io`, `lever.co`, `icims.com`, `taleo.net`, `successfactors.com`, `gupy.io` e `smartrecruiters.com` sao usados para destacar a simulacao mais provavel.

As vagas provaveis no LinkedIn sao sugeridas a partir do curriculo da pessoa, priorizando habilidades, ferramentas e perfil profissional detectados no texto enviado.

Para Lattes, prefira exportar em XML quando possivel. PDF de Lattes pode vir sem texto selecionavel ou corrompido; se o arquivo estiver com 0 bytes, o sistema avisa para exportar novamente.

## Build

```bash
npm run build
```

## Observacao importante

O score e uma simulacao tecnica, nao uma promessa de aprovacao. ATS e ferramentas de recrutamento variam por configuracao, filtros eliminatorios, perguntas obrigatorias e revisao humana. O objetivo e melhorar legibilidade, recuperacao por busca e aderencia real a vaga.
