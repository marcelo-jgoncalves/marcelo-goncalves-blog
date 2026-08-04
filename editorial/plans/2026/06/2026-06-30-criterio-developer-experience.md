---
id: POST-PLAN-2026-014
title: "Post 11 da série: Developer Experience — \"A ferramenta de onboarding com a configuração errada\""
created_at: 2026-06-30
updated_at: 2026-06-30
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

<!-- Migrado de projects/publishing-content/postagens/14-criterio-developer-experience.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post 11 da série: Developer Experience — "A ferramenta de onboarding com a configuração errada"

## Títulos alternativos
- "Quando o atalho tem um defeito que só aparece no fim do caminho"
- "O console.error que salvou 20 minutos de debug"

## Tese central

DX (Developer Experience) costuma ser tratado como "nice to have" — algo para arrumar quando der tempo. O post argumenta o oposto usando um caso irônico e concreto: a própria ferramenta criada para reduzir fricção de setup deste projeto (uma central de comandos de desenvolvimento) documentava variáveis de ambiente erradas para um dos três módulos do sistema. A ferramenta que deveria economizar tempo, sem revisão, passou a custar tempo.

## Por que importa

Ferramentas de DX (scripts, skills, runbooks, READMEs) têm uma propriedade perigosa: parecem confiáveis por serem "a ferramenta oficial", então são seguidas sem questionamento — diferente de uma busca manual no Google, que naturalmente é cruzada com mais fontes.

## Storytelling sugerido

Abra com a cena de quem segue a documentação ao pé da letra: copia as variáveis de ambiente sugeridas, sobe o servidor do admin, e a aplicação não conecta corretamente — sem erro óbvio, porque o nome da variável simplesmente não corresponde ao que o código espera. Revele os dois conjuntos de nomes lado a lado (o documentado vs. o real, incluindo duas variáveis de Cognito que a documentação nem menciona). A piada amarga: a skill existe exatamente para evitar esse tipo de fricção, e introduziu fricção nova.

Segundo beat, de virada positiva: o próprio código (`api.ts`) já tem uma defesa simples — um `console.error` explícito quando a variável certa está ausente. É um exemplo de DX bem pensado dentro do código, mesmo com a documentação externa errada. Use isso para argumentar que DX boa não depende só de documentação atualizada — depende de o sistema também ajudar a se autodiagnosticar.

Fechamento: tratar scripts/skills/runbooks de onboarding com a mesma disciplina de revisão que se trata código de produção — eles raramente são testados automaticamente, então divergem em silêncio.

## Provas e exemplos reais

- Documentado pela skill `dev-hub`: `VITE_API_URL` + `VITE_ADMIN_ORIGIN`.
- Real (`admin/src/services/api.ts:5` e `.github/workflows/cd.yml:186-189`): `VITE_API_BASE_URL` + `VITE_COGNITO_USER_POOL_ID` + `VITE_COGNITO_CLIENT_ID` + `VITE_ASSETS_URL`.
- `admin/src/services/api.ts:7`: `if (import.meta.env.DEV && !API_URL) console.error('VITE_API_BASE_URL não definida!')` — a rede de segurança que o próprio código já oferece.
- Só `frontend/.env.example` existe no repositório — nenhum para backend ou admin.
- Contraste: `frontend/.env.example` é exemplo positivo de DX — aponta direto para a API real de dev, contribuidor roda em minutos sem coordenar com ninguém.

## Conceitos a explicar

- **DX (Developer Experience)**: a qualidade da experiência de quem desenvolve no projeto — onboarding, velocidade de feedback, clareza de erro — tratada como propriedade de engenharia, não luxo.
- **Documentação executável vs. documentação descritiva**: a primeira (ex: `.env.example`, scripts) é testada implicitamente todo dia que alguém a usa; a segunda (prosa solta) só é validada quando alguém para para ler com atenção — e raramente é.
- **Fail-fast em configuração**: avisar imediatamente quando uma configuração esperada está ausente, em vez de deixar o sistema falhar de forma vaga mais adiante.

## Estrutura sugerida (H2s)

1. A documentação que deveria economizar tempo
2. O nome certo, o nome errado, lado a lado
3. A defesa que já existia no código (e por que isso importa)
4. Por que ferramentas de onboarding precisam do mesmo cuidado que código de produção
5. Como tornar documentação de setup "testável" (templates, validação de variável, scripts versus prosa)

## Fecho / CTA

Fecha a série dos 12 critérios da auditoria — aponta de volta para o post-âncora e para o post de Custo/FinOps como capítulo final.

## Fonte interna

`docs/auditoria-engenharia/11-developer-experience.md`
