---
id: POST-PLAN-2026-027
title: "A Constituição Operacional de 478 Linhas Que Ninguém Tinha Escrito de Propósito"
created_at: 2026-08-05
updated_at: 2026-08-05
status: idea
channels: []
source_skill: post-planejamento
planned_publication:
published_at:
canonical_content:
related_case: docs/book/cases/CASE-001-refatoracao-claude-md-e-arquitetura-do-contexto.md
related_work_items: []
tags: [engenharia-de-contexto, ia-colaborativa, documentacao, claude-md]
contains_sensitive_content: false
---

# Post Standalone: "A Constituição Operacional de 478 Linhas Que Ninguém Tinha Escrito de Propósito"

## Títulos alternativos
- "478 para 116 Linhas: o Critério de Uma Frase Que Reorganizou o Cérebro do Projeto"
- "Regra, Estado ou Histórico? O `CLAUDE.md` Não Sabia a Diferença — e Provavelmente o Seu Também Não Sabe"
- "Engenharia de Contexto na Prática: Separando o Que Muda o Comportamento da IA do Que É Só Verdade Hoje"

## Por que este post é diferente dos demais

Não nasce de bug de código nem de achado de auditoria de segurança/performance — nasce de uma refatoração deliberada de processo, desenhada por Marcelo em 7 prompts sequenciais e executada com autorização explícita a cada etapa. Bom par temático com o `#21` (`2026-07-13-standalone-validacao-e-memoria-com-criterio.md`): aquele post já tinha cortado o `.project-context.md` de 455 para 110 linhas usando um checklist de 5 perguntas; este é a mesma lição aplicada, três semanas depois, ao arquivo mais importante do projeto — o próprio `CLAUDE.md`, o documento que a IA lê antes de qualquer linha de código. A diferença que justifica um post novo (não só uma atualização do #21): aqui existe um estudo de caso formal registrado (`CASE-001`), com critério de classificação explícito, tabela de migração completa, e — o que torna o post mais honesto que uma "vitória" simples — a eficácia real da mudança ainda não foi comprovada. O caso está `active`, não `resolved`, com revisão agendada para 2026-09-03.

## Tese central

Um arquivo de instruções para IA (`CLAUDE.md`, system prompt, o nome varia) tem arquitetura de informação exatamente como um sistema de software, e ela se degrada do mesmo jeito: sem uma regra explícita de "o que pertence aqui", qualquer fato acaba entrando — porque é sempre mais rápido escrever ali do que criar um documento novo — até que manter esse arquivo sincronizado com a realidade custa mais do que centralizá-lo economiza. A saída não é "escrever menos", é aplicar uma pergunta de uma frase, repetível, a cada trecho: *isso muda como a IA trabalha em várias sessões futuras, ou é só verdade agora?* Se for só verdade agora, não pertence à constituição operacional — pertence a uma fonte canônica que a IA consulta sob demanda.

## Por que importa

1. **"Mais contexto" carregado em toda sessão não é "melhor contexto"** — um arquivo de 478 linhas misturando regra, inventário de valores hexadecimais, versões exatas de dependência e histórico de sessão compete pela mesma atenção que uma regra crítica de segurança.
2. **Obsolescência silenciosa é o risco real, não estético.** Um valor hardcoded no `CLAUDE.md` (URL de ambiente, contagem de teste, versão de pacote) diverge do código real sem aviso — e a IA passa a operar sobre uma premissa desatualizada até alguém notar.
3. **O critério é mais valioso que o resultado numérico.** 478→116 linhas é uma métrica de tamanho, não de qualidade — o post deixa isso explícito em vez de vender a redução como prova de sucesso; o que generaliza para o leitor é a pergunta de classificação, não o número.
4. **É um caso raro de refatoração de "prompt de sistema" documentado com o mesmo rigor de uma refatoração de código** — hipótese, alternativas consideradas e rejeitadas, obrigações de prova, e uma seção de limitações que admite o que ainda não foi validado.

## Storytelling sugerido

Primeiro movimento: abrir com o sintoma concreto, sem dramatizar — `CLAUDE.md` chegou a 478 linhas, 40.396 bytes, 46 headings, depois de mais de 70 sessões de trabalho assistido por IA no mesmo projeto. Não por descuido: cada seção fazia sentido no momento em que foi escrita. O problema nunca foi um erro único, foi a ausência de uma regra de "o que entra aqui" — o mesmo tipo de dívida técnica que qualquer módulo de código acumula quando cresce sem arquitetura.

Segundo movimento: mostrar o diagnóstico, com evidência concreta em vez de opinião — os 13 valores hexadecimais completos da paleta de cores vivendo ao lado de uma proibição de reintroduzir tokens antigos (dois tipos de informação com taxas de mudança completamente diferentes, no mesmo parágrafo); a tabela de dependências com versões exatas ao lado do racional de por que a migração aconteceu; URLs de ambiente `dev` que mudam se o ambiente for recriado, tratadas como se fossem regra permanente.

Terceiro movimento: o critério que resolveu o problema — não uma reorganização de seções, uma pergunta aplicada seção por seção: "isso muda como a IA trabalha em várias sessões futuras, ou é só verdade agora?". Mostrar como essa pergunta separa, de forma mecânica, regra durável (fica) de conteúdo derivável, temporário ou histórico (sai). Usar aqui os 3 exemplos reais de antes/depois — o dos valores hex, o do gotcha técnico consolidado, e o caso de controle (um trecho que já estava certo e só mudou de posição, prova de que nem tudo era problema).

Quarto movimento: a virada honesta — não terminar com "e assim resolvemos". A refatoração ficou 116 linhas, abaixo até da faixa que o próprio processo tinha estimado como confortável (150-220). O post deve deixar claro que redução de linhas não é prova de qualidade por si só, que a revisão manual de Marcelo linha a linha ainda estava pendente no momento do caso, e que a eficácia real — se alguma regra crítica ficou difícil demais de encontrar — só se comprova em sessões futuras reais, não numa auditoria da própria mudança. Fechar com o que generaliza: o mesmo teste de uma frase serve para qualquer artefato que uma IA carrega "de graça" em todo turno de trabalho.

## Provas e exemplos reais

- **Antes**: `CLAUDE.md` com 478 linhas / 40.396 bytes / 46 headings `##`/`###` combinados (medido com `wc -l -c` e `grep -c`), acumulado desde a sessão 42 do projeto.
- **Depois**: `CLAUDE.md` com 116 linhas / ~9.400 bytes / 12 headings, reescrito em 12 seções numeradas.
- **14 documentos canônicos novos criados** para receber o conteúdo extraído: `docs/README.md`; `docs/product/vision.md`; `docs/architecture/system-overview.md`; 5 documentos em `docs/engineering/standards/` (princípios de engenharia, convenções de código, estratégia de testes, workflow assistido por IA, Git e revisão); 3 em `docs/operations/` (ambientes, deploy, problemas conhecidos); 3 em `frontend/docs/` (design system, pipeline de imagem, SEO).
- **Precedente interno real**: `docs/backlog.md` já tinha sido extraído do `CLAUDE.md` em 2026-08-02 (item de uma auditoria de qualidade anterior) — o mesmo padrão aplicado uma vez, pontualmente, nunca sistematicamente ao arquivo inteiro até esta refatoração.
- **Checagem automatizada real (não opinião)**: `grep -oE` extraiu os 15 caminhos de arquivo citados entre crases no novo `CLAUDE.md` e confirmou que todos existem — só uma ressalva pré-existente (referência a `memory/`, que vive fora do repositório por design).
- **Verificação de vazamento de conteúdo proibido**: `grep -niE` no `CLAUDE.md` novo por padrões que o processo definiu como proibidos (hash de commit, URL de ambiente, versão exata, valor hex, data histórica de sessão) — zero ocorrências reais, só a palavra genérica "sessão" em sentido estrutural ("início de sessão").
- **Estado de honestidade do caso**: `status: active`, não `resolved`; `review_after: 2026-09-03`; revisão manual de Marcelo linha a linha ainda pendente no momento do fechamento desta etapa.

## Trechos de código reais para ilustrar o post

**Exemplo 1 — Design system (valor derivável misturado com regra durável):**

Antes:
```text
--petrol:        #0F4C5C;   /* cor primária de marca */
--petrol-deep:   #08323D;   /* header/footer escuro */
--clay:          #C9603C;   /* cor de destaque/CTA (laranja) */
[... 10 outras variáveis com valor hex completo ...]

Nunca usar --aws-orange, --aws-dark, --gray-* — foram removidos do frontend e do admin.
```

Depois:
```text
Fonte de valores executáveis: frontend/app/globals.css (:root) e prints/tokens.md.
Este documento explica princípios e papéis, não repete os valores.

Nunca usar --aws-orange, --aws-dark, --gray-* — removidos do frontend e do admin.
```

**Exemplo 2 — gotcha técnico consolidado (não distribuído por componente):**

Antes (dentro de uma seção genérica "Regras Críticas" com 9 subseções técnicas misturadas):
```text
### Next.js 16
- `params` é Promise — sempre `await params` antes de desestruturar em qualquer `page.tsx`.
- ISR: posts individuais `revalidate: 60`, listagens `revalidate: 300`, páginas estáticas `revalidate = 3600`.
```

Depois (em `docs/architecture/system-overview.md`, lista dedicada de invariantes):
```text
## Invariantes críticos transversais
- **Next.js 16 — `params` é Promise**: sempre `await params` antes de desestruturar em
  qualquer `page.tsx`. ISR: posts individuais `revalidate: 60`, listagens `revalidate: 300`,
  páginas estáticas `revalidate = 3600`.
[... mais 8 invariantes no mesmo formato ...]
```

**Exemplo 3 — caso de controle (conteúdo que já estava certo, só mudou de posição):**

Antes (subseção dentro de "Modo de Operação"):
```text
### Captura de aprendizado para o livro

Este projeto também funciona como laboratório sobre engenharia de software assistida por IA.
[...]
As regras detalhadas estão em `docs/book/capture-protocol.md` e
`.claude/skills/engineering-book-capture/SKILL.md`; a estrutura canônica de um caso está em
`docs/book/cases/templates/case-template.md`.
```

Depois: texto idêntico, apenas promovido de subseção para seção própria (`## 11. Captura de aprendizado para o livro`) — nenhuma palavra reescrita.

## Conceitos a explicar

- **Regra durável vs. estado vs. fato derivável vs. histórico**: as quatro naturezas de informação que um arquivo de instruções de IA tende a misturar — regra muda o comportamento futuro, estado é verdade só até a próxima sessão, fato derivável já existe em outra fonte de verdade (código, lockfile, Git), histórico é narrativa de sessões passadas sem obrigação de ação futura.
- **Constituição operacional**: metáfora usada no post para descrever o papel do `CLAUDE.md` depois da refatoração — não um repositório de tudo que é verdade sobre o projeto, mas o conjunto mínimo de regras que mudam como a IA trabalha, apontando para fontes especializadas para o resto.
- **Fonte canônica**: o lugar único onde um tipo de informação é de fato mantido — quando existe mais de uma fonte para o mesmo fato, elas divergem silenciosamente sem que ninguém perceba (mesmo padrão do post #21).
- **Obrigação de prova**: prática de registrar explicitamente qual evidência confirma uma afirmação (ex.: "nenhum link quebrado" comprovado por `grep`, não por leitura visual) — e marcar como pendente o que ainda depende de julgamento humano.

## Estrutura sugerida (H2s)

1. **478 linhas, 46 seções, 70 sessões — e nenhuma delas escrita para não caber ali**
   - O sintoma medido, sem dramatizar; a explicação de que cada seção fazia sentido isolada
2. **O que estava realmente misturado no mesmo arquivo**
   - Os exemplos concretos de conteúdo derivável (hex, versões, URLs de ambiente) ao lado de regra durável
3. **A pergunta de uma frase que decide, sem depender de opinião**
   - "Isso muda como a IA trabalha em várias sessões futuras, ou é só verdade agora?" — como critério mecânico, repetível
4. **Três exemplos, três tipos de decisão**
   - Exemplo 1 (extrair valor derivável), exemplo 2 (consolidar gotcha transversal), exemplo 3 (caso de controle — nem tudo precisava mudar)
5. **O que a refatoração não prova sozinha**
   - Redução de linhas não é qualidade; a checagem automatizada (grep de links, grep de padrões proibidos) cobre só uma fatia da garantia; revisão humana linha a linha ainda pendente
6. **A régua para saber se funcionou de verdade**
   - Os indicadores definidos para a revisão de 30 dias (regra que precisou ser restaurada, IA procurando no lugar errado, duplicação reaparecendo, arquivo crescendo de novo)
7. **O teste de uma frase serve para qualquer contexto que uma IA carrega de graça**
   - Fechamento generalizando para além deste projeto específico

## Fecho / CTA

"A pergunta que separou regra de não-regra neste `CLAUDE.md` não é sofisticada: 'isso muda como a IA trabalha em várias sessões futuras, ou é só verdade agora?'. O difícil nunca foi formular a pergunta — foi aplicá-la item por item, sem a preguiça de deixar tudo onde já estava porque 'funciona assim há meses'. Um arquivo de instruções de IA acumula do mesmo jeito que qualquer sistema sem arquitetura de informação explícita: por conveniência, uma linha de cada vez, até que ninguém mais confia nele por completo."

## Fonte interna

- Sessão 73, 2026-08-04, projeto `marcelo-goncalves-blog`, branch `develop` (commit `5bbbf22`, PR #6).
- Estudo de caso completo: `docs/book/cases/CASE-001-refatoracao-claude-md-e-arquitetura-do-contexto.md` (status `active`, revisão em 2026-09-03).
- Tabela de migração seção a seção: `docs/book/cases/evidence/CASE-001/migration-table.md`.
- Diff reproduzível: `git diff 060412fa439ca0a1cffdf6360b5b21296bc76a8e -- CLAUDE.md`.
- Post irmão de tema: `editorial/plans/2026/07/2026-07-13-standalone-validacao-e-memoria-com-criterio.md` (mesma lição — critério de registro, não volume — aplicada três semanas antes ao `.project-context.md`, 455→110 linhas). Citar como precedente direto, não repetir o conteúdo.

## Notas de escrita

- Não vender a redução de 478→116 linhas como vitória fechada — o próprio caso-fonte insiste nisso (`status: active`, revisão pendente). Preservar essa honestidade é o que diferencia este post de conteúdo de marketing sobre "prompt engineering".
- Não confundir com o post #21 na hora de escrever — aquele é sobre `.project-context.md` (estado/changelog) e memória de comportamento; este é sobre `CLAUDE.md` (regra pura) e sobre documentação canônica de arquitetura/produto/padrões. Citar o #21 como precedente da mesma disciplina aplicada a um arquivo diferente, não reescrever a mesma história.
- Evitar jargão de "prompt engineering" sem explicar — o termo do post é "engenharia de contexto", e vale defini-lo cedo: é sobre arquitetura de informação de um artefato que uma IA lê, não sobre técnica de redação de prompt pontual.
- Manter os 3 exemplos de código reais no corpo do post, verbatim — são o que dá credibilidade ao "antes depois", não paráfrase.
