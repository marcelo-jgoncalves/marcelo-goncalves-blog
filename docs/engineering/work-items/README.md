# Work items

Pacotes de instrução para uma mudança específica: "o que deveria ser feito, em determinado momento, com determinado escopo." Não representam necessariamente o estado atual do projeto — representam a instrução e, depois de executados, o resultado real obtido.

## Quando um arquivo é um work item

Instruções de ajuste após auditoria, planos detalhados de refatoração, prompts de implementação usados uma única vez, criação/atualização de skill, migração documental, pacote de execução para IA, mudanças com critérios de aceite, tarefas amplas e temporais.

## Nome do arquivo

```text
docs/engineering/work-items/YYYY/MM/YYYY-MM-DD-<descricao>.md
```

Estrutura a partir de `templates/change-instruction-template.md`.

## Ciclo de vida

```text
Necessidade identificada
        ↓
Work item criado
        ↓
Aprovação humana
        ↓
Execução pela IA
        ↓
Validação
        ↓
Documento ou código canônico atualizado
        ↓
Work item marcado como executed
        ↓
Vínculo com commit, PR, auditoria ou caso
```

## Diferença para outros artefatos

Work item não substitui backlog — o backlog (`docs/backlog.md`) aponta para o work item quando houver pacote detalhado. Work item não substitui PR — o PR registra implementação e revisão. Caso do livro (`docs/book/cases/`) registra aprendizado. ADR (`docs/engineering/decisions/`) registra decisão durável. Documento canônico registra o estado vigente do sistema. Ver também `../prompts/README.md` para a diferença entre prompt reutilizável/histórico e work item.

## Preservação histórica

Não reescrever a instrução original para fazê-la parecer igual ao resultado final. Preservar escopo original, critérios originais, restrições, resultado separado, desvios e decisões posteriores — a seção "Resultado da execução" do template é anexada, nunca substitui o pedido original.
