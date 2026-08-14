---
id: POST-PLAN-2026-001
schema_version: "1.0"
title: "Post-âncora: \"Pedi para uma IA auditar minha própria infraestrutura em produção. Isto é o que ela encontrou.\""
created_at: 2026-06-27
updated_at: 2026-06-27
status: idea
channels: []
source_skill: post-planejamento
planned_publication:
published_at:
canonical_content:
related_case:
related_work_items: []
tags: []
contains_sensitive_content: false
---

<!-- Migrado de projects/publishing-content/postagens/01-post-ancora-ia-staff-engineer.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post-âncora: "Pedi para uma IA auditar minha própria infraestrutura em produção. Isto é o que ela encontrou."

## Títulos alternativos
- "IA como Staff Engineer: uma auditoria real, sem filtro"
- "Não pedi opinião. Pedi auditoria. A diferença importa."

## Tese central

A maior parte do discurso sobre "IA na engenharia de software" é demonstração controlada — projetos de brinquedo, tarefas isoladas. Este post documenta o oposto: uma auditoria completa, com critérios definidos antes de começar (para evitar viés de confirmação), aplicada a um sistema real em produção (ainda que em ambiente de dev), com achados que incluem bugs de segurança reais, CVEs nomeados e uma falha de pipeline descoberta no meio do processo. O valor do post não é "a IA é boa", é **mostrar o processo de auditoria como um artefato replicável**.

## Por que importa (ângulo IA/engenharia moderna)

O leitor-alvo deste blog é alguém avaliando se/como usar IA em engenharia de verdade, não em demos. O diferencial do post é metodológico: antes de a IA tocar em qualquer código, os 12 critérios da auditoria foram negociados e validados por mim (humano) — arquitetura, qualidade, testes, CI/CD (incluindo a pergunta de engenharia de repositório: monorepo vs. polyrepo), segurança, observabilidade, performance, IaC, dependências, documentação/governança, developer experience, custo/FinOps. Isso é o oposto do "deixa a IA fuçar e ver o que acha". É auditoria com protocolo.

## Storytelling sugerido

**Abertura:** não comece explicando o que é auditoria de engenharia. Comece no momento em que, investigando dependências (critério 9), a auditoria tropeça em algo que não estava no roteiro: o pipeline de deploy mais recente tinha falhado, silenciosamente, por cota de armazenamento de artefatos esgotada — e o último deploy para dev simplesmente não tinha ido para o ar. Ninguém tinha notado ainda. Isso é uma cena real, com tensão genuína (não dramatizada): a auditoria *encontrou* um incidente em andamento, não um problema teórico.

**Desenvolvimento:** narre o protocolo (critérios definidos antes, achados classificados por severidade, nada de código alterado durante a análise) e dê 4-5 achados como amostra (não os 12 critérios completos — isso é para a série). Escolha os mais "cinematográficos":
1. O `X-Frame-Options` que existe no código mas não funciona (proteção fantasma).
2. O CVE crítico na própria biblioteca de sanitização de HTML.
3. A Lambda duplicada e morta com schema antigo, esperando alguém editar o arquivo errado.
4. O incidente de pipeline descoberto ao vivo.
5. (opcional, se quiser fechar em tom de padrão) o `prd.tfvars` que não tem as flags de observabilidade que o próprio `contract.md` do projeto exige como obrigatórias — mostra que o padrão "desenho certo, ativação pendente" se repete em domínios bem diferentes.

**Virada:** o ponto não é "a IA achou tudo sozinha" — é que ela seguiu uma metodologia de staff engineer (hipótese → evidência → severidade → recomendação), com cada achado citando arquivo e linha, sem opinar sem prova. Isso é replicável por qualquer leitor.

**Fechamento:** anuncie a série completa (link para os 12 posts de critério, fechando com o padrão "desenho correto, ativação ou vigilância pendente" que atravessa a auditoria inteira) e plante a semente do ebook (o `contract.md` como "constituição operacional" escrita para a IA seguir).

## Provas e exemplos reais (usar ao menos 4)

- Incidente de pipeline: run `28295174116` do `Deploy Pipeline (CD)` falhou com `Failed to CreateArtifact: Artifact storage quota has been hit` — build e testes passaram, só o upload de artefato falhou, e isso bloqueou o job de deploy para dev inteiro.
- `admin/index.html`: `X-Frame-Options: DENY` declarado via `<meta http-equiv>` — funcionalmente inerte, pois browsers ignoram esse header fora de contexto HTTP real.
- `sanitize-html@2.17.3` (a lib que sanitiza todo HTML de post antes de salvar) tem CVE crítico nomeado: GHSA-rpr9-rxv7-x643.
- `backend/src/functions/adminCategories/` (154 linhas, schema antigo `CATEGORIES_TABLE`/`nome_exibicao`) é código morto não referenciado em nenhum build nem Terraform — só `adminCategorias/` (93 linhas, PT) está realmente em produção.

## Conceitos a explicar (conciso)

- **Auditoria de engenharia "world-class"**: comparação objetiva contra um padrão definido (aqui: 12 critérios negociados previamente), não opinião subjetiva.
- **CVE / advisory**: identificador público de uma vulnerabilidade conhecida em uma biblioteca específica.
- **Pipeline vermelho**: estado em que a automação de build/deploy falhou — sinal de que algo não está validado, mesmo que pareça "tudo funcionando" pra quem não olhou o CI.

## Estrutura sugerida (H2s)

1. O que eu pedi (e o que eu não pedi)
2. O protocolo: critérios antes da busca
3. O incidente que a auditoria encontrou sem procurar
4. Quatro achados, em ordem de "isso parece bobo até você entender por quê"
5. O que isso prova sobre IA em engenharia real (e o que não prova)
6. Próximos passos: a série completa

## Fecho / CTA

Link para o primeiro post da série (Arquitetura & Design) e teaser do ebook ("o documento que escrevi para a IA seguir como staff engineer autônomo — capítulo dedicado a isso em breve").

## Fonte interna

`docs/auditoria-engenharia/01..12-*.md` (múltiplos achados combinados, auditoria completa) + descoberta ao vivo do pipeline (não documentada em arquivo de critério, é achado fora de escopo).
