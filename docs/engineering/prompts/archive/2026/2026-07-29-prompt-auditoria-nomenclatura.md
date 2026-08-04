---
id: PROMPT-2026-002
title: "Prompt para próxima sessão: auditoria completa de nomenclatura do projeto"
created_at: 2026-07-29
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
contains_sensitive_content: false
---

<!-- Migrado de marcelo-goncalves-blog-arquivo/prompts/prompt-auditoria-nomenclatura.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Prompt para próxima sessão: auditoria completa de nomenclatura do projeto

Cole este prompt no início de uma sessão dedicada a essa auditoria.

---

Preciso de uma auditoria completa de nomenclatura em todo o projeto (`marcelo-goncalves-blog`: `frontend/`, `backend/`, `admin/`, `infra/`). Hoje não existe um padrão bem definido — o código mistura português e inglês livremente em nomes de tokens CSS, classes, componentes, variáveis, funções, arquivos, rotas, etc., e isso nunca foi tratado como um problema explícito até agora.

**Modo de trabalho: isso é análise, não ação.** Ler, mapear, catalogar e reportar os achados — não renomear nada nesta sessão. Renomear em massa é uma mudança de alto risco (quebra imports, contratos de API, chaves do DynamoDB, nomes de classe referenciados por seletor CSS descendente/`:global()`) e só deve acontecer depois que Marcelo decidir explicitamente o padrão e aprovar o escopo.

## O que mapear

1. **Tokens de design** (`frontend/app/globals.css`): variáveis de cor (`--petrol`, `--clay`...), espaçamento (`--sp-*`), tipografia (`--type-*`), radius, sombra. Já são majoritariamente em inglês — confirmar consistência.
2. **Nomes de classe CSS** — tanto CSS Modules (`*.module.css`, ex.: `styles.decisionCard`, `styles.qualidadeSubbloco`) quanto CSS global por página (`page.css`/`*.css` com convenção de prefixo manual tipo `sobre-*`/`op-*`/`pc-*`/`post-*`/`esw-*`). Levantar: quantas classes usam palavra em português vs. inglês vs. mistura dentro do mesmo nome (ex.: `qualidadeSubblocoIndex` = português + inglês estrutural).
3. **Componentes React** (`frontend/components/**/*.tsx`, `admin/src/components/**/*.vue`): nomes de componente, nomes de prop, nomes de arquivo.
4. **Variáveis/funções/constantes** em TS/JS: `frontend/`, `backend/src/`, `admin/src/`. Prestar atenção especial a: nomes de campo que viajam até o DynamoDB (`e_popular`, `e_projeto`, `data_publicacao`, `imagem_destaque_url` — esses são campos de dado persistido, renomear é uma migração de dados, não um refactor de código; tratar como categoria separada e de risco alto) vs. nomes que são só internos ao código (função, variável local, tipo TS).
5. **Rotas/URLs** (`frontend/app/**/page.tsx` — a estrutura de pastas do App Router): `/automacao`, `/plataforma`, `/sobre`, `/contato`, `/o-projeto`, `/todos-artigos` vs. eventuais nomes em inglês.
6. **Arquivos e pastas**: nomes de arquivo `.tsx`/`.css`/`.ts` — mistura de convenção (`kebab-case` vs `camelCase` vs `PascalCase`), e mistura de idioma no nome do arquivo em si.
7. **IDs de seção usados como âncora** (`id="qualidade"`, `id="abordagem"`, `id="capacidades"` etc.) — hoje em português; conferir consistência entre as 4 landings de pilar.
8. **`data-audit` attributes** (usados pra Playwright/QA) — ex. `esw-qualidade`, `esw-capacidades` — conferir o padrão de prefixo por página.

## O que produzir

Um relatório (não precisa ser arquivo novo se a resposta couber na conversa; se for muito longo, salvar em `contexto/` seguindo a convenção existente) com:

- **Inventário por categoria** (das 8 acima): quantos itens, exemplos representativos de cada padrão encontrado (não listar todos os milhares de ocorrências, s3 amostra e contagem).
- **Padrões que já existem de fato** (mesmo sem terem sido formalizados) — ex.: "tokens de design sempre em inglês", "IDs de seção sempre em português", "nomes de componente React sempre em inglês/PascalCase" — pra identificar o que já é consistente por convenção tácita, sem precisar mudar.
- **Inconsistências reais** — casos onde o mesmo tipo de coisa tem nomes ora em português ora em inglês sem critério aparente, ou mistura dentro do mesmo identificador.
- **Recomendação de padrão formal**, com justificativa curta, para cada categoria (ex.: "nomes de classe/componente/token: inglês, porque é o vocabulário técnico do design system e do ecossistema React/CSS; conteúdo/copy visível ao usuário: português, óbvio; IDs de âncora e `data-audit`: manter português, pois hoje já é assim de forma consistente e mudar quebra links/QA sem ganho real").
- **Lista de riscos por categoria de rename** (baixo/médio/alto), especialmente destacando: campos de DynamoDB (alto risco, exige script de migração), nomes de rota (impacto em SEO/links externos já indexados — ver `CLAUDE.md` §10 sobre redirect de `/blog` nunca criado), nomes de classe CSS referenciados por seletor `:global()`/descendente entre arquivos.
- **Não propor nem executar nenhum rename nesta sessão** — só ao final, perguntar a Marcelo se ele quer abrir um plano de ação (Plan mode) pra decidir prioridade e escopo de uma eventual padronização incremental.

## Contexto útil já disponível

`CLAUDE.md` já documenta bastante do design system (`--sp-*`, `--type-*`, cores, convenção `sobre-*`/`op-*`/`pc-*`/`post-*`) e decisões passadas (CSS Modules vs. global, seção 5). Ler isso primeiro antes de escanear o código, para não recatalogar o que já está documentado como decisão consciente.
