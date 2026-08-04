---
id: POST-PLAN-2026-020
title: "177 Arquivos .css, 2 .module.css — e Nenhuma Regra Escrita Explicando Por Quê"
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

<!-- Migrado de projects/publishing-content/postagens/20-standalone-css-modules-vs-css-global.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post Standalone: "177 Arquivos .css, 2 .module.css — e Nenhuma Regra Escrita Explicando Por Quê"

## Títulos alternativos
- "CSS Modules ou CSS Global? A Pergunta Errada Quando Seu Projeto Já Tem 177 Arquivos"
- "Por Que Não Migramos pra CSS Modules (Mesmo Sabendo que o Projeto Vai Crescer Muito)"

## Tese central

Toda decisão de arquitetura CSS é, no fundo, uma escolha entre "escopo garantido por ferramenta" (CSS Modules) e "escopo garantido por disciplina humana" (convenção de nomenclatura em CSS global). O blog tinha essa escolha feita de fato — 177 arquivos `.css` globais — mas nunca **decidida**: 2 arquivos (`PostFooter.module.css`, `ShareRail.module.css`) usavam CSS Modules sem nenhuma razão documentada, simples inconsistência de quem escreveu naquele momento. O post usa essa descoberta como gancho pra uma pergunta mais interessante que "qual é melhor": dado que o projeto vai crescer bastante, migrar tudo agora seria a decisão certa, ou é só a sensação de "deveríamos seguir best practice" disfarçada de decisão técnica?

## Por que importa

1. **Toda escolha de "padrão de projeto" tem um custo de migração que cresce com o tempo** — quanto mais arquivos existem na convenção antiga, mais caro fica trocar depois. A pergunta "vale a pena migrar" muda de resposta dependendo de quando ela é feita.
2. **CSS Modules não é estritamente "melhor"** — ele resolve um problema real (colisão de nome de classe) trocando por uma restrição real (seletores que cruzam elementos/componentes, como `:nth-child` alcançando um elemento "de fora", ficam difíceis ou exigem escape). Esse projeto usa esse padrão deliberadamente em várias páginas.
3. **A decisão final não foi "migrar tudo" nem "ignorar o problema"** — foi uma terceira opção, mais sutil e mais comum na vida real de um projeto que cresce: regra daqui pra frente, sem tocar no passado. Vale explicar o raciocínio por trás dessa escolha, porque é mais transferível pro leitor do que "tutorial de CSS Modules".

## Storytelling sugerido

Abra com o número seco: 177 arquivos `.css`, 2 arquivos `.module.css`. Pergunta natural do leitor: "por que esses 2 são diferentes?" Resposta honesta, sem dramatizar: não havia razão documentada — foi escolha pontual de quem escreveu aquele componente, nunca formalizada. Isso é o gancho real: não é sobre "achamos um bug", é sobre "achamos uma decisão arquitetural que ninguém tinha tomado de fato, ela só tinha acontecido."

Segundo movimento: explicar os dois modelos (CSS global com convenção de prefixo vs. CSS Modules) com exemplos reais do próprio projeto — o seletor `.sobre-tc-item:nth-child(1) .sobre-tc-logo` como prova de que o projeto depende de alcançar elementos "de fora" do componente, o que CSS Modules dificultaria.

Terceiro movimento: a pergunta do Marcelo que muda o jogo — "o projeto vai crescer muito, vale migrar?" — e por que a resposta não foi sim nem não, foi "regra nova, sem reescrever o passado". Fechar com o raciocínio de custo-benefício que levou a essa decisão, nomeando explicitamente o que se ganha (proteção em código novo) e o que se evita pagar (risco de regressão visual em código que já funciona).

## Provas e exemplos reais

- Contagem real: `find frontend -name "*.css" -not -name "*.module.css"` → 177; `find frontend -name "*.module.css"` → 2 (`components/post/PostFooter.module.css`, `components/post/ShareRail.module.css`).
- Seletor real que dependeria de `:global()` em CSS Modules: `frontend/app/sobre/sobre.css` — `.sobre-tc-item:nth-child(1) .sobre-tc-logo { height: 42px; ... }`, `.sobre-acad-tile img { width: 100%; height: 100%; object-fit: contain; }`.
- Regra global deliberada que não depende de classe nenhuma, e por isso é neutra à escolha: `section { margin-block: var(--space-6) }` em `globals.css` (ritmo vertical do design system).
- Convenção de prefixo manual já em uso como "CSS Modules feito à mão": `sobre-*`, `op-*` (O Projeto), `pc-*` (PostCard), `post-*`.
- Regra final formalizada em `CLAUDE.md` (seção 5, "CSS Modules vs. CSS global"): componente novo → `.module.css`; CSS existente → não migrar retroativamente, só tocar se já estiver editando aquele componente por outro motivo.

