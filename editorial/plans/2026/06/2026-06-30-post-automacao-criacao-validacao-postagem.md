---
id: POST-PLAN-2026-025
schema_version: "1.0"
title: "Post standalone: \"Testei meu próprio CMS como um usuário real testaria — com um robô\""
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

<!-- Migrado de projects/publishing-content/postagens/post-automacao-criacao-validacao-postagem.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post standalone: "Testei meu próprio CMS como um usuário real testaria — com um robô"

## Títulos alternativos
- "Por que parei de testar meu editor de posts manualmente (e o que isso revelou sobre cache)"
- "Login, digitação, upload, publicação: automatizei o ciclo completo do meu CMS com Playwright"

## Tese central

Manter um CMS próprio (não um SaaS de terceiros) significa que você também é responsável por testar a experiência de quem escreve nele — e isso é fácil de negligenciar porque "é só o admin, ninguém de fora vê". O post documenta uma ferramenta real: um script Playwright que simula um usuário fazendo login, escrevendo um post completo no editor Tiptap, fazendo upload de imagem e publicando — e depois confere o resultado direto na borda (CloudFront), não só no banco de dados. A tese central é que testar a API de salvar conteúdo não é o mesmo que testar o editor: a maior parte dos bugs reais mora exatamente na camada entre "o que o usuário digita" e "o que é persistido e servido depois".

Camada adicional da tese (adicionada numa segunda rodada de evolução do script, mesma sessão): nem "está no HTML retornado pelo servidor" é o mesmo que "está realmente visível pra um leitor de verdade". Um nó pode sobreviver à sanitização e ainda assim aparecer quebrado — CSS que não casou, imagem que não decodificou, JSON-LD malformado que nenhum `string.includes()` detecta porque o texto "parece certo" mas não é um JSON válido. A validação evoluiu de "o texto X aparece na resposta HTTP" para "o navegador real, depois de aplicar CSS e JS, mostra um elemento visível, com conteúdo, no tamanho de tela certo" — e para isolar em qual ponto da pipeline (admin → CloudFront → browser do leitor) uma eventual perda acontece, comparando a mesma contagem de elementos nas duas pontas.

## Por que importa

1. **Todo blog/produto com CMS próprio tem esse problema, em escala menor ou maior** — não é exclusivo de quem usa Tiptap; é qualquer editor rich-text com sanitização de HTML no meio do caminho.
2. **"Funciona no meu teste manual" e "funciona de verdade" são afirmações diferentes** — sanitização de HTML, upload assíncrono e cache de CDN são exatamente os tipos de bug que passam batido numa olhada rápida no browser, porque o sintoma só aparece depois (conteúdo sumiu, imagem não carregou, página ficou em cache velho).
3. **A validação não pode parar no "salvou com sucesso"** — o post mostra por que checar a resposta HTTP real da página pública (headers de cache, HTML renderizado) pegou um bug que nenhum teste no admin teria revelado.

## Storytelling sugerido

Abra pela frustração concreta, não pela solução: a cada mudança no editor (um node novo do Tiptap, uma regra de sanitização, um ajuste no upload), a única forma de saber se continuava funcionando era abrir o admin, logar, escrever um post de teste à mão e olhar visualmente. Na quinta vez repetindo esse roteiro manual, ficou claro que o tempo gasto testando já tinha superado o tempo que levaria escrever um teste automatizado.

Segundo movimento: mostrar que a automação não chama a API direto — ela simula o usuário de verdade, digitando no editor com os mesmos atalhos e input rules que um humano usaria (`## ` pra heading, `1. ` pra lista numerada, `Ctrl+B` pra negrito), fazendo upload de arquivo real, navegando entre rascunho e publicação como qualquer edição real faria. Explicar por que isso importa: testar só a API com um HTML escrito à mão dá falsa confiança — testa o que você acha que o editor produz, não o que ele produz de fato.

Terceiro movimento, a virada do post: validar que o toast de sucesso apareceu não é o fim do teste. Depois de publicar, o script faz uma requisição HTTP direta pra página pública e confere o que só existe na borda — `Cache-Control`, `X-Cache`, se a variante de imagem otimizada já está acessível, se o post aparece na listagem. Foi exatamente esse tipo de checagem, numa investigação anterior, que revelou que a rota de post nunca estava entrando no ISR do Next.js — toda visita era SSR puro, sem cache possível no CloudFront. Um teste manual no browser não pega isso; o `curl` direto na resposta, sim.

