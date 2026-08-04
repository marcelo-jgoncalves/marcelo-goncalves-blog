# Prompts

Prompts de engenharia com valor operacional ou histórico que não justificam virar skill, protocolo ou documento canônico próprio.

## Prompts reutilizáveis

Se um prompt ainda ensina como executar uma classe recorrente de tarefa, avaliar transformá-lo em skill, protocolo, template ou documento canônico em vez de mantê-lo aqui só como arquivo histórico. Quando útil mas não justifica uma peça própria, pode viver diretamente nesta pasta (não em `archive/`).

## Prompts históricos

`archive/YYYY/YYYY-MM-DD-<descricao>.md` — prompts que já cumpriram a função e não têm mais uso operacional recorrente, preservados por valor histórico/pedagógico. Front matter:

```yaml
---
id: PROMPT-YYYY-NNN
title:
created_at:
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
related_commits: []
contains_sensitive_content: false
---
```

Status: `active | executed | partially-executed | superseded | abandoned | historical`.

## Regra de preservação

Preservar quando o prompt explica uma decisão importante, demonstra evolução do processo, sustenta um estudo de caso, tem valor pedagógico, permite reproduzir uma mudança, ou contém raciocínio não incorporado integralmente a outra fonte. Não preservar quando é tentativa mecânica, duplica integralmente uma skill/protocolo já existente, não pode ser compreendido fora da sessão original, tem risco de privacidade maior que seu valor, ou não tem utilidade futura.

## Segurança

Antes de versionar um prompt antigo neste repositório público: revisar credenciais, tokens, URLs privadas, nomes de clientes, dados pessoais, conversas completas, conteúdo confidencial, informação de infraestrutura sensível. Redigir com `<redacted>` quando necessário; classificar como `private-external` (não versionar) quando não puder ser sanitizado com segurança.

## Diferença para `docs/engineering/work-items/`

Um prompt aqui ensina uma classe de tarefa ou preserva raciocínio histórico. Um work item instrui uma mudança específica, com escopo e critério de aceite próprios, geralmente executada uma vez. Ver `../work-items/README.md`.