## Conceitos a explicar

- **CSS global (cascading, sem escopo)**: toda classe definida em qualquer arquivo `.css` importado existe no mesmo namespace do documento inteiro — colisão é possível e não gera erro, só comportamento inesperado.
- **CSS Modules**: feature de build (Next.js/webpack/Turbopack) que renomeia cada classe de um arquivo `.module.css` para um identificador único (hash) no momento do build, eliminando colisão entre arquivos por construção, não por convenção.
- **Escopo por convenção vs. escopo por ferramenta**: a diferença central do post — um depende de disciplina humana (prefixo manual, code review), o outro de garantia automática (compilador). Nenhum dos dois é "mais profissional" em abstrato — depende do que o projeto já faz.
- **Seletor descendente entre "componentes"**: padrão de CSS que alcança elementos fora do escopo direto de uma classe (`.pai .filho`) — comum e necessário em CSS global, e a principal fricção ao adotar CSS Modules num projeto que já depende dele.
- **Custo de migração crescente com o tempo**: quanto mais arquivos seguem um padrão, mais caro (e mais arriscado) fica trocar de padrão depois — argumento central de por que "deveríamos crescer com best practice" nem sempre significa "deveríamos reescrever o que já existe".

## Estrutura sugerida (H2s)

1. **O número que não devia existir: 2 exceções sem explicação**
   - Apresenta a descoberta (177 vs. 2) e a ausência de qualquer registro da decisão
2. **Dois jeitos de evitar que CSS colida — e o que cada um custa**
   - CSS global + convenção de prefixo (com exemplos reais do projeto)
   - CSS Modules (com o trade-off do seletor descendente)
3. **"Vamos crescer muito" não é argumento pra migrar tudo — é argumento pra ter uma regra**
   - O raciocínio real: separar "proteger o que vem" de "reescrever o que já funciona"
4. **A decisão: regra nova, código antigo intocado**
   - O texto formalizado no `CLAUDE.md`, e por quê esse formato específico (não "proibido usar CSS global", não "obrigatório migrar")
5. **O padrão por trás disso (gancho pra série)**
   - Esse não é o primeiro caso do projeto de "convenção informal nunca formalizada até alguém perguntar por quê" — conectar com o tema mais amplo de dívida técnica silenciosa

## Fecho / CTA

"A pergunta que importava aqui não era 'CSS Modules é melhor que CSS global' — as duas opções são boas, dependendo do que você já construiu. A pergunta era: vale a pena pagar o custo de migrar 177 arquivos pra resolver um problema que minha convenção atual já evita na prática? Às vezes a resposta certa não é a mais 'correta' no papel, é a que reconhece o que já está funcionando."

## Fonte interna

- Descoberta original: sessão de 2026-06-29, conversa sobre pipeline de imagens responsivas que evoluiu pra uma pergunta sobre arquitetura CSS.
- Regra formalizada: `marcelo-goncalves-blog/CLAUDE.md`, seção 5, "CSS Modules vs. CSS global".
- Arquivos reais citados: `frontend/app/sobre/sobre.css`, `frontend/components/post/PostFooter.module.css`, `frontend/components/post/ShareRail.module.css`, `frontend/app/globals.css`.

## Notas de escrita

- Evitar tom de tutorial ("o que é CSS Modules") solto sem o gancho da descoberta real — abrir sempre pelo número (177 vs 2), não pela definição técnica.
- Esse post é uma boa oportunidade pra mostrar o lado "decisão consciente de não fazer a coisa que parece mais moderna" — alinhado ao tom que o Marcelo quer dar à série (relatar inclusive decisões que poderiam parecer erro de fora, mas têm raciocínio real por trás).
- Sem necessidade de comparar com outras ferramentas de CSS-in-JS (styled-components, Tailwind, etc.) — foco estrito na dicotomia real do projeto (CSS global vs. CSS Modules, ambos já nativos do Next.js, sem dependência nova).
