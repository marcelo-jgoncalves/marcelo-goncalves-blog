# Active Investigations — Rastreamento em Tempo Real

Arquivo para rastrear investigações em progresso. Ajuda a manter continuidade de uma tentativa para outra.

---

## ✅ Resolvida: PostCard e destaques da home sem imagem + regressão e2e em /artigos

**Status:** ✅ RESOLVIDA — Tentativa #1
**Data:** 2026-06-15

### ANTES
- **Estado atual:** usuário pediu "com excessão dos cards de /o-projeto, todos os cards devem exibir sua respectiva imagem" e, em seguida, "na home, a imagem da postagem de destaque na hero e também a imagem da postagem de destaque de IA também tem que ser mostradas".
- **Modelo mental:** `PostCard` (sessão 30) foi redesenhado para NÃO mostrar imagem (gradiente `GRADIENT_VARIANTS` por slug, decorativo). `/o-projeto` não usa `PostCard` (markup próprio `op-tl-card`/`op-rm-card`/`op-adv-card`) — exclusão do usuário já é automática. Home tem dois destaques com markup próprio (`.home-hf-cover` no hero, `.home-ia-big-cover` na seção IA) que também só tinham gradiente + tags, sem `<img>`.
- **Mudança mínima:**
  - `PostCard.tsx`: dentro de `.pc-img`, renderiza `<ResponsiveImage src={post.imagem_destaque_url} fill lqip={post.imagem_lqip_base64}>` quando `imagem_destaque_url` existe; gradiente permanece como fallback/background para posts sem imagem.
  - `app/page.tsx`: `HomePost` ganha `imagem_destaque_url`, `imagem_destaque_alt_text`, `imagem_lqip_base64`. `.home-hf-cover` (hero) e `.home-ia-big-cover` (big IA) ganham o mesmo `<ResponsiveImage fill>` condicional — hero com `priority` (LCP). Tags/badges já tinham `z-index: 1`, então continuam visíveis sobre a imagem.
- **Teste:** script Playwright temporário (`check-home-images.mjs`, removido após uso) — `naturalWidth` de `.home-hf-cover img` e `.home-ia-big-cover img` + screenshots.

### DEPOIS
- **Resultado:** ambas as imagens (`naturalWidth: 612`) renderizam corretamente, com tags/badges sobrepostos. PostCard renderiza imagem real em `/`, `/artigos`, `/busca`, `/categoria/[slug]`, `RelatedPostsSection`, `PopularPostsSection`, not-found — confirmado via screenshot em sessão anterior (gradiente preservado como fallback).
- **Regressão detectada:** `e2e/artigos.spec.ts` (`beforeEach` com `page.goto('/artigos', { waitUntil: 'networkidle' })` compartilhado por 11 testes) passou a falhar sob paralelismo padrão do Playwright local (6 workers) — cada `/artigos` agora carrega ~12 imagens reais via CloudFront, e `networkidle` nunca estabiliza dentro de 30s com 6 page-loads concorrentes.
- **Mudança mínima (teste):** `beforeEach` trocado de `waitUntil: 'networkidle'` para `waitUntil: 'load'` (padrão já usado na maioria de `home-layout.spec.ts`; `networkidle` é anti-pattern reconhecido do Playwright para páginas com atividade de rede contínua).
- **Validação:**
  - `--project=chromium --workers=1` e `--project=firefox --workers=1` (replica `workers: process.env.CI ? 1 : undefined` do `playwright.config.ts`, ou seja, o que roda no CI): **11/11 passam** em ambos (22.5s / 27.3s).
  - Com 6 workers locais (chromium+firefox, 22 testes), `'load'` sozinho NÃO elimina as falhas (18/22 falham, igual a `networkidle`) — confirmando que o estouro de 30s é artefato de alta concorrência contra `next dev`/Turbopack local, não um problema do CI (que usa `workers: 1`).
  - 81/81 testes Jest do frontend, `tsc --noEmit` limpo.
  - `e2e/post.spec.ts` (9/9) e `e2e/smoke.spec.ts` (2/2) também passam com `--workers=1`.

