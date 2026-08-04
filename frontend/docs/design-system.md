# Design system (frontend)

> Fonte de valores executáveis: `frontend/app/globals.css` (`:root`) e `prints/tokens.md` (lista completa de tokens com papel de cada um). Este documento explica princípios e papéis, não repete os valores.

## Fontes

| Variável CSS | Fonte | Uso |
|---|---|---|
| `--font-display` | Inter | Headings, UI, botões, nav |
| `--font-sans` | Inter | Body, parágrafos |
| `--font-mono` | JetBrains Mono | Código, eyebrows/labels/badges pequenos (uso textual, não numérico isolado) |
| `--font-numbers` | Inter (`var(--font-display)`) | Todo número-índice decorativo (`01`/`02`/`03`, contadores de card/etapa/timeline) |

Nunca usar `Space Grotesk` ou `DM Sans` — removidos do frontend e do admin.

`--font-numbers` existe porque JetBrains Mono renderiza o glifo `0` com um ponto no meio por padrão (característica de design da fonte, sem alternativa via `font-feature-settings`). Todo elemento que renderiza um número-índice sozinho usa `var(--font-numbers)`, nunca `var(--font-mono)` diretamente — mesmo em componentes compartilhados. Texto misto com letras (eyebrow, label, tag, badge) continua em `--font-mono`.

## Paleta — Petrol / Clay / Ivory

Fonte de verdade corrente, declarada em `globals.css`. Substituiu por completo a paleta azul anterior (`--accent`/`--dark-900`/`--surface-*` etc.) — nenhum desses tokens antigos existe mais no código; não usá-los em referência nova. `--aws-orange`, `--aws-dark`, `--gray-*` também foram removidos.

AdSense usa a flag `ADSENSE_CONFIGURED` em `AdsenseInArticle.tsx`, nunca `NODE_ENV` (`NODE_ENV === 'production'` tornaria o bloco invisível em produção real).

## Escalas

- **Espaçamento**: base 4px, 13 tokens `--sp-1..13`. Única escala de layout — `--space-1..7` (legacy, base 8px) foi removida sem alias de compatibilidade.
- **Tipografia**: 11 tokens `--type-caption..--type-display-lg`, `clamp()` fluido 400px→1280px. Única escala de fonte — `--text-xs..--text-4xl` (fixa) foi removida sem alias.
- **Prosa** (`--prose-sp-1..5`, só dentro de `.post-content`): deliberadamente em `em`, não `--sp-*` — espaçamento editorial escala com o tamanho da fonte do elemento, não é medida fixa de página.
- **Border radius**: `--radius-sm..--radius-full`.

### Papel → token mínimo

O enforcement do Stylelint (abaixo) garante *que* um token seja usado, não *qual* token cabe a cada papel. Referência:

| Papel do elemento | Token mínimo | Nunca abaixo de |
|---|---|---|
| Texto de leitura corrida (parágrafo, descrição, excerpt) | `--type-body-sm` | 16px mobile |
| Link/CTA interativo (nav, "ler mais", botão textual) | `--type-label` | 14.2px mobile |
| Título de card/widget (H3 dentro de card) | `--type-lead` | 20.25px mobile |
| Metadado/decorativo (eyebrow, tag, badge, timestamp, copyright) | `--type-caption` | sem piso |

Antes de escrever `font-size`/`margin`/`padding` novo: identificar o papel do elemento nesta tabela, não só "parece do tamanho certo". A mesma lacuna existe no lado de espaçamento (ex.: papel "título → descrição" tem 3 implementações reais divergentes no projeto) — não convergir sem validação visual dedicada.

## Ritmo vertical

`section { margin-block: var(--sp-10) }` (64px) global. Exceções obrigatórias (`margin-block: 0`): `PageHero`, `SuperDestaque`, qualquer seção fullwidth com padding próprio. Sidebars: filhos diretos com `margin-block: 0`, `gap` do flex é o único responsável pelo ritmo. Colunas editoriais sobrescrevem com `margin-block` menor; primeiro filho sempre `margin-top: 0`.

## Botões — sistema único

Todo botão/CTA do frontend público usa exatamente duas classes globais em `globals.css`: `.btn` (clay, primária, padrão) e `.btn.btn-petrol` (petróleo, secundária). Mesma forma sempre (`padding: 14px 22px; border-radius: 12px; font-weight: 600`), variando só texto e largura. **Nunca criar uma nova classe de botão com cor/padding/radius próprios** — se um componente precisa de contexto de layout, crie uma classe local sem propriedades de cor/forma e aplique-a junto com `.btn`/`.btn-petrol`.

Isso substituiu 14 sistemas de botão distintos anteriores — os nomes de classe antigos continuam existindo (para não quebrar seletores CSS descendentes), mas nenhum define mais cor ou padding.

## CSS Modules vs. CSS global

Componente novo a partir de agora usa `.module.css` — evita colisão de classe e dá rede de segurança contra typo. CSS existente (177 arquivos `.css` globais) não é migrado retroativamente — custo real de reescrever seletores `:nth-child`/descendentes que cruzam elementos é maior que o ganho, dado que a convenção de prefixo manual (`sobre-*`/`op-*`/`pc-*`/`post-*`) já mitiga colisão na prática. Só editar um `.css` existente se já estiver tocando naquele componente por outro motivo.

## Enforcement automático (Stylelint)

`font-size`/`margin*`/`padding*`/`gap`/`row-gap`/`column-gap` só aceitam `var(--sp-*)`, `var(--type-*)` ou `var(--prose-sp-*)` (mais aliases `--gap-grid`/`--gap-loose`/`--eyebrow-gap`/`--title-gap`) — nunca valor `px`/`rem`/`em` cru. Regra do Stylelint (`stylelint-declaration-strict-value`), roda em `npm run lint` (mesmo comando do CI). Um valor hardcoded novo quebra o build.

Exceções:

- magnitude ≤3px passa sem token (ajuste óptico menor que o menor degrau da escala);
- exceção pontual (numeral decorativo, letra capitular, geometria calculada, `sr-only`) exige `/* stylelint-disable-next-line scale-unlimited/declaration-strict-value -- motivo */` visível no diff.

Rodar `npm run lint:css` isoladamente para checar só CSS.

## Logo

```
Marcelo    → header: color var(--ivory) · footer: color #fff
Gonçalves  → header: color var(--clay) · footer: color var(--petrol-soft)
```

Fonte: Inter — nunca DM Sans/Space Grotesk.
