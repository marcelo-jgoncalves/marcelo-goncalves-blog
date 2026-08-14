# Lifecycle editorial

Máquina de estados canônica dos planejamentos em `editorial/plans/`. Front matter (`status`) é a fonte de verdade do estado — planos não são movidos entre pastas quando o status muda (ver `plans/README.md`).

Contrato de dados correspondente: `editorial/schema/editorial-plan.schema.json`. Enforcement determinístico: `scripts/validate-editorial-plans.mjs`.

## Estados

```text
idea → researching → planned → drafting → ready → scheduled → published
```

Estados alternativos, alcançáveis a partir de qualquer estado não terminal:

```text
cancelled
archived
```

`published`, `cancelled` e `archived` são terminais — não têm transição de saída no fluxo normal. Uma correção de erro humano (ex.: `cancelled` reaberto) é uma decisão editorial explícita, não uma transição automática validada pelo script.

## Transições permitidas

| De | Para |
|---|---|
| `idea` | `researching`, `cancelled`, `archived` |
| `researching` | `planned`, `cancelled`, `archived` |
| `planned` | `drafting`, `cancelled`, `archived` |
| `drafting` | `ready`, `planned` (voltar para replanejar), `cancelled`, `archived` |
| `ready` | `scheduled`, `published`, `drafting` (voltar por correção), `cancelled`, `archived` |
| `scheduled` | `published`, `ready` (desagendar), `cancelled`, `archived` |
| `published` | `archived` |
| `cancelled` | `archived` |
| `archived` | (terminal) |

O validator (Fase C) checa apenas se o `status` atual é um valor válido do enum e se os invariants do estado atual estão satisfeitos — não reconstrói o histórico de transições (não há log de transições no front matter hoje). Validar a transição em si (estado anterior → novo) fica para quando/se o front matter passar a registrar histórico de status; hoje isso exigiria comparar contra o Git blame do arquivo, fora do escopo determinístico simples do validator.

## Invariants por estado

### `scheduled`

Exige `planned_publication` preenchido (não nulo).

### `published`

Exige:

- `published_at` preenchido;
- `canonical_content` preenchido (aponta para o slug/URL/ID real no CMS);
- `publication_receipt` preenchido **ou** ausência justificada — como a integração de Publication Receipt (Fase E) ainda não existe, o validator aceita `publication_receipt: null` para planos publicados nesta fase, mas sinaliza como aviso (warning), não erro. Isso deixa de ser aceitável assim que a Fase E estiver implementada.

### `contains_sensitive_content: true`

Bloqueia avanço para `ready`, `scheduled` ou `published` a menos que `human_review_required: true` esteja também presente no front matter — sinal de que a revisão humana explícita já ocorreu (o campo em si é a evidência mínima disponível hoje; não existe workflow de aprovação separado).

### `cancelled`

Sem invariant de campo adicional além dos exigidos por todo plano (schema base). Motivo de cancelamento não é obrigatório em front matter — se necessário, registrar em prosa no corpo do arquivo.

### `archived`

Sem invariant de campo adicional. Mantém todos os campos do estado anterior (não há redução de dados ao arquivar).
