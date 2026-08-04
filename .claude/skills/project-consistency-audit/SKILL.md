---
name: project-consistency-audit
description: Audita a coerência entre intenção, documentação, contexto operacional, implementação, evidências e controles executáveis do projeto. Detecta contradições entre fontes canônicas, documentação incompatível com o código, regras sem enforcement, deriva entre arquitetura/workflows/contexto/implementação, referências quebradas, dependência de artefatos locais não versionados, inconsistências em estudos de caso, contexto excessivo ou duplicado, e regressões em relação a avaliações anteriores.
when_to_use: Após mudanças estruturais em documentação, contexto, arquitetura ou governança da IA; antes de release; em revisão mensal; ao preparar portfólio; ou sob pedido explícito de Marcelo. Não acionar em tarefas rotineiras.
argument-hint: "[quick|full|delta|area <area>]"
disable-model-invocation: false
user-invocable: true
---

# Project Consistency Audit

Esta skill aplica a metodologia canônica de auditoria de consistência do projeto. Ela audita coerência, não corrige — é um auditor, não um executor de remediação.

## Fonte canônica

`docs/engineering/audits/project-consistency-audit.md` é a fonte canônica completa: modos, áreas, rubrica, pesos, severidade, confiança, categorias de achado, regras de comparação, privacidade e limites. **Releia esse documento antes de agir.** Esta skill não duplica a metodologia — só explica como operá-la.

Templates: `docs/engineering/audits/templates/audit-report-template.md` e `docs/engineering/audits/templates/scores-template.yaml`.

## Interpretando o comando

```text
/project-consistency-audit quick
/project-consistency-audit full
/project-consistency-audit delta
/project-consistency-audit area <area>
```

Sem argumento: trate como `quick` sobre o estado atual (diff + mudanças recentes), a menos que o contexto da conversa deixe claro que Marcelo quer `full` (ex.: "faça a auditoria completa"). Área desconhecida em `area <area>`: informe que a área não existe, liste as áreas válidas (seção 4.4 da metodologia) e não prossiga com uma auditoria genérica no lugar.

## O que ler, por modo

- **`quick`**: diff atual, arquivos alterados, fontes canônicas diretamente relacionadas, referências cruzadas, contexto (`CLAUDE.md`, `.project-context.md` se relevante), estudos de caso ativos, workflows afetados.
- **`full`**: todas as fontes da seção 5 da metodologia, proporcionalmente às áreas da seção 8. Não presuma que um arquivo existe — verifique (`Glob`/`Read`) antes de citá-lo como fonte.
- **`delta`**: o snapshot anterior mais recente compatível (`docs/engineering/audits/snapshots/`), mais o que mudou desde ele (`git log`, `git diff --stat`).
- **`area <area>`**: as fontes da área pedida (seção 11 da metodologia) mais as interfaces explícitas com outras áreas.

## Como coletar evidências

Priorize evidência direta: ler o arquivo real, rodar `git status`/`git diff`/`git log`, procurar a referência citada. Não afirme que um teste passa, que uma contagem está correta ou que um arquivo existe sem verificar no momento da auditoria — nunca reutilize números de memória ou de uma auditoria anterior sem revalidar. Quando não for possível verificar (arquivo local ausente, dependência de execução de teste fora do escopo, etc.), registre isso como limitação, não como fato.

## Como detectar inconsistências

1. Ao ler cada fonte canônica, anote a afirmação e sua origem.
2. Ao encontrar duas fontes tratando do mesmo tema, compare literalmente — não infira intenção de reconciliação.
3. Construa a matriz de contradições (seção 14 da metodologia) para qualquer tema com mais de uma fonte relevante.
4. Para cada regra relevante encontrada, classifique sua maturidade de enforcement (seção 15 da metodologia) — não presuma que uma regra documentada é seguida.
5. Para referências (caminhos, comandos, componentes citados), verifique a existência real antes de reportar como quebrada ou válida.

## Como avaliar notas

Siga a rubrica e os pesos da seção 9/10 da metodologia. Nunca aumente uma nota sem uma das evoluções listadas na seção 18. Nunca calcule nota global a partir de áreas não auditadas nesta execução — marque-as `not-assessed`. Em `quick`/`area`, não produza nota global; produza, no máximo, a nota da própria área quando aplicável, com a ressalva explícita de que não substitui avaliação abrangente.

