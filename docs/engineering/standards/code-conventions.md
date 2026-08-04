# Convenções de código

## Idioma — código em inglês, dado/conteúdo/URL em português (obrigatória desde 2026-07-29)

Regra fixa, sem exceção em código novo: **código = inglês, dado/conteúdo/URL = português.**

| Categoria | Idioma |
|---|---|
| Tokens de design, classes CSS (Modules e global), nomes de componente React/Vue, variáveis/funções/tipos internos, nomes de arquivo/pasta de código, comentários de código | **Inglês** |
| Campos persistidos no DynamoDB, rotas (`app/`), IDs de âncora de seção, atributos `data-audit`, copy visível ao usuário | **Português** (mantidos como estão — nunca migrar; renomear rota/campo de dado é risco alto sem ganho real) |

**Retroativo, sem migração**: as classes CSS globais com prefixo por página (`sobre-*`/`op-*`/`post-*`/`svc-*`) não foram traduzidas — são referenciadas por seletor descendente/`:nth-child` entre arquivos (risco médio, exige sessão de validação visual dedicada). Ficam em português como estão até uma rodada própria.

## Comentários — regra "why, not what"

Comentário novo (ou editado) deve explicar **por que** o código existe daquela forma — restrição não-óbvia, workaround de bug específico, trade-off consciente — nunca **o que** ele faz (nome bem escolhido já responde isso).

**Nunca incluir dentro do comentário**: número de sessão, data, nome de quem pediu, referência a ticket/issue, ou qualquer contexto de processo. Isso pertence à mensagem de commit ou a `memory/`/`.project-context.md`, nunca ao código-fonte.

**Sem travessão** (`—`/`–`): trocar por vírgula, dois-pontos ou `|`. Vale tanto para comentários de código quanto para copy/SEO voltados ao usuário (títulos, meta description/OG/JSON-LD).

Não marcar no código que uma mudança foi feita por IA — nem comentário `// gerado por IA`, nem assinatura no corpo do arquivo. Atribuição de autoria de IA fica só na mensagem de commit.

**Retroativo, sessão dedicada planejada**: os ~730 comentários existentes anteriores a esta regra (quase 100% em português, vários citando sessão/data/decisão) serão revisados numa sessão própria. Até lá, um comentário antigo fora do padrão não é bug a corrigir de passagem.

Exemplo adequado:

```ts
// DynamoDB rejects empty values for indexed attributes.
// Omit the field instead of persisting an empty string.
```

Exemplo inadequado:

```ts
// Claude changed this after we found a bug in session 42.
```

## Comentários que não pertencem ao código

- narrativa da sessão;
- prompt usado;
- autoria da IA;
- histórico completo da decisão;
- TODOs sem vínculo com o backlog;
- explicações que pertencem a ADR ou documentação — linkar em vez de reproduzir.

## Convenções específicas de componente

Regras que só são úteis ao trabalhar em um componente específico (Next.js/OpenNext, DynamoDB, Sharp/build, CloudFront, SEO, backend, Terraform) vivem próximas do componente: README do componente, documentação específica, ou comentário "why" próximo ao código. Antes de alterar um componente, leia o README e a documentação associada a ele.
