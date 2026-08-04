---
id:
title:
summary:
date_started:
date_closed:
status:
themes: []
components: []
trigger_types: []
related_commits: []
related_pull_requests: []
related_files: []
related_tests: []
related_pipelines: []
related_adrs: []
related_experiments: []
ai_tool:
ai_model:
ai_autonomy_level:
book_potential:
review_after:
last_reviewed:
baseline_ref:
result_ref:
evidence_files: []
---

<!--
Este caso é um registro histórico. Ele documenta como o raciocínio evoluiu no momento em que o trabalho aconteceu e não deve ser lido como descrição do estado atual do sistema.

status: draft | active | paused | inconclusive | resolved | superseded | archived

trigger_types (use os que se aplicarem): architecture-decision, refuted-hypothesis, ai-error,
human-intervention, invalid-test, mock-real-service-divergence, ineffective-control,
cross-layer-bug, conscious-non-implementation, unexpected-result, mental-model-change,
context-failure, productivity-experiment, operational-incident, refactoring-insight,
engineering-tradeoff.

ai_autonomy_level (registre o maior nível efetivamente usado no caso):
0 — Explanation | 1 — Suggestion | 2 — Planning | 3 — Scoped editing |
4 — Full implementation cycle | 5 — Commit or pull request preparation |
6 — Non-production deployment | 7 — Approved operational action |
8 — Conditional production autonomy.

book_potential: low | medium | high

review_after: data futura (AAAA-MM-DD) ou vazio, quando não houver necessidade de revisão posterior.

baseline_ref / result_ref / evidence_files são opcionais — preencher somente quando a seção
"Evidência de antes e depois" for `required` ou `optional` com conteúdo real. Ver regras em
docs/book/capture-protocol.md, seção "Evidência de antes e depois".
- baseline_ref: referência confiável do estado anterior (hash de commit, tag, branch imutável
  no contexto registrado, ou HEAD no momento de abertura com o hash real anotado). Nunca uma
  descrição vaga como "antes da mudança".
- result_ref: referência do estado posterior. Deixar vazio enquanto o resultado só existir no
  working tree — o corpo do caso deve explicar isso, nunca inventar um valor.
- evidence_files: lista só de arquivos permanentes que realmente existem em
  docs/book/cases/evidence/CASE-NNN/ (ex.: before-after.md, migration-table.md, um .patch).
  Nunca comandos, URLs externas ou arquivos temporários.
-->

# Resumo do caso

<!-- Um parágrafo curto e objetivo: o que aconteceu, por que importa. Não é o lugar para conclusões ainda não sustentadas pelo restante do caso. -->

# 1. Contexto

<!-- Situação anterior ao problema. Fatos verificáveis, não interpretação. -->

# 2. Problema observado

## 2.1 Fatos observados

<!-- Registre apenas fatos verificáveis (Observed fact). Não inclua interpretações nesta seção. -->

## 2.2 Impacto

# 3. Modelo mental inicial

<!-- Como o problema era entendido antes de investigar. -->

# 4. Hipótese inicial

<!-- Preserve esta hipótese exatamente como foi formulada, mesmo que depois se mostre errada. Não reescreva este campo após conhecer o resultado. -->

# 5. Alternativas consideradas

## 5.1 Alternativa A

### Vantagens

### Riscos

### Motivo da adoção ou rejeição

<!-- Repita a subseção "5.x Alternativa" para cada alternativa relevante. Não é obrigatório documentar alternativas triviais. -->

# 6. Riscos e critérios de aceitação

## 6.1 Riscos conhecidos

## 6.2 Critérios de aceitação

## 6.3 Obrigações de prova

<!-- O que precisa ser comprovado antes que a solução seja aceita, e com que evidência. -->

| Mudança ou afirmação | Evidência exigida | Evidência obtida | Status |
|---|---|---|---|
|  |  |  |  |

<!-- Status: pending | satisfied | partially-satisfied | not-satisfied | not-applicable -->

# 7. Participação da IA

<!-- Classificação resumida da participação da IA neste caso. Nem toda classificação precisa aparecer. -->

| Classificação | Descrição | Referência |
|---|---|---|
|  |  |  |

## 7.1 Inferências da IA

<!-- AI inference: interpretação ou hipótese produzida pela IA, distinta de fato observado. -->

## 7.2 Propostas da IA

<!-- AI proposal: alternativa ou solução sugerida pela IA. -->

## 7.3 Implementação realizada pela IA

<!-- AI implementation: o que a IA de fato alterou. Não atribua a Marcelo uma implementação produzida pela IA sem distinguir os papéis. -->

## 7.4 Erros ou limitações da IA

<!-- Registre falhas e limitações da IA sem ocultá-las, mesmo quando desconfortáveis. -->

# 8. Participação humana

| Classificação | Descrição | Referência |
|---|---|---|
|  |  |  |

## 8.1 Decisões de Marcelo

<!-- Human decision: só registre como decisão de Marcelo o que foi de fato confirmado por ele. Não invente motivações humanas. -->

## 8.2 Intervenções humanas

<!-- Human intervention: correção, restrição, rejeição ou redirecionamento humano ao longo do trabalho. -->

## 8.3 Restrições ou redirecionamentos

# 9. Investigação e evolução

## 9.1 Evidências coletadas

| Tipo | Referência | O que demonstra | Limitação |
|---|---|---|---|
|  |  |  |  |

<!-- Tipos possíveis: teste, log, métrica, pipeline, scanner, comportamento observado, documentação oficial, commit, pull request, experimento. -->

## 9.2 Tentativas realizadas

