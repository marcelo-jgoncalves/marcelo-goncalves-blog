# Plano de migração — Tiptap 2 → 3 (admin)

> **Status (2026-08-03): executado.** Código migrado conforme o plano abaixo (que se confirmou preciso na prática — ver os 3 achados extras registrados em `docs/backlog.md` item #60), validação local completa (`vue-tsc`/`eslint`/`vitest`/`vite build`). Falta só a QA funcional contra o ambiente `dev` implantado (`create-test-post.mjs`), que exige deploy real. Este arquivo fica como registro do plano original — ver o item #60 do backlog para o relato do que aconteceu na execução.

---

## 1. Escopo real (inventário confirmado)

`admin/src/composables/useTiptapExtensions.ts` monta o editor com 17 extensions. Consumidas em 17 arquivos:

| Arquivo | Uso de API Tiptap | Risco |
|---|---|---|
| `composables/useTiptapExtensions.ts` | Monta todas as extensions, `StarterKit.configure()`, `Table.configure()`, `CodeBlockLowlight.configure()` + `lowlight` | **Alto** — ponto único de configuração, quebra de qualquer extension aparece aqui primeiro |
| `components/RichTextEditor.vue` | `useEditor`, `EditorContent` (`@tiptap/vue-3`) | Baixo — API estável em v3 |
| `components/tiptap/EditorBubbleMenus.vue` | `BubbleMenu` de `@tiptap/vue-3`, prop `tippy-options`, prop `should-show` | **Alto** — API removida em v3 (ver §2.1) |
| `components/tiptap/EditorFloatingMenu.vue` | `FloatingMenu` de `@tiptap/vue-3`, prop `tippy-options` | **Alto** — mesma causa |
| `components/tiptap/SlashCommand.ts` | `Extension.create`, `@tiptap/suggestion` (`Suggestion()`), `tippy.js` **próprio** (não o da Tiptap) | Médio — ver §2.2 |
| `composables/useTiptapCommands.ts` | `editor.chain()...run()`, `editor.getAttributes()`, `editor.isActive()`, `editor.commands.setYoutubeVideo()` | Baixo — API de comando estável, só depende das extensions abaixo existirem |
| `composables/useEditorOutline.ts` | Nenhum — só lê `.ProseMirror h2/h3` do DOM renderizado | **Nenhum** (incluído no inventário original por engano; não importa nada de `@tiptap/*`) |
| `components/Callout.ts` | `Node.create`, `mergeAttributes` (`@tiptap/core`) | Baixo — API de node custom estável |
| `components/tiptap/PullQuote.ts` | idem | Baixo |
| `components/tiptap/ClosingFlourish.ts` | idem | Baixo |
| `components/tiptap/SmartImage.ts` | `Image.extend()`, `VueNodeViewRenderer` | Baixo |
| `components/tiptap/ImageNode.vue` | `NodeViewWrapper`/`nodeViewProps` (via `VueNodeViewRenderer`) — não lido nesta rodada, mas mesma família de API estável do `SmartImage.ts` | Baixo, confirmar no dia |
| `utils/sanitizeHtml.ts` | Nenhuma API Tiptap — só allowlist DOMPurify espelhando o HTML que os nodes acima renderizam | **Nenhum**, mas precisa revalidação se `renderHTML()` de algum node mudar de tag/classe |
| `components/PostPreviewOverlay.vue` | Não lido nesta rodada — precisa confirmar se só renderiza HTML já salvo (sem depender de API Tiptap) ou se reinstancia editor | A confirmar no dia |
| `src/tiptap.d.ts` | `declare module '@tiptap/core' { interface Commands<ReturnType> {...} }` | Baixo — augmentation de tipos, padrão estável |
| `views/EditorView.vue` | Consome `RichTextEditor`/composables acima, sem API Tiptap direta | Baixo |
| `components/tiptap/EditorToolbar.vue` | Botões que chamam `editor.chain()...` (mesma família de `useTiptapCommands`) | Baixo |

**Conclusão do inventário:** o risco real está concentrado em **2 arquivos** (`EditorBubbleMenus.vue`, `EditorFloatingMenu.vue`) e na configuração central (`useTiptapExtensions.ts`). Os outros 14 usam API que não muda entre v2 e v3.

---

## 2. Breaking changes confirmados (não suposição)

### 2.1 BubbleMenu / FloatingMenu — tippy.js → Floating UI (ALTO RISCO, exige reescrita)

Confirmado no guia oficial de migração:

- **Import path muda**: `import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3'` → `from '@tiptap/vue-3/menus'`.
- **`tippyOptions` foi removido.** Tippy.js foi substituído por Floating UI (`@floating-ui/dom`, já vem como `dependencies` de `@tiptap/extension-bubble-menu`/`@tiptap/extension-floating-menu` v3 — confirmado via `npm view`, não precisa instalar manualmente). O prop hoje usado em `EditorFloatingMenu.vue` (`:tippy-options="{ duration: 100, placement: 'left-start', maxWidth: 'none' }"`) e em `EditorBubbleMenus.vue` (`:tippy-options="{ duration: 100 }"` / `{ duration: 100, placement: 'top' }`) precisa virar a nova prop de opções (nome exato a confirmar na doc do componente Vue no dia — a doc pública mostrada é a variante React; **antes de escrever código, ler a página `BubbleMenu extension` de `tiptap.dev` para a sintaxe exata do `@tiptap/vue-3`**, não assumir 1:1 com React).
  - `duration` (transição CSS do tippy) não existe como conceito no Floating UI — precisa decidir se vira uma transição CSS própria no componente ou se é descartado (visual, não funcional).
  - `placement: 'top'` / `'left-start'` **existem** no Floating UI com o mesmo nome (é vocabulário compartilhado), só a forma de passar a opção muda.
  - `should-show` (usado no bubble-menu de tabela, `:should-show="({ editor: e }) => e.isActive('table')"`) — confirmar se o nome/assinatura do prop continua idêntico na v3 do componente Vue; é o único critério que decide se o menu de tabela aparece.
- **`@floating-ui/dom` chega transitivamente** (dependency direta dos pacotes de extension, não peer) — não precisa adicionar ao `package.json` do admin manualmente, mas vale conferir `npm ls @floating-ui/dom` depois do bump pra confirmar que resolveu numa versão só (evita duplicata no bundle).

### 2.2 SlashCommand.ts — `tippy.js` próprio, não o da Tiptap (RISCO MÉDIO, verificar não reescrever)

`SlashCommand.ts` usa `tippy` importado diretamente de `'tippy.js'` (dependência própria do projeto, não a integração interna que a Tiptap removeu) para posicionar o popup de comando "/". Isso é **código do projeto, não da Tiptap** — a remoção do tippy.js interno da Tiptap (§2.1) não obriga a reescrever isso. Risco real aqui é outro: `@tiptap/suggestion` (`Suggestion()`, `SuggestionOptions`) pode ter mudado a assinatura de `render()`/`onKeyDown`/`onExit` entre v2 e v3 — **não confirmado nesta rodada** (a doc pública consultada não detalhou `@tiptap/suggestion`). Ação necessária no dia: ler `tiptap.dev/docs/resources/changelog/suggestion` (ou equivalente) antes de tocar neste arquivo; se a assinatura não mudou, este arquivo não precisa de edição nenhuma além do bump de versão da dependência.

### 2.3 StarterKit agora inclui `Link` e `Underline` por padrão (RISCO MÉDIO, exige 1 linha de configuração)

Confirmado via `npm view @tiptap/starter-kit@3` `dependencies`: a v3 do StarterKit passou a embutir `@tiptap/extension-link` e `@tiptap/extension-underline` (v2 não incluía nenhum dos dois). `useTiptapExtensions.ts` já importa e configura seu próprio `Link` logo depois do `StarterKit.configure(...)` — sem desabilitar o do StarterKit, as duas instâncias de `Link` colidem pelo mesmo nome de extension (`link`), e a que "vence" depende de ordem de registro, não de configuração explícita. **Ação obrigatória**: adicionar `link: false` ao objeto passado em `StarterKit.configure({ ... })`, junto dos já existentes `code: false`/`codeBlock: false`. `Underline` não tem conflito (o projeto não configura um Underline próprio) — pode ficar habilitado como funcionalidade nova (Ctrl+U passa a funcionar), não é uma regressão, mas vale mencionar a Marcelo como efeito colateral novo, não pedido.

### 2.4 Extensions de tabela — pacotes ainda existem separados, mas checar consolidação

O guia oficial mostra o exemplo de import `import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'` (um pacote só). Confirmado via `npm view` que os 4 pacotes atuais do projeto (`@tiptap/extension-table`, `-table-row`, `-table-cell`, `-table-header`) **continuam existindo individualmente em v3** (todos com release `3.29.x`) — então a forma atual de importar (4 imports separados) provavelmente continua funcionando sem mudança de código. Ainda assim, **verificar no dia** se os 3 pacotes satélites (`-table-row`/`-table-cell`/`-table-header`) na v3 são pacotes reais ou apenas stubs de compatibilidade que re-exportam do pacote consolidado — isso muda se vale a pena simplificar para o import único documentado ou manter como está (manter como está é a opção mais segura, zero mudança de código nos 2 `CustomTableCell`/`CustomTableHeader` que fazem `.extend({ content: 'inline*' })`).

### 2.5 `@tiptap/pm` — ProseMirror agora é peer dependency exata, não range

Observado no `npm view` dos pacotes v3: muitas versões fixam `@tiptap/pm` numa versão exata (ex. `3.22.4` sem `^`), não um range. **Todas as dependências Tiptap do projeto devem ser bumpadas juntas, na mesma versão exata do `@tiptap/core`** (ex. todas em `3.29.2`) — misturar `@tiptap/core@3.29.2` com uma extension ainda em `3.20.0` é a causa mais provável de erro de peer-dependency ou de tipo incompatível (`Editor` de uma versão não é o mesmo tipo de `Editor` de outra).

### 2.6 API core (`Node.create`, `addAttributes`, `parseHTML`, `renderHTML`, `mergeAttributes`) — sem mudança confirmada

Nenhuma fonte consultada (guia oficial + changelogs) menciona mudança nessa API. Os 3 nodes custom do projeto (`Callout`, `PullQuote`, `ClosingFlourish`) e a extensão de imagem (`SmartImage`) usam exatamente essa superfície — tratados como **baixo risco**, mas ainda cobertos pela validação funcional do §4 (a garantia real vem do QA script rodando cada tipo de node, não de uma leitura de changelog).

---

## 3. Passo a passo de execução (ordem pensada para falhar cedo e barato)

1. **Ler a doc real do componente Vue de `BubbleMenu`/`FloatingMenu` em `tiptap.dev`** antes de escrever qualquer linha — o guia de migração consultado aqui mostra a sintaxe React; a sintaxe exata da nova prop de opções em `@tiptap/vue-3/menus` precisa ser confirmada no dia (não assumir 1:1).
2. **Bump de todas as 11 dependências third-party do Tiptap para a mesma versão exata** (`^3.29.2` → travar como exata se `@tiptap/pm` exigir) em `admin/package.json`, numa tacada só — nunca uma de cada vez, por causa do §2.5.
3. **Reescrever `useTiptapExtensions.ts`**: adicionar `link: false` ao `StarterKit.configure(...)` (§2.3); revisar se os 4 imports de tabela continuam válidos como estão (§2.4) — só trocar para o import único se a v3 realmente exigir.
4. **Reescrever `EditorBubbleMenus.vue` e `EditorFloatingMenu.vue`**: import de `'@tiptap/vue-3/menus'`, trocar `tippy-options` pela API nova confirmada no passo 1, revalidar `should-show` do bubble-menu de tabela.
5. **Rodar `vue-tsc --build`** — é o gate mais barato pra achar quebra de tipo (assinatura de prop mudada, `Commands<ReturnType>` de `tiptap.d.ts` desalinhado, etc.) antes de gastar tempo testando em runtime.
6. **Verificar `@tiptap/suggestion` (§2.2)** — ler o changelog; só tocar em `SlashCommand.ts` se a assinatura de fato mudou.
7. **Rodar `npm run build`** (type-check + `vite build`) completo.
8. **Validação funcional real** — não parar no type-check limpo (ver §4).
9. **Só depois de tudo validado**: atualizar `CLAUDE.md` (linha que hoje fixa Tiptap em 2.x) e `admin/README.md` (nota que hoje aponta pra este arquivo).

---

## 4. Estratégia de validação (segura, não só "typecheck limpo")

Seguindo a tabela de níveis de risco do `CLAUDE.md` (§7, "Estratégia de validação local") — esta é uma mudança de **nível 5+ (componente compartilhado)**, o editor é usado em toda tela de escrita do admin:

1. **Nível 1 (sempre)**: `tsc`/`vue-tsc --build` + `eslint` limpos.
2. **Funcional real, não só tipo**: rodar `frontend/scripts/create-test-post.mjs` (já existe, já exercita **todos** os tipos de node do editor — negrito/itálico, listas, link, `<hr>`, os 5 callouts, pull quote, tabela 3x3, YouTube — ver `docs/backlog.md` item #31) contra o admin local apontando pro Vite 8 + Tiptap 3 novos. Esse script é o teste de regressão mais forte que existe hoje porque já provou (sessão 2026-06-30) achar bugs reais de round-trip HTML que nenhum teste unitário pegou.
3. **Round-trip do servidor**: confirmar que o HTML gerado pelos nodes custom (`renderHTML()` de `Callout`/`PullQuote`/`ClosingFlourish`) continua batendo com o que `backend/src/common/sanitizer.ts` permite — se `renderHTML()` mudar tag/classe por algum efeito colateral da v3 (não esperado, mas não confirmado o contrário), o sanitizer do backend pode silenciosamente descartar o node inteiro. Testar publicando um post real e conferindo o HTML persistido no DynamoDB, não só o preview do admin.
4. **Página pública**: o HTML persistido é depois renderizado em `frontend/app/post/[slug]/postContent.css` — confirmar visualmente (`/post/{slug-de-teste}` real) que callouts, pull quote, tabela e vídeo YouTube renderizam com o mesmo CSS de sempre (o CSS não muda nesta migração, mas depende da estrutura de tags gerada pelo Tiptap continuar idêntica).
5. **Testes automatizados existentes**: `admin/npm test` (Vitest, 43 testes) + `admin/npm run build` (type-check + `vite build`) como gate de CI, mesmo padrão de qualquer outro bump de dependência do projeto.

---

## 5. Plano de rollback

Migração inteira vive numa branch/commit isolado (`admin/package.json` + os ~5 arquivos reescritos). Se a validação funcional (§4.2-4.4) achar regressão sem correção óbvia: `git revert` do commit único de migração — não há mudança de schema de dados (o HTML persistido no DynamoDB não muda de formato só por trocar a versão da lib do editor), então reverter o código do admin é suficiente, sem necessidade de tocar em dado já publicado.

---

## 6. Estimativa e decisão de escopo

- **Esforço real concentrado**: 2 arquivos de reescrita certa (`EditorBubbleMenus.vue`, `EditorFloatingMenu.vue`) + 1 arquivo de config (`useTiptapExtensions.ts`, 1 linha) + verificação (não necessariamente reescrita) de `SlashCommand.ts`.
- **Não é um item de passagem** — precisa de uma sessão própria com o admin rodando localmente contra dados reais (mesma exigência que já valeu para os itens #31/#32 do backlog, que acharam bugs reais só em execução, não em leitura de código).
- **Pré-requisito de ambiente**: `contexto/creds.txt` (Cognito real) pro `create-test-post.mjs` funcionar — mesmo requisito já documentado em `memory/project_admin_test_post_tooling.md`.
- **Decisão de Marcelo pendente**: nenhuma ação até ele pedir explicitamente para executar este plano (protocolo padrão do projeto — Analysis vs Action).

---

## Fontes consultadas (2026-08-03)

- [Upgrade v2 to v3 | Tiptap Collaboration Docs](https://tiptap.dev/docs/guides/upgrade-tiptap-v2)
- [Migration guide Tiptap 2 → Tiptap 3 | Mantine](https://mantine.dev/guides/tiptap-3-migration/)
- [@tiptap/extension-bubble-menu changelog](https://tiptap.dev/docs/resources/changelog/extension-bubble-menu)
- [@tiptap/extension-floating-menu changelog](https://tiptap.dev/docs/resources/changelog/extension-floating-menu)
- `npm view` contra o registry real (2026-08-03) para `@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/extension-bubble-menu`, `@tiptap/extension-floating-menu`, `@tiptap/extension-table` — versões e `dependencies`/`peerDependencies` exatas citadas acima.
