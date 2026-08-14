# Editorial

Planejamentos editoriais do blog (pauta/outline, não o texto final). Ver `plans/README.md` para a estrutura e a regra de autoridade.

## Regra de autoridade

- O arquivo de planejamento neste repositório é a fonte canônica do **planejamento** (pauta, tese, storytelling sugerido, trechos de código candidatos).
- O CMS/plataforma publicada é a fonte canônica do **conteúdo final** do post, uma vez publicado.
- O planejamento não deve duplicar permanentemente o texto do post publicado — depois de publicado, o arquivo aponta para o slug/ID/URL canônica (`canonical_content` no front matter).
- Alterações editoriais posteriores ao conteúdo já publicado acontecem no CMS, não neste arquivo.

## Estrutura do subsistema

| Preciso saber... | Onde |
|---|---|
| Contrato formal de um planejamento (front matter) | `schema/editorial-plan.schema.json` |
| Estados e transições de lifecycle | `LIFECYCLE.md` |
| Índice de todos os planos (gerado, não editar à mão) | `index.generated.md` / `index.generated.json` |
| Como gerar um planejamento novo | skill `post-planning` (`.claude/skills/post-planning/SKILL.md`) |
| Validação determinística (CI) | `../scripts/validate-editorial-plans.mjs`, `../scripts/generate-editorial-index.mjs` |

Pendente de merge no momento em que esta versão do README foi escrita (branches separadas, aguardando merge da coordenação — ver `docs/engineering/work-items/2026/08/2026-08-14-evolucao-subsistema-editorial.md` para o estado atual das PRs): contrato de rastreabilidade pós-publicação (`receipts/`, `schema/publication-receipt.schema.json`), contrato de resultado pós-publicação (`outcomes/`, `schema/outcome.schema.json`), contrato de integração com o Capital Agent (`CAPITAL_AGENT_INTEGRATION.md`, `schema/capital-agent-signal.schema.json`), validador de outcomes/receipts (`../scripts/validate-editorial-outcomes.mjs`). Atualizar esta tabela quando essas PRs mergearem.

## O que este subsistema não é

Git não é CMS. Antes da publicação, este repositório é a fonte canônica de ideia/planejamento/tese/evidência. Depois da publicação, o CMS é a fonte canônica do conteúdo — este repositório nunca guarda uma segunda cópia autoritativa do texto final. Detalhe completo da arquitetura: `../prompt-evolucao-subsistema-editorial.md` §2.