## 9.3 Tentativas que falharam

<!-- Não omita tentativas que falharam. Elas fazem parte do aprendizado tanto quanto a solução final. -->

## 9.4 Hipóteses descartadas

<!-- Liste as hipóteses descartadas ao longo do trabalho, sem reescrevê-las para parecerem mais certeiras do que foram no momento. -->

## 9.5 Mudanças de escopo ou estratégia

# 10. Solução final

# 11. Evidência de antes e depois

<!--
Preserva exemplos representativos e explicados do estado anterior e posterior de uma transformação
concreta. O Git e os artefatos de evidência (seção "Evidência completa" abaixo) preservam a
comparação completa e reproduzível — esta seção não é o lugar para copiar diffs inteiros.

Obrigatória (status: required) quando o caso envolver transformação concreta: refatoração,
correção de bug, mudança arquitetural, alteração de processo, mudança de comportamento, falha da
IA seguida de correção, intervenção humana que modificou a solução, substituição de abordagem,
migração, melhoria de segurança, mudança de modelo mental acompanhada de alteração verificável, ou
transformação de regra documentada em controle executável.

Pode ser status: not-applicable quando o caso for puramente investigativo, conceitual,
inconclusivo sem mudança implementada, baseado em decisão ainda não executada, ou uma observação
sem artefato anterior e posterior comparável — sempre com justificativa, nunca por omissão.
-->

## Aplicabilidade

- Status: `<required | optional | not-applicable>`
- Justificativa: `<por que esta seção se aplica ou não>`

## Referências

| Estado | Referência | Arquivo ou escopo |
|---|---|---|
| Antes | `<commit, tag, branch, snapshot ou working-tree documentado>` | `<caminho>` |
| Depois | `<commit, tag, branch ou working-tree documentado>` | `<caminho>` |

## Reprodução

```bash
git diff <referência-anterior>..<referência-posterior> -- <arquivo>
```

<!-- Se a comparação ainda não puder ser reproduzida por commits, explique o motivo e registre o método disponível. Nunca invente hash, tag ou commit; não crie commit apenas para produzir uma referência. -->

## Exemplo representativo 1 — <aspecto demonstrado>

### Antes

```text
<trecho literal curto, extraído do estado real — não reconstruído de memória>
```

### Depois

```text
<trecho literal curto>
```

### O que mudou

<!-- Descrição objetiva da transformação. -->

### Por que este exemplo foi escolhido

<!-- Por que o trecho é representativo do problema, da decisão ou da solução — não escolha só por ser o mais impressionante. -->

### Classificação da evidência

- `Observed fact`: <o que o exemplo demonstra diretamente>.
- `AI inference`: <interpretação possível, quando existir>.
- `Human decision`: <decisão humana relacionada, quando existir>.
- `Limitation`: <o que não pode ser concluído a partir deste exemplo>.

<!-- Repita "Exemplo representativo N" para cada exemplo relevante. Prefira poucos exemplos bem escolhidos a muitos exemplos redundantes. -->

## Casos contrários ou de controle

<!--
Evita que a evidência de antes e depois funcione como propaganda da solução. Quando relevante,
registre: exemplo em que o problema não ocorreu; caso que contradiga a hipótese; comportamento
correto anterior à solução; regressão posterior; situação em que a mudança não produziu melhoria;
diferença entre correlação e causalidade observada aqui.
-->

## Evidência completa

- Diff reproduzível: `<comando ou referência, ou not-applicable>`
- Pacote de evidências: `<docs/book/cases/evidence/CASE-NNN/ ou not-applicable>`
- Tabela de migração: `<caminho ou not-applicable>`
- Patch preservado: `<caminho ou not-applicable>`
- Testes e validações: `<referências, ou not-applicable>`

# 12. Evidências de validação

## 12.1 Evidências automatizadas

<!-- Automated evidence: teste, scanner, pipeline, métrica ou validação automática. -->

## 12.2 Evidências observadas

<!-- Observed evidence: comportamento verificado diretamente em ambiente ou serviço real. -->

## 12.3 Evidências ausentes ou insuficientes

<!-- Registre explicitamente quando a evidência disponível é incompleta. Esta seção pode permanecer preenchida mesmo em casos "resolved" — ausência de evidência não impede o encerramento, só precisa ficar visível. -->

# 13. Mudança do modelo mental

## 13.1 Antes

## 13.2 Depois

## 13.3 O que provocou a mudança

# 14. Princípio generalizável

<!-- O aprendizado que sobrevive fora do contexto específico deste caso. Se não houver um princípio generalizável claro, registre isso explicitamente em vez de forçar uma conclusão. -->

# 15. Limites da conclusão

<!-- Limitation: até onde a conclusão deste caso pode ser aplicada com segurança. -->

# 16. Questões em aberto

<!-- Open question: o que ainda não foi respondido. Pode ficar vazio, mas não omita uma questão conhecida só para fechar o caso. -->

# 17. Potencial para o livro

## 17.1 Tema ou capítulo possível

## 17.2 Pergunta pedagógica central

## 17.3 Elementos necessários

## 17.4 Exercício possível para o leitor

# 18. Referências

<!-- Prefira links para commits, pull requests, arquivos, testes e pipelines em vez de copiar código ou logs extensos. -->

# 19. Revisão posterior

| Campo | Registro |
|---|---|
| Data da revisão |  |
| Decisão ainda válida |  |
| Retrabalho observado |  |
| Efeitos não previstos |  |
| Nova evidência |  |
| Correções necessárias |  |
| Princípio ainda generalizável |  |
| Novo status |  |
