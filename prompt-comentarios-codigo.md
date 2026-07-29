# Prompt — Padronização de comentários de código (PT → EN + regra "why, not what")

Cole este prompt na próxima sessão.

---

Preciso que você faça uma revisão completa dos comentários de código no monorepo `marcelo-goncalves-blog` (`frontend/`, `backend/`, `admin/`, `infra/`). Isso é ação direta (edição de código), não análise — pode ir modificando conforme avança, mas siga o plano abaixo e não pule as etapas de verificação.

## Contexto (já decidido, não reabrir discussão)

Uma auditoria de nomenclatura (sessão 2026-07-29) e uma conversa de acompanhamento já fixaram o padrão, documentado em `CLAUDE.md` (seção "Conteúdo de comentário de código — regra 'why, not what'" e a seção de convenção de nomenclatura logo acima dela — leia as duas antes de começar). Resumo do padrão:

1. **Idioma**: todo comentário de código passa a ser em **inglês** (comentário é código, não conteúdo/copy — mesma regra que já vale para tokens, classes, componentes, variáveis).
2. **Conteúdo — "why, not what"**: comentário deve explicar *por que* o código existe daquela forma (restrição não-óbvia, workaround de bug específico, trade-off consciente) — nunca *o que* o código faz (isso já deve estar óbvio pelo nome bem escolhido de variável/função; se não estiver, o problema é o nome, não a falta de comentário).
3. **Nunca incluir dentro do comentário**: número de sessão, data, nome de quem pediu ("Marcelo decidiu..."), referência a auditoria/investigação por nome de arquivo (`contexto/auditoria-performance/01-perf-load.md`), ou qualquer contexto de processo. Esse tipo de informação pertence à mensagem de commit ou a `memory/`/`.project-context.md`, nunca ao código-fonte.
4. **Nunca marcar autoria de IA no código** (nem `// gerado por IA`, nem assinatura) — isso já não acontece hoje, é só para não introduzir no futuro.
5. **Comentário de cabeçalho com path do arquivo** (ex.: `// frontend/components/ui/PostCard.tsx` na primeira linha) é ruído puro — remover, não traduzir. Achados ~55 arquivos com esse padrão numa auditoria anterior (rode `grep -rl "^// frontend/\|^/\* frontend/\|^// backend/\|^// admin/" frontend backend/src admin/src --include="*.ts" --include="*.tsx" --include="*.vue"` para achar todos de novo, a lista pode ter mudado).

## O que fazer, por arquivo/bloco de comentário

Para cada comentário encontrado, decida em qual destas 4 categorias ele cai e aja de acordo:

- **(A) Header de path de arquivo** → remover a linha inteira (não precisa de tradução, é lixo).
- **(B) WHY genuíno, só em português** → traduzir para inglês, mantendo o conteúdo técnico intacto. Não resumir nem cortar informação real (ex.: números de auditoria, causa raiz de bug) — só trocar o idioma e, se citar sessão/data/nome, remover essa parte específica preservando o resto da frase.
- **(C) WHY genuíno que mistura razão técnica com metadado de processo** (ex.: "Contador atômico — decisão de Marcelo em 2026-06-28 depois que a auditoria achou X") → traduzir E remover o metadado de processo, mantendo só a razão técnica ("Atomic counter — avoids a full table scan on every read" ou similar, sem inventar contexto que não estava lá). Metadado de processo = sessão, data de decisão, nome de quem pediu, ou referência a doc/relatório de auditoria **interna** do projeto (`contexto/auditoria-*`, `.project-context.md` etc.) — remover sempre, porque é referência que apodrece (arquivo pode ser movido/arquivado sem o comentário acompanhar) e o `git blame`/mensagem de commit já cobre "quando/por quem" de forma confiável e automática.
  - **Exceção — manter a referência**: quando ela aponta pra uma fonte **externa e estável** que explica um valor/comportamento específico e não muda com o tempo (RFC, documentação oficial da AWS/Next.js/etc., limite de serviço documentado, spec de terceiro). Isso é diferente de citar a auditoria interna do próprio time — a diferença é "essa fonte existe e é citável independente deste projeto" vs. "essa fonte é um registro interno do processo de decisão".
- **(D) Comentário que é só "what" (descreve o que o código faz, sem adicionar informação que o nome já não desse)** → **remover o comentário inteiro**, não traduzir. Se ao tentar traduzir você perceber que o comentário não passa de "// busca o post pelo slug" acima de uma função chamada `getPostBySlug`, isso é candidato a remoção, não tradução. Só mantenha se genuinamente adicionar uma informação de "why" escondida no meio do "what".

## Escopo

Percorra sistematicamente:
- `frontend/app/**/*.{ts,tsx,css}` (incluindo `.module.css`)
- `frontend/components/**/*.{ts,tsx,css}`
- `frontend/lib/**/*.ts`
- `backend/src/**/*.ts`
- `admin/src/**/*.{ts,vue}`
- `infra/**/*.tf` (auditoria anterior encontrou 0 comentários aqui, mas confirme de novo — pode ter mudado)

Use grep para localizar comentários (`^\s*(//|/\*|\*[^/])` nos arquivos `.ts`/`.tsx`/`.css`, mais os padrões de comentário Vue/HTML `<!--` e Terraform `#`) em vez de ler arquivo por arquivo manualmente onde a densidade for baixa — mas onde houver bloco de comentário grande (`postCounters.ts`, `globals.css`, `home.css`, `Header.css`, `page.module.css` das 4 landings de pilar, que já foram citados como tendo comentários extensos com data/sessão), leia o arquivo completo pra não perder contexto ao traduzir.

## O que NÃO fazer

- Não mudar nenhum código funcional — só o conteúdo/idioma/presença dos comentários.
- Não tocar em `id="..."` de âncora, rotas, `data-audit`, nomes de classe CSS globais com prefixo por página (`sobre-*`/`op-*`/`post-*`/`svc-*`) — isso é nomenclatura, já decidido que fica em português numa rodada própria (ver CLAUDE.md), não é escopo deste prompt.
- Não remover comentários de licença/copyright de bibliotecas de terceiros (se houver, o que é improvável neste projeto).
- Não commitar/pushar automaticamente — deixar tudo pronto no working tree para eu revisar e pedir o commit explicitamente.

## Validação antes de reportar pronto

- `frontend/`: `npx tsc --noEmit`, `npx eslint .`, `npm run lint:css` (stylelint) — mudar só comentário não deveria quebrar nada disso, mas confirme.
- `backend/`: `npx tsc --noEmit -p tsconfig.test.json` + `npm test` (172 testes na baseline atual).
- `admin/`: rodar o typecheck/lint equivalente do workspace (checar `package.json`).

## Relatório final

Ao terminar, reporte: quantos comentários caíram em cada categoria (A/B/C/D), quantos arquivos foram tocados no total, e a lista de arquivos onde você teve dúvida se o comentário era "why" ou "what" (para eu revisar esses casos específicos antes de aprovar). Não commitar — só deixar pronto e aguardar.