### APRENDIZADO
- `networkidle` é frágil para páginas com muitos recursos externos (imagens via CloudFront) sob paralelismo — `'load'` é a escolha recomendada e mais robusta; nenhuma asserção em `artigos.spec.ts` depende de imagens carregadas, então a troca é segura.
- **Débito técnico pré-existente descoberto (não corrigido nesta sessão):** ao rodar a suíte e2e mais ampla para validar este fix, `e2e/home-layout.spec.ts` (5/5), `e2e/busca.spec.ts` (2/11) e `e2e/categoria.spec.ts` (3/9) falham procurando seletores de um DOM antigo (`.home-sidebar`, `.home-layout`, `.categories-grid`, `.cta`, `.post-card__meta-row`, `.page-hero`, `.hero-title`, `.blog-sidebar`, `.op-header`) que não existem mais após os rewrites "redesign 2026". Confirmado via `git stash` que `home-layout.spec.ts` já falha (5/5) no HEAD do `develop`, sem relação com esta mudança. Precisa de sessão dedicada para atualizar esses specs ao DOM atual.

---

## ✅ Resolvida: Imagens das postagens não aparecem (imagens inline no corpo do post)

**Status:** ✅ RESOLVIDA — Tentativa #1
**Data:** 2026-06-15

### ANTES
- **Estado atual:** usuário reportou "nem localmente nem diretamente pela url do cloudfront as imagens das postagens não estão aparecendo" — relato separado do fix anterior (`/sobre`), referindo-se a posts (`/post/[slug]`).
- **Modelo mental:** capa do post (`.post-cover-frame`) usa `ResponsiveImage` (OK por design). Imagens inline no corpo vêm de `conteudo_html` (HTML bruto do Tiptap, renderizado via `dangerouslySetInnerHTML` em `.post-content`), processado por `processFullPostContent()` (`frontend/lib/postUtils.tsx`).
- **Hipótese:** mesma causa raiz do fix anterior (URL "bare" sem sufixo de variante → 403 → ORB). Para confirmar, escaneei `conteudo_html` de todos os posts via `aws dynamodb scan` (profile `claude-dev`, tabela `marcelo-goncalves-blog-dev-posts`).
- **Dado concreto:** 3 posts têm `<img>` no corpo — `testeerroedicao`, `teste-com-imagem-no-corpo`, `nononon-nonononono` — todos com `src="https://dsns2wusdrj9z.cloudfront.net/media/{id}.webp"` (SEM sufixo `-1280`). Os outros 10 posts têm 0 `<img>` no corpo (não é bug — simplesmente não têm imagens inline).
- **Teste:** Playwright em `localhost:3000/post/nononon-nonononono`, checando `.post-content img` → `naturalWidth: 0`, `requestfailed: net::ERR_BLOCKED_BY_ORB` na URL bare. Confirmado.
- **Causa raiz do dado:** `EditorView.vue:228-230` (`onImageUploaded`) já gera `${baseUrl}-1280.webp` corretamente para uploads novos — esses 3 posts são dados antigos, salvos antes desse fix (ou inseridos por outro fluxo), com a URL bare persistida em `conteudo_html`.
- **Mudança mínima:** em vez de migrar dados (re-editar 3 posts), corrigir na renderização — `processFullPostContent()` já usa cheerio para manipular o DOM do post. Adicionado `normalizeMediaImageSrc()` (export em `postUtils.tsx`): para `<img src>` que aponta para `/media/...` SEM sufixo `-480/-768/-1280`, insere `-1280` antes da extensão (mesma variante que `ResponsiveImage`/`EditorView` usam). URLs já corretas (com sufixo) ou fora de `/media/` não são alteradas. Aplicado em `$('img').each(...)` logo após o `cheerio.load()`.

### DEPOIS
- **Resultado:** os 3 posts renderizam a imagem inline corretamente, local e (por construção — mesma lógica server-side) via CloudFront:
  - `nononon-nonononono`: `naturalWidth: 612, naturalHeight: 377`, src reescrito para `...-1280.webp`, `failed: none`.
  - `teste-com-imagem-no-corpo`: `naturalWidth: 1280, naturalHeight: 731`, `failed: none` (falhas do YouTube embed são ruído não relacionado).
  - `testeerroedicao`: `naturalWidth: 1024, naturalHeight: 512`, `failed: none`.
