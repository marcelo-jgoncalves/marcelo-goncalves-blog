---
id: POST-PLAN-2026-013
schema_version: "1.0"
title: "Post 10 da série: Documentação e Governança — \"Dois documentos de regras, discordando entre si\""
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

<!-- Migrado de projects/publishing-content/postagens/13-criterio-documentacao-e-governanca.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post 10 da série: Documentação e Governança — "Dois documentos de regras, discordando entre si"

## Títulos alternativos
- "Qual documento manda quando os dois se contradizem?"
- "O README que ainda fala de uma fonte que não existe mais"

## Tese central

Manter um documento de regras (para humanos ou para IA) tem um custo invisível: ele precisa ser revisitado a cada mudança real do sistema, ou vira ficção educada. O post mostra um caso direto: dois documentos de governança do mesmo projeto — um atualizado, um não — dando instruções **diferentes e incompatíveis** sobre a mesma decisão (qual fonte usar, qual valor de espaçamento aplicar), sem que nada no repositório sinalize qual prevalece.

## Por que importa

É um problema que cresce exatamente com o sucesso: quanto mais documentação um projeto acumula (boa prática, em tese), maior a chance de dois documentos divergirem sem que ninguém note — porque ninguém lê os dois lado a lado, só consulta o que está mais à mão.

## Storytelling sugerido

Abra com a contradição lado a lado, sem rodeios — dois trechos, um do `contract.md` ("DM Sans... nunca usar Space Grotesk"), outro do `CLAUDE.md` ("nunca usar DM Sans ou Space Grotesk"). Os dois documentos do mesmo repositório, escritos para guiar o mesmo agente de IA, dizendo coisas opostas sobre a mesma fonte. Resolva a contradição checando o código real (`layout.tsx` usa Inter, nem DM Sans nem Space Grotesk) — nenhum dos dois documentos está 100% certo, e isso é o ponto: documentação que não é revalidada contra o código real eventualmente erra mesmo quando parece autoritativa.

Segundo beat, mais leve: o `README.md` do frontend — a primeira coisa que alguém vê ao abrir a pasta — ainda é o boilerplate do `create-next-app`, mencionando a fonte Geist e deploy na Vercel. Nenhuma das duas frases é verdadeira para este projeto. Ninguém mentiu; ninguém também nunca voltou para corrigir.

Fechamento: documentação não é "escrever uma vez e confiar" — é manutenção contínua, com a mesma disciplina de revisão que se daria a código.

## Provas e exemplos reais

- `docs/contract.md`: "DM Sans... **Nunca** usar Space Grotesk — foi removido" vs. `CLAUDE.md`: "**Nunca** usar Space Grotesk ou DM Sans — foram removidos do frontend e do admin".
- `frontend/app/layout.tsx:4`: `import { Inter, JetBrains_Mono } from "next/font/google"` — nenhuma menção a DM Sans no código real.
- `--space-4` vale `40px` no `contract.md` e `32px` no `CLAUDE.md` (onde 40px passou a ser `--space-content`) — mesma variável, dois valores documentados.
- `frontend/README.md`: boilerplate puro do `create-next-app`, cita "Geist" (fonte real: Inter) e "Deploy on Vercel" (deploy real: OpenNext + Lambda + CloudFront).
- Nenhum `README.md` na raiz do repositório — a página inicial do projeto no GitHub não descreve o projeto.

## Conceitos a explicar

- **Drift de documentação**: a distância, que cresce naturalmente com o tempo, entre o que um documento declara e o que o sistema realmente faz — só fica visível quando alguém compara ativamente os dois.
- **Fonte única de verdade (single source of truth)**: princípio de manter uma única referência autoritativa para cada fato, em vez de várias cópias que podem divergir.
- **Boilerplate não customizado**: arquivo gerado automaticamente por uma ferramenta de scaffold (`create-next-app`, `create-vue`) e nunca revisado — frequentemente contém informação genérica ou simplesmente errada para o projeto real.

## Estrutura sugerida (H2s)

1. Duas instruções, uma contradição
2. Como resolver: voltar ao código, não ao documento mais recente
3. O README que ainda promete uma fonte que não existe
4. Por que documentação "escrita uma vez" se torna ficção
5. Como evitar isso: documentação como parte do ciclo de revisão, não um artefato à parte

## Fecho / CTA

Aponta para o post de Developer Experience ("a mesma fragilidade aparece de novo, agora na ferramenta que devia facilitar o setup de quem está chegando").

## Fonte interna

`docs/auditoria-engenharia/10-documentacao-e-governanca.md`
