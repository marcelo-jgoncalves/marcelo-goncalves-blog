---
id: POST-PLAN-2026-026
title: "Post standalone: \"Eu chutei quatro vezes antes de alguém me fazer olhar o navegador\""
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

<!-- Migrado de projects/publishing-content/postagens/post-diagnostico-antes-de-agir-ia-guessing.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post standalone: "Eu chutei quatro vezes antes de alguém me fazer olhar o navegador"

> Planejamento de post de blog — derivado dos casos de estudo em `ebook-content/debugging-css-media-query-override-silencioso.md` e `ebook-content/problema-tag-categoria-solucao.md`. Ver também o capítulo de ebook irmão: `ebook-content/ebook-capitulo-diagnostico-antes-de-agir.md` (versão mais longa/pedagógica do mesmo material).

## Títulos alternativos
- "O CSS estava certo. O token estava certo. E ainda assim não funcionava."
- "Por que IA chuta CSS — e como fazer ela parar"

## Tese central

Duas histórias reais e curtas, do mesmo projeto: em ambas, a primeira resposta a "o CSS não funciona" foi tentar mais variações de código — e em ambas, isso não levou a nada até alguém parar e perguntar "o que está realmente acontecendo no navegador, agora?". A tese do post: quando código gerado por IA não funciona, o impulso natural (gerar mais código, mais rápido) é exatamente o oposto do que resolve o problema.

## Por que importa

É o tipo de post que qualquer dev que já trabalhou com IA reconhece na hora — a sensação de "pedi pra IA ajustar isso 4 vezes e nada mudou" é universal. O post nomeia o padrão e dá a saída, com prova real, não teoria.

## Voz narrativa (decidido — mesma do capítulo de ebook irmão)

Post inteiro em primeira pessoa da IA, confessando o próprio chute ("eu tentei cache, tentei o token, tentei o valor original — nada"). Decisão deliberada de diferenciar este post da série da auditoria (que narra na perspectiva de Marcelo observando a IA de fora): aqui é a IA olhando para o próprio erro, por dentro. Só a frase de fechamento (CTA) sai dessa voz para se dirigir diretamente ao leitor — é a virada de "eu aprendi isso" para "agora você aplica isso".

## Storytelling sugerido (voz: primeira pessoa da IA, do início até o penúltimo parágrafo)

Abra in media res, sem preâmbulo, em "eu": "O token CSS que eu tinha ajustado valia 20px. O elemento mostrava 17px. Eu sabia os dois fatos e ainda assim levei três tentativas erradas para conectar eles." Narre rapidamente as tentativas cegas que **eu** fiz (cache do navegador, cache do Next.js, reverter o valor do token) — cada uma sem efeito, cada uma sem me ensinar nada. Vire a história no momento em que Marcelo me lembra do protocolo — não uma ideia minha, um lembrete de seguir o que eu já tinha documentado e não segui. Mostre, ainda em primeira pessoa, o script que eu escrevi e o dado que ele revelou (`getComputedStyle` me mostrando o valor real) e a causa raiz banal que eu encontrei (uma media query esquecida, escrita meses antes, sobrevivendo a uma refatoração).

Segundo bloco, mais curto, quase um "P.S.", ainda em "eu": a segunda vez que isso aconteceu comigo, foi mais rápido — não porque o bug era mais simples (era de outra natureza inteira: elemento que não existe no DOM por causa de renderização condicional), mas porque eu já tinha o protocolo ativo. Use isso para a virada final: minha velocidade não veio de chutar melhor, veio de parar de chutar.

Fechamento — aqui, e só aqui, sair da voz da IA para se dirigir direto ao leitor: "se você usa IA para escrever CSS/UI, da próxima vez que a correção não funcionar de primeira, não peça uma quinta tentativa — peça para ela inspecionar o DOM primeiro."

## Provas e exemplos reais

- Token `--text-xl` = `1.25rem` (20px) no root; elemento `.post-content` computava `17px` — causa: media query com mesma especificidade, vencendo por ordem no arquivo (`post.css`, remanescente de um sistema de tokens já removido).
- Trecho citável direto: "Quando `getComputedStyle` retorna um valor diferente do que você configurou, o problema nunca está no token. Está na cascata."
- Segundo caso: `.post-tag-header` não existia no DOM; o elemento real era `<span class="post-tag">`, porque `category` estava `null` e o JSX caiu no branch `else`.
- Os dois casos resolvidos com a mesma ferramenta: um script Playwright de ~15 linhas chamando `page.evaluate` + `getComputedStyle`/`querySelector`.
- Números reais para contraste: caso 1, ~8 minutos de protocolo vs. tentativas cegas que não chegaram a lugar algum; caso 2, 15+ minutos de chute vs. 2 minutos de diagnóstico correto.

## Conceitos a explicar (rápido, sem aprofundar como no ebook)

- **Cascata CSS**: quando duas regras têm a mesma especificidade, a que aparece depois no arquivo vence — media query não muda isso.
- **`getComputedStyle`**: o valor real que o navegador aplica, depois de toda a cascata resolvida — a única fonte confiável quando há divergência entre "o que escrevi" e "o que apareceu".
- **Renderização condicional**: um elemento que "deveria" existir, segundo o código, pode simplesmente não existir no DOM se a condição que o gera não for satisfeita.

## Estrutura sugerida (H2s)

1. Os dois fatos que eu não conseguia conectar
2. Três chutes (e por que nenhum ensinou nada)
3. O lembrete que mudou tudo: pare, observe, depois aja
4. O dado que resolveu em um print
5. A segunda vez, mais rápida — prova que não foi sorte
6. O que fazer na próxima vez que a correção de CSS "não funcionar"

## Fecho / CTA

Convite direto: "da próxima vez que pedir uma correção de CSS pra sua IA e ela não funcionar de primeira, não peça outra tentativa — peça pra inspecionar o DOM." Link cruzado com a série da auditoria de engenharia (mesmo espírito: provar com dados, não opinar).

## Fonte interna

`postagens/ebook-content/debugging-css-media-query-override-silencioso.md`, `postagens/ebook-content/problema-tag-categoria-solucao.md`.