Quarto movimento, a continuação natural da virada anterior: mesmo a checagem de borda (`fetch` + headers) tem um ponto cego — ela prova que o HTML contém o texto certo, não que um leitor de verdade veria algo funcional. A evolução seguinte do script abre a página pública num browser real e pergunta, elemento por elemento, três coisas que `string.includes()` nunca poderia responder: está visível (tamanho e display reais, não só presente no DOM)? tem conteúdo dentro? e — comparando com a mesma contagem extraída do HTML recarregado no admin, antes de qualquer cache de CDN — a contagem bateu, ou algo se perdeu especificamente na viagem entre salvar e exibir? Essa comparação de duas fontes é o que transforma "achou um bug" em "achou *onde* o bug está": se a imagem existe no admin com 3 variantes mas chega ao público com 0, o problema não está no editor, está no pipeline de cache/imagem entre os dois pontos.

Quinto movimento, mais curto: a mesma validação roda em dois viewports (375px e 1440px) porque um nó pode estar perfeitamente visível no desktop e quebrado no mobile — overflow de tabela, iframe de vídeo cortado — e isso só aparece testando os dois, não um.

Fechamento: nomear a decisão de design de tratar anomalias como "achados" registrados (texto com contexto), não como falhas que travam o script — e por que essa distinção importa quando quem vai ler o relatório é você mesmo, semanas depois.

## Provas e exemplos reais

- Trecho real do script simulando digitação via input rule, não API: `await page.keyboard.type('## Por que o cold start ainda pesa no bolso', { delay: 4 });` seguido de `Enter` — Tiptap reconhece o `##` e converte em heading, do mesmo jeito que um humano digitando.
- Upload real de imagem exercitando o pipeline completo: `await page.locator('.file-input-hidden').setInputFiles(TEST_IMAGE);` — passa pela Lambda `imageProcessor` de verdade, não um mock.
- Validação de borda pós-publicação: `const res = await fetch(`${PUBLIC_URL}/post/${slug}`); log(`Cache-Control: ${res.headers.get('cache-control')} | X-Cache: ${res.headers.get('x-cache')}`);`
- Achado real correlato (de outra investigação, citável como prova de que esse tipo de checagem vale a pena): `/post/[slug]` não tinha `generateStaticParams`, então `export const revalidate = 60` era um no-op silencioso — toda visita era SSR puro, `Cache-Control: no-store`, `X-Cache: Miss` em 100% das requisições antes do fix.
- Padrão de "achado, não falha": cada anomalia detectada (timeout de modal, HTML recarregado sem o nó esperado, badge de status divergente) é registrada como string num array e aparece no relatório final em Markdown — o script nunca usa `throw` pra esses casos.
- Checagem de visibilidade real, não só presença no DOM, no mesmo padrão de outro script já existente no projeto (`inspect-card-spacing.js`) que media espaçamento real via `getBoundingClientRect`: `const visible = (el) => { const r = el.getBoundingClientRect(); const cs = window.getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'; };`
- Imagem "presente no HTML" não é o mesmo que "carregou de verdade": `if (!result.coverImage.complete || result.coverImage.naturalWidth === 0) finding('Imagem de destaque não decodificou...')` — `naturalWidth` só é maior que zero se o navegador efetivamente baixou e decodificou o arquivo de imagem.
- JSON-LD validado como JSON de verdade, não como substring: `try { return JSON.parse(s.textContent); } catch { return { __parseError: true }; }` — um script malformado que "contém a palavra BlogPosting" mas não fecha as chaves corretamente passaria num `html.includes('BlogPosting')`, mas não passa nesse parse.
- Comparação de duas fontes pra isolar onde a perda acontece: o mesmo mapa de seletores (`NODE_CHECKS`) conta os nós tanto no HTML recarregado do admin (via `new DOMParser().parseFromString(html, 'text/html')`) quanto no DOM real da página pública; se a contagem pública for menor, o achado nomeia explicitamente a divergência: `` `"${label}": admin tinha ${adminCount} nó(s) pós-save, público renderizou só ${data.count}` ``.
- Validação rodando em dois viewports reais, não simulados via CSS: `const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 375, height: 812 } };` com `browser.newPage({ viewport })` — cada achado é etiquetado (`[mobile]`/`[desktop]`) pra diferenciar quebra responsiva de quebra geral.
- Erros de rede silenciosos deixam de ser invisíveis: `page.on('response', (res) => { if (res.status() >= 400) finding(...) })` captura qualquer asset, imagem ou chamada de API que falhe durante o carregamento, mesmo sem lançar exceção JS.

