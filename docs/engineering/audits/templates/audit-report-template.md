<!--
Template do relatório de auditoria de consistência do projeto.
Fonte canônica das regras: docs/engineering/audits/project-consistency-audit.md — releia antes de preencher.
Em modo `quick`, não force seções não aplicáveis (ex.: "Evolução das notas" sem baseline, "Estudos de caso" sem nenhum tocado no escopo) — declare a seção como fora de escopo em 1 linha em vez de deixá-la vazia sem explicação.
-->

# Auditoria de consistência do projeto

## Metadados

| Campo | Valor |
|---|---|
| ID da auditoria | `PCA-YYYYMMDD-<MODO>` |
| Data | |
| Modo | `quick \| full \| delta \| area:<area>` |
| Branch | |
| Commit | |
| Working tree | `clean \| dirty (descrever)` |
| Versão da metodologia | |
| Versão dos pesos | |

## Escopo

<!-- O que foi efetivamente inspecionado nesta execução. Áreas/fontes cobertas. -->

## Limitações

<!-- O que não foi inspecionado e por quê: fora do modo, dependência externa não verificada, teste não executado, arquivo local ausente. -->

## Veredito

<!-- Resumo objetivo: estado geral, se aplicável nota global (só em `full`), achados que limitam o veredito mesmo com média alta. Não declarar "produção pronta" sem evidência operacional. -->

## Evolução das notas

<!-- Só em `full`/`delta` com baseline comparável. -->

| Área | Nota anterior | Nota atual | Diferença | Evidência da evolução | Regressões | Confiança |
|---|---:|---:|---:|---|---|---|
| | | | | | | |

## Achados prioritários

<!-- Lista ordenada por severidade. Cada achado no formato abaixo. -->

### PCA-YYYYMMDD-001 — <título>

- Categoria:
- Área:
- Severidade: `critical \| high \| medium \| low \| informational`
- Confiança: `high \| medium-high \| medium \| low \| unknown`
- Estado: `open \| accepted-risk \| needs-human-decision \| false-positive \| resolved-after-audit \| not-actionable`
- Fontes:
- Evidência observada:
- Interpretação:
- Impacto:
- Limitação:
- Próxima ação sugerida:
- Controle determinístico possível:
- Caso do livro aplicável:

<!-- Repetir o bloco para cada achado. -->

## Avaliação por área

<!-- Uma subseção por área efetivamente auditada. Áreas não auditadas: listar como `not-assessed`, não omitir. -->

### <Área>

- Nota: `<0-10 ou not-assessed>`
- Confiança:
- Evidência:
- Limitações:
- Achados relacionados:

## Contradições entre fontes

| Tema | Fonte A | Fonte B | Contradição | Autoridade provável | Evidência | Ação necessária |
|---|---|---|---|---|---|---|
| | | | | | | |

## Políticas e enforcement

| Política | Fonte | Maturidade | Detecção | Consequência | Evidência | Risco |
|---|---|---|---|---|---|---|
| | | | | | | |

<!-- Maturidade: documented-only | review-dependent | partially-automated | automatically-detected | automatically-blocking -->

## Contexto e governança da IA

<!-- CLAUDE.md, .project-context.md, memory/, skills: separação regra/estado/histórico, precedência, conflitos, conteúdo derivável, reprodutibilidade, enforcement, atribuição humano-IA, dependências não versionadas, riscos de privacidade. -->

## Estudos de caso

<!-- Só se algum caso estiver dentro do escopo desta execução. YAML válido, status coerente, obrigações de prova, evidência de antes/depois quando aplicável. -->

## Reprodutibilidade

<!-- Dependências de artefato local não versionado (.claude/, .project-context.md, memory/, contexto/). O que um clone novo do repositório consegue e não consegue reproduzir. -->

## Controles determinísticos sugeridos

<!-- Trabalho futuro de script/CI apontado pelos achados. Não implementado nesta auditoria. -->

## Prioridades

<!-- Ordem sugerida de tratamento, sem prometer prazo. -->

## Itens resolvidos desde a avaliação anterior

<!-- Só em `delta`/`full` com baseline. Exigir evidência real de resolução, não presumir pela ausência de reinspeção. -->

## Novos riscos

## Questões que exigem decisão humana

<!-- Conflitos de autoridade não resolvidos silenciosamente; decisões que só Marcelo pode tomar. -->

## Potenciais casos para o livro

<!-- Avaliação conforme docs/book/capture-protocol.md — não abrir caso automaticamente aqui, só apontar candidatos. -->

## Arquivos gerados

<!-- Caminho do próprio relatório e do snapshot correspondente, quando gerado. -->