## Como comparar snapshots

Ver seção 17 da metodologia. Localize o snapshot anterior mais recente com `schema_version`/`weights_version` compatíveis; se não houver, declare ausência de baseline em vez de inventar uma comparação. Nunca reescreva um snapshot ou relatório anterior — cada execução gera artefatos novos, datados.

## Quando criar relatório e snapshot

- `full`: sempre cria relatório e snapshot.
- `delta`: sempre cria relatório e snapshot (mesmo quando não há baseline, documentando essa ausência).
- `area`: cria relatório da área; snapshot só se a extensão dos achados justificar preservação, ou se pedido.
- `quick`: opcional — só quando solicitado explicitamente ou quando o comando indicar intenção clara de preservação (ex.: "documente isso", "quero registrar esses achados"). Uma checagem rápida de rotina não precisa gerar arquivo.

Nomeação: `docs/engineering/audits/reports/<ano>/<data>-<modo>-project-audit.md` e `docs/engineering/audits/snapshots/<ano>/<data>-<modo>-scores.yaml`, com `<data>` em `YYYY-MM-DD` e `<ano>` o mesmo `YYYY`. Nunca sobrescrever um relatório ou snapshot existente — se a data colidir (duas execuções no mesmo dia), acrescente um sufixo numérico. Criar a pasta do ano quando ainda não existir.

## Quando parar

Pare e peça decisão humana quando: a autoridade entre duas fontes canônicas conflitantes não estiver clara; um achado crítico depender de acesso a um recurso não disponível (AWS, produção); o working tree estiver sujo de um jeito que impeça atribuir corretamente o estado ao commit auditado; ou a tarefa pedir correção junto com auditoria (a auditoria continua não corretiva — ofereça separar em duas tarefas).

## O que esta skill nunca deve fazer

Tudo listado na seção "Comportamento não corretivo" da metodologia: corrigir código ou documentação, reorganizar arquivos, implementar lint, alterar workflows/infraestrutura, instalar dependências, commit, push, abrir PR, atualizar notas anteriores, esconder achados, ou alterar `.gitignore` silenciosamente (ver "Versionamento" abaixo). Também nunca inventa baseline, hash, tag, contagem ou arquivo de evidência — ausência de dado é reportada como ausência, não preenchida por inferência.

## Como reportar limitações

Toda execução declara, no relatório, o que não foi inspecionado (arquivos fora do escopo do modo, dependências externas não verificadas, testes não executados) e por quê. Uma auditoria `quick` que não olhou para `infra/` diz isso explicitamente, em vez de omitir a área.

## Interação com `engineering-book-capture`

Ver seção 22/23 da metodologia. Ao final da auditoria, se algum achado tiver valor pedagógico não trivial (contradição de autoridade não óbvia, falha de enforcement com histórico real, divergência documentação-vs-código, princípio de governança de IA extraível), avalie conforme `docs/book/capture-protocol.md` e, se aplicável, acione `engineering-book-capture` ou pergunte, seguindo as mesmas regras de `clear`/`ambiguous`/`not-relevant` daquela skill. Não abra caso automaticamente só porque a auditoria em si é um evento não trivial — a criação desta skill, por exemplo, é avaliada separadamente, sem ser forçada. Nunca duplique o conteúdo de um caso dentro do relatório de auditoria — referencie pelo ID.

## Versionamento desta skill

`.gitignore` versiona `.claude/skills/**` (decisão explícita de Marcelo, 2026-08-04) e continua ignorando `.claude/settings.json`/`.claude/settings.local.json`, que são locais por natureza (variam por máquina). As 3 skills canônicas (`engineering-book-capture`, `post-planning`, `project-consistency-audit`) chegam junto num clone novo do repositório; `dev-hub` é preferência de fluxo de trabalho local do Marcelo e fica de fora por exceção explícita no `.gitignore`. Esta skill não altera `.gitignore` por conta própria fora de decisão explícita já registrada — qualquer mudança futura de escopo exige nova decisão explícita de Marcelo.