## Conceitos a explicar

- **Sanitização de HTML server-side**: todo HTML vindo do editor passa por uma allowlist de tags/atributos antes de ser persistido — o objetivo do teste é confirmar que cada node do editor sobrevive a essa camada, não só que ele aparece na tela do admin.
- **Round-trip de conteúdo**: salvar e depois reabrir o mesmo post pra comparar o que voltou do servidor com o que foi digitado — pega perda silenciosa de dados que um "salvou com sucesso" não revela.
- **ISR (Incremental Static Regeneration) e cache de borda**: a diferença entre uma página dizer que tem `revalidate: 60` no código e o CDN de fato estar servindo essa página do cache — só visível inspecionando os headers HTTP reais da resposta.
- **Teste como simulação de usuário vs. teste como chamada de API**: testar a API de salvar conteúdo verifica o contrato de dados; simular o usuário no editor verifica a experiência real, incluindo tudo que existe entre o teclado e o banco.
- **"Presente no HTML" vs. "visível pro leitor"**: dois níveis de verificação distintos — um nó pode sobreviver à sanitização e estar tecnicamente na marcação, e ainda assim não aparecer pra ninguém, por uma regra de CSS que zera a altura, um seletor que não casou, ou um asset que falhou silenciosamente ao carregar.
- **Isolar a causa comparando a mesma métrica em dois pontos da pipeline**: em vez de só constatar "o elemento sumiu", contar o mesmo tipo de nó logo após salvar (fonte: admin) e de novo depois de todo o caminho até o leitor (fonte: página pública) aponta exatamente em qual trecho do percurso a perda aconteceu — sanitização, cache de CDN ou renderização no cliente.
- **Bug específico de viewport**: um elemento pode estar perfeitamente correto em uma largura de tela e quebrado em outra (overflow, corte, sobreposição) — testar um único viewport dá falsa sensação de cobertura completa.

## Estrutura sugerida (H2s)

1. O problema: testar um CMS próprio não escala manualmente
2. Por que simular o usuário em vez de chamar a API direto
3. A parte que mais surpreendeu: validar na borda, não só no banco
4. "Está no HTML" não é "está visível" — entrando no DOM renderizado de verdade
5. Comparar duas fontes pra achar onde a perda aconteceu, não só que ela aconteceu
6. Achados não são bugs até alguém decidir que são
7. O que essa disciplina já revelou (e o que ainda falta cobrir)

## Fecho / CTA

"Não é sobre Playwright — é sobre tratar o próprio painel administrativo com o mesmo rigor que você trata a aplicação que ele alimenta. Se você mantém um CMS ou painel interno, mesmo pequeno, vale o mesmo princípio: simule o usuário real, valide na borda, e deixe o relatório contar a história do que mudou."

## Fonte interna

`marcelo-goncalves-blog/frontend/scripts/create-test-post.mjs` (script completo, evoluído em duas rodadas na mesma sessão, 2026-06-30: primeiro criação + validação de borda via `fetch`, depois validação de DOM renderizado real via `page.evaluate`, comparação admin-vs-público e checagem mobile/desktop) + `marcelo-goncalves-blog/frontend/scripts/inspect-card-spacing.js` (script-irmão que inspirou a técnica de `getBoundingClientRect`/`getComputedStyle`, citável como prova de que o padrão já existia no projeto pra outro propósito) + investigação de cache/ISR citada como prova cruzada: `marcelo-goncalves-blog/docs/auditoria-performance/04-perf-cwv-pos-fix-isr.md`.

## Notas de escrita

- Evitar tom de "tutorial de Playwright" — o gancho é a disciplina de testar o próprio CMS como produto, não a ferramenta específica usada.
- Citar números/trechos de código reais do script, nunca abstrair em "imagine um editor que...".
- Pode linkar com o tema mais amplo de "verificar efeito, não intenção" (presente também na série de auditoria de engenharia) — mesmo princípio aplicado a teste de conteúdo em vez de segurança/performance.
- Cuidado para os H2s 4 e 5 não soarem como apêndice colado depois — enquadrar como aprofundamento natural da mesma pergunta do H2 3 ("validar na borda não foi suficiente, foi só o primeiro nível"), não como uma feature nova desconectada.
