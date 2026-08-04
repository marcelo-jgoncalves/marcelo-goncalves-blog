---
id: PROMPT-2026-003
title: "Prompt para retomar: revisão visual seção-a-seção das landings de pilar"
created_at: 2026-07-29
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
contains_sensitive_content: false
---

<!-- Migrado de marcelo-goncalves-blog-arquivo/prompts/prompt-continuar-revisao-visual-software.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Prompt para retomar: revisão visual seção-a-seção das landings de pilar

Cole este prompt no início de uma próxima sessão para continuar exatamente de onde paramos.

---

Estamos no meio de uma revisão visual seção-a-seção das 4 landing pages de pilar (`/automacao`, `/plataforma`, `/inteligencia-artificial`, `/software`), convertendo protótipos HTML que Marcelo gera externamente (via GPT) e salva na raiz do repo para o design system real do projeto (tokens `--sp-*`/`--type-*`/cores em `frontend/app/globals.css`, componentes React em `frontend/components/ui/`).

**Concluído na sessão 2026-07-29** (commit `0163aa7`): seção "Nossa abordagem" de `/software` (`frontend/app/software/page.tsx` + `page.module.css`), a partir do protótipo `softwarev4.html`:
- Painel "Antes de construir" (4 cards de decisão: Ferramenta pronta / Integração / Adaptação / Software próprio) com ícones (não números), cor clay.
- Timeline "Como o projeto avança, etapa por etapa" (5 etapas com círculo numerado + linha de conexão) — linha copiada byte a byte de `/inteligencia-artificial` (`.decisionPath::before` lá, `.processList::before` aqui) para sticky/geometria idênticas.
- Seção "Qualidade e continuidade": lista de checks (ícone de check, não número) + 3 subblocos (Manutenção/Propriedade e acesso/Dívida técnica) agora com ícones clay em vez de números-índice.
- Removida a barra de destaque clay do topo do card "Software próprio" (border-top da última coluna da tabela agora idêntico às outras).
- Novos ícones em `frontend/components/ui/InstitutionalIcons.tsx`: `IconPropriedadeAcesso` (chave).

**Padrões/gotchas já validados nesta rodada, reaproveitar sem redescobrir:**
- `position: sticky` dentro de CSS Grid: se o item sticky é filho direto de um grid sem `align-items`/`align-self` explícito, o padrão `stretch` estica o item pra altura do irmão mais alto e mata o sticky (métrica reveladora: `sticky.offsetHeight === irmão.offsetHeight`, medir com `getBoundingClientRect`, não só olhar). Fix: `align-self: start` no próprio elemento sticky. Documentado em `CLAUDE.md` §10 item 45 / seção de componentes.
- Linha de conexão de timeline "tocando" os círculos: `box-shadow` decorativo nos círculos (usado pra mascarar linha antiga) fica numa camada de pintura acima da linha e cria um gap visual falso mesmo com a geometria correta — remover o `box-shadow` se a linha precisa tocar de verdade.
- Verificação sempre por `getBoundingClientRect`/medição real pra bugs de sticky ou geometria, não só screenshot — screenshot pode parecer plausível e estar errado.
- Ajustes pontuais de CSS (cor, borda, ícone, peso de fonte) não precisam de confirmação visual via Playwright — Marcelo valida ele mesmo. Screenshot só quando ele pedir, ou quando é mudança estrutural (novo grid/componente).
- **Nunca commitar/pushar sem pedido explícito no momento** — mesmo que uma sessão anterior tenha autorizado, não vale para a sessão seguinte.

**Pendências conhecidas (backlog, `CLAUDE.md` §10 item 45):**
- Protótipos ainda não processados na raiz do repo: `automacao-v3.html`, `plataforma.html`/`plataforma.md`, `software.html`/`software.md` (versão anterior a `softwarev4.html`, provavelmente obsoleto), `inteligencia-artificial.html`/`.md` (novo, apareceu nesta sessão).
- `automacao-standalone-revisada-v2.html` tem uma proposta de redesign da seção "Confiabilidade e controle" (`#confiabilidade`) ainda não implementada.

**Como proceder:** perguntar a Marcelo qual protótipo/seção processar a seguir (provavelmente `inteligencia-artificial.html` ou o restante de `/plataforma`). Cada protótipo aprovado vale só pela(s) seção(ões) citada(s) explicitamente — nunca implementar a página inteira de uma vez. Converter todo valor de espaçamento/fonte do protótipo (que usa `clamp()`/px cru) para os tokens do projeto antes de aplicar — o Stylelint rejeita valor cru em `font-size`/`margin`/`padding`/`gap`.