- **Diff vs esperado:** nenhum.
- **Validação:** 5 novos testes unitários em `__tests__/postUtils.test.ts` (normalização de URL + integração via `processFullPostContent`) — 81/81 testes do frontend passam. `tsc --noEmit` limpo.

### APRENDIZADO
- **Terceira ocorrência da mesma causa raiz** (URL "bare" do CloudFront sem sufixo de variante → 403 → ORB), agora dentro de HTML bruto persistido (`conteudo_html`), não numa prop de componente — por isso a correção foi na camada de processamento server-side (`processFullPostContent`), não num componente React.
- Como `EditorView.vue` já grava `-1280.webp` corretamente para uploads novos, a correção em `postUtils.tsx` é principalmente uma rede de segurança para os 3 posts antigos com dado legado — mas também protege contra qualquer URL bare colada manualmente no editor.
- "Imagens das postagens" (este relato) ≠ "cards"/"foto do hero" (relato anterior) — são bugs distintos com a mesma causa raiz, em locais diferentes do código.

---

## ✅ Resolvida: Imagens não aparecem (/sobre — foto do hero)

**Status:** ✅ RESOLVIDA — Tentativa #1
**Data:** 2026-06-15

### ANTES
- **Estado atual:** usuário reportou "as imagens não estão aparecendo, nem nos cards nem a minha foto no hero da página sobre" (localhost:3000, dev server rodando).
- **Modelo mental:** `ResponsiveImage` (`frontend/components/ui/ResponsiveImage.tsx`) é o padrão obrigatório para imagens de conteúdo — faz `toBasePath()` (strip de extensão) e monta `<picture>` com variantes `-480/-768/-1280.avif/.webp` geradas pelo imageProcessor.
- **Hipótese:** `app/sobre/page.tsx:177` renderizava `<img src={fotoUrl}>` (raw `<img>`, não `ResponsiveImage`), onde `fotoUrl = author.foto_avatar_url` é uma URL "bare" (`.../media/1765152117835-mq4gxg-foto-perfil-at.webp`) que não corresponde a nenhum objeto real no S3 (só existem variantes `-480/-768/-1280`). CloudFront retorna 403 → Chrome bloqueia via ORB (`net::ERR_BLOCKED_BY_ORB`) → `naturalWidth: 0`.
- **Mudança mínima:** trocar o `<img>` raw por `<ResponsiveImage className="sobre-pf-slot" src={author.foto_avatar_url} alt={nome} priority />` quando `author.foto_avatar_url` existe; manter `<img src={FALLBACK_PHOTO}>` (PNG local sem variantes) no caso contrário. Removida a variável `fotoUrl` (não usada mais).
- **Teste:** Playwright contra `localhost:3000/sobre`, lendo `naturalWidth`/`naturalHeight`/`currentSrc` de `.sobre-pf-slot` + listener `requestfailed`.

### DEPOIS
- **Resultado:** `naturalWidth: 1280, naturalHeight: 1300, src: '.../media/1765152117835-mq4gxg-foto-perfil-at-1280.avif'`, `failed requests: none`. Screenshot confirma foto renderizando corretamente (espelhada via `scaleX(-1)`, conforme design).
- **Diff vs esperado:** nenhum — comportamento exatamente o previsto pela hipótese.

### APRENDIZADO
- **Causa raiz confirmada:** qualquer `<img src={...foto_avatar_url}>` ou `<img src={...imagem_destaque_url}>` que use a URL "bare" do DynamoDB diretamente (sem `ResponsiveImage`/`toBasePath()`) vai 403 no CloudFront, pois o imageProcessor só grava variantes com sufixo `-480/-768/-1280`.
- **Segunda ocorrência da mesma causa raiz:** `admin/src/views/AuthorEditView.vue:117` (preview do avatar no card "Foto de Perfil") tinha o mesmo padrão (`<img :src="form.foto_avatar_url">`). Corrigido aplicando o mesmo padrão já usado em `EditorView.vue` (`featureImagePreviewUrl`): computed `avatarPreviewUrl` = basePath + `-480.webp`.
- **"Cards" do relato do usuário:** nenhum outro `<img>` em `/sobre` (cards de empresas, cards de certificação — confirmados OK via screenshot), `/servicos`, PostCard (`/`, `/artigos`, `/o-projeto` — gradiente por design, sem imagem) ou na página de post (via `ResponsiveImage`, OK) apresentou problema em localhost. O card mais provável referenciado é o preview "Foto de Perfil" no admin (`AuthorEditView.vue`), já corrigido junto. Caso o usuário se refira a outro local, será necessário levantar nova hipótese.
- **Validação:** `tsc --noEmit` limpo (frontend + admin), testes unitários 76/76 (frontend) e 16/16 (admin). `npm run lint` no frontend falha com erro pré-existente de tooling ("Invalid project directory... frontend\lint") não relacionado — confirmado reproduzível mesmo com `git stash` (HEAD limpo). `npm run lint` no admin tem 23 erros pré-existentes (nenhum introduzido por esta mudança — `AuthorEditView.vue:50` `catch (error: any)` já existia antes).

---

## 🔍 Investigação Ativa: Eyebrow Gradient em NewsletterWidget

**Status:** ⏸️ PAUSADA — Deixar para próxima sessão
**Iniciado:** 2026-05-22  
**Última Tentativa:** #1  
**Próximo Passo:** Deixado em pausa por request do user 2026-05-22

### Modelo Mental Atual

**O Que FUNCIONA:**
- ProjetoWidget mostra eyebrow gradient fade (branco → transparente)
- CSS está idêntico entre os dois (verificado via computed styles)
- Componentes renderizam ambos em flex containers

**O Que NÃO FUNCIONA:**
- NewsletterWidget NOT mostra o fade effect visualmente
- Apesar de computed styles idênticos
- HTML estrutura é praticamente igual

**Dado Concreto:**
```
Debug output (eyebrow-result.json):
- Newsletter ::before: background = linear-gradient(90deg, rgb(255, 255, 255), rgb(255, 255, 255) 50%, rgba(0, 0, 0, 0))
- Projeto ::before: background = linear-gradient(90deg, rgb(255, 255, 255), rgb(255, 255, 255) 50%, rgba(0, 0, 0, 0))
✓ Idêntico no computed style
❌ Visualmente diferente

Tentativa #1 resultado:
- Remover text-align: center NÃO funcionou
- Descoberta: ::before blob com filter: blur(60px) havia sido removido
- Restaurado blob, problema ainda persiste
```

### Modelo Mental em Evolução

**Suposições Testadas:**
1. ❌ text-align: center interferia → Não era o problema
2. ❌ Blob decorativo afetava z-index → Restaurado, problema persiste

**Suposições NÃO Testadas:**
- [ ] Sub-pixel rendering difere entre contextos
- [ ] Filter ou blend-mode de elemento pai afeta pseudo-element
- [ ] Stacking context diferente entre sidebar e footer
- [ ] Renderização hardware accelerated diferente
- [ ] Anti-aliasing aplica-se diferentemente

### Próxima Tentativa (#2)

**Investigação Necessária:**
- [ ] Verificar ALL computed styles de elementos pais em ambos contextos
- [ ] Comparar position, display, overflow, filter, transform, blend-mode
- [ ] Verificar z-index e stacking context de cada parent chain
- [ ] Testar: aumentar height de 1px para 2px (visibilidade)
- [ ] Testar: mudar gradient para cor sólida (isolate gradient issue)

**Hipótese a Testar:**
- Diferença está não no CSS do eyebrow/::before
- Mas no contexto de renderização do parent container
- Newsletter está em contexto que afeta pseudo-element rendering de forma diferente

---

## 📋 Template Para Próxima Tentativa

Antes de agir novamente, preencher:

```markdown
### Tentativa #[N]

ANTES DE AGIR:
- Estado atual do problema: [resumo]
- Meu modelo mental: [o que acho que é]
- Hipótese: [se X então Y]
- Mudança mínima: [exatamente o quê]
- Teste: [como verificar]

DEPOIS DE AGIR:
- Resultado: [funcionou/não funcionou]
- Diferença vs esperado: [qual foi]

APRENDIZADO:
- Modelo mental atualizado: [mudou o quê]
- Por que falhou: [qual era suposição errada]
- Próxima hipótese: [baseado no novo dado]
```

---

## Regras Para Esta Investigação

1. **Uma mudança por tentativa** — Nunca múltiplas mudanças
2. **Testar após cada mudança** — Antes de próxima ação
3. **Preencher template** — Obrigatório antes de seguir
4. **Incrementar certeza** — Cada tentativa deveria aumentar confiança em hipótese
5. **Se certeza cai** — Parar agir, investigar dados mais
6. **Sem reset/revert** — Exceto como último recurso, após análise completa

---

## Histórico de Tentativas

### ✅ Tentativa #1: Remove text-align: center
- **Data:** 2026-05-22
- **Resultado:** ❌ Não funcionou
- **Aprendizado:** Descobriu que blob ::before havia sido removido. Restaurado.
- **Impacto:** Removeu uma pista vermelha falsa, descobriu asset faltante
- **Modelo mental depois:** Problema não é CSS simples, é algo mais profundo

---

## 🔍 Investigação Ativa: PopularPostsWidget - Espaçamento Excessivo no Final

**Status:** ❌ Falha - Tentativa #2  
**Iniciado:** 2026-05-22  
**Última Tentativa:** #2 (margin-bottom na lista)  

### Modelo Mental Atual

**O Que FUNCIONA:**
- ProjetoWidget: espaçamento final consistente
- ServiceCallout: espaçamento final consistente
- PopularPostsWidget: AINDA tem espaçamento maior no final

**O Que NÃO FUNCIONA:**
- PopularPostsWidget espaçamento no final maior que os outros widgets

**Dados Concretos:**
```
Todos os containers:
- padding: var(--space-4) = 32px
- gap: var(--space-1) = 8px

ProjetoWidget último elemento:
- Button padding: 0
- Height: 56px

ServiceCallout último elemento:
- Button padding: 0
- Height: 64px

PopularPostsWidget último elemento:
- List <ul> com margin-bottom: var(--space-3) = 24px (adicionado na tentativa #2)
- Tem 5 items × padding: var(--space-3) 0 = 24px cada
```

### Tentativa #1: Reduzir link padding de 26px para var(--space-3)
- ❌ Não funcionou

### Tentativa #2: Adicionar margin-bottom: var(--space-3) na lista
- ❌ Não funcionou
- **Problema:** Testei código e commitei SEM verificar se realmente funcionou

### Suposições Que Falharam:
1. ❌ Padding do link era o problema
2. ❌ Margin-bottom da lista seria suficiente

### Modelo Mental Reconstruído:

**Suposição anterior:** O espaçamento era controlado por padding/margin dos elementos.

**Nova evidência:** Mesmo após 2 tentativas, problema persiste. Isso sugere:
- O problema pode estar em altura/altura mínima dos elementos
- Ou a altura TOTAL do conteúdo da lista é tão grande que visualmente parece haver mais espaço
- Ou há outra propriedade CSS que não identifiquei (height, flex-basis, min-height?)

### Próximas Hipóteses a Testar:
- [ ] Verificar se há `min-height` no container ou na lista
- [ ] Verificar `flex-shrink`/`flex-grow` nas propriedades de flex
- [ ] Validar se o padding dos items (24px cada × 5) está REALMENTE como esperado
- [ ] Testar reduzir o padding dos items ainda mais (ex: var(--space-2) = 16px)
- [ ] Comparar altura TOTAL da lista vs altura TOTAL do botão nos outros widgets

---

## 🔍 Investigação Ativa: NewsletterWidget Eyebrow - Fade Effect Não Funciona

**Status:** ❌ Falha - Tentativa #1 (z-index)  
**Iniciado:** 2026-05-22  
**Últi Tentativa:** #1

### Modelo Mental Atual

**O Que É Esperado:**
- Eyebrow linha com gradient: `currentColor` (sólido) → `transparent`
- Resultado visual: linha que "desaparece" gradualmente para a direita (fade effect)
- ProjetoWidget: funcionando ✓
- NewsletterWidget: linha existe mas SEM fade effect ✗

**O Que FUNCIONA:**
- A linha está sendo renderizada
- Está visível no NewsletterWidget

**O Que NÃO FUNCIONA:**
- O fade/gradient effect não está aplicado
- Parece uma linha sólida, não com gradient

**Código do Eyebrow:**
```css
.eyebrow::before {
  width: 32px;
  height: 1px;
  background: linear-gradient(
    90deg,
    currentColor,      /* branco no NewsletterWidget */
    currentColor 50%,   /* mantém branco até 50% */
    transparent        /* desaparece a partir de 50% */
  );
}
```

**Tentativa #1: Adicionar z-index ao eyebrow**
- Hipótese: blob decorativo estava obscurecendo gradient
- Resultado: ❌ Não funcionou
- **Aprendizado:** z-index não era o problema

### Suposições Que Falharam:
1. ❌ z-index/stacking context estava interferindo

### Novas Hipóteses a Investigar:
- [ ] `currentColor` não está sendo passado como white?
- [ ] Filter ou propriedade CSS está afetando rendering do gradient?
- [ ] Eyebrow está recebendo `color` prop corretamente?
- [ ] Há um CSS que sobrescreve o `background: linear-gradient`?
- [ ] O fade efeito requer algo mais que apenas o CSS (como será renderizado)?
- [ ] ProjetoWidget tem algo DIFERENTE que faz funcionar?

### Próxima Tentativa (#2):
- Comparar CSS entre ProjetoWidget.eyebrow e NewsletterWidget.eyebrow
- Verificar se hay alguma propriedade que está bloqueando o gradient
- Validar se color="white" está sendo passada corretamente

### Tentativa #3: Reduzir padding dos items de var(--space-3) para var(--space-1)
- **Data:** 2026-05-22
- **Análise:** 
  - PopularPostsWidget: 5 items × padding var(--space-3) 0 (24px) = 240px total
  - ProjetoWidget: 1 button = 56px total
  - ServiceCallout: 1 button = 64px total
  - **PopularPostsWidget tinha 4.2x mais altura de conteúdo**
  - Isso criava ilusão visual de espaço maior no final

- **Solução:** 
  - Mudar padding dos items de var(--space-3) (24px) para var(--space-1) (8px)
  - Nova altura: 5 × 16px = 80px (similar aos outros widgets)
  
- **Aprendizado:**
  - Problema NÃO era margin/padding da lista ou container
  - Era a ALTURA TOTAL do conteúdo que tornava a proporção desproporcionada
  - Número concreto: 240px → 80px reduz a percepção visual de espaçamento final
  - **Próximo passo:** Verificar visualmente se resolveu

---

## 🔍 Investigação: Blob Atmosférico no NewsletterWidget

**Status:** ⏸️ PAUSADA — Deixar para próxima sessão
**Iniciado:** 2026-05-22
**Última Tentativa:** #4 (posição inferior direito)

### O que funciona em outros widgets:
- **PopularPostsWidget:** blob no canto superior esquerdo ✅ VISÍVEL
- **ServiceCallout:** blob no canto superior direito ✅ VISÍVEL
- **TOC:** blob no canto superior direito ✅ VISÍVEL

### O que NÃO funciona no NewsletterWidget:
- Tentativa #1: Centro com `top: 50%; transform: translate(-50%, -50%)` ❌
- Tentativa #2: Canto inferior esquerdo ❌
- Tentativa #3: Topo direito (sobrepôs com `::before` existente) ❌
- Tentativa #4: Canto inferior direito (`bottom: -40px; right: -40px`) ❌ PAUSADA

### Dados concretos coletados:
```css
/* NewsletterWidget TEM ::before blob já */
.widget-newsletter::before {
  top: -40px;
  right: -40px;
  background: rgba(91, 139, 150, 0.20);
  filter: blur(60px);
}

/* Tentativa com ::after */
.widget-newsletter::after {
  bottom: -40px;
  right: -40px;
  background: rgba(255, 255, 255, 0.3);
  filter: blur(60px);
}
```

### Hipóteses para próxima investigação:
1. **Z-index:** elementos filhos têm `z-index: 1`, talvez `::after` fique atrás invisível
2. **Cor:** branco `rgba(255, 255, 255, 0.3)` talvez insuficiente sobre azul `var(--accent)`
3. **Posição:** `bottom` no newsletter pode ter comportamento diferente (container overflow/height)
4. **Renderização:** blur + opacidade combinados tornam imperceptível

### Próxima ação:
- Aumentar z-index a `::after` para valor > 1
- OU aumentar opacidade para `0.5+`
- OU comparar estrutura HTML do ServiceCallout vs NewsletterWidget para entender diferença
