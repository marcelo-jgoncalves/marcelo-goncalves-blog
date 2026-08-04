---
name: engineering-book-capture
description: Avalia e registra aprendizados de engenharia com potencial pedagógico para o futuro livro. Use ao detectar decisões relevantes, hipóteses refutadas, erros ou limitações da IA, intervenções humanas, testes inválidos, divergências entre mocks e serviços reais, controles ineficazes, mudanças de modelo mental, trade-offs importantes, incidentes ou outros eventos não triviais e generalizáveis. Também pode ser acionada manualmente para avaliar, abrir, atualizar, concluir ou revisar um estudo de caso.
when_to_use: Acione durante tarefas de engenharia quando houver um gatilho definido em docs/book/capture-protocol.md ou quando o usuário solicitar captura editorial, registro de aprendizado, criação de caso, atualização de caso ou encerramento de caso.
argument-hint: "[assess|open|update|close|review] [case-id ou contexto opcional]"
disable-model-invocation: false
user-invocable: true
---

# Engineering Book Capture

Esta skill aplica o protocolo de captura de aprendizado do projeto e administra os estudos de caso que poderão futuramente servir de matéria-prima para um livro sobre engenharia de software assistida por IA.

## Fontes canônicas

- `docs/book/capture-protocol.md` é a fonte canônica das regras de captura — releia antes de agir.
- `docs/book/cases/templates/case-template.md` é a fonte canônica da estrutura de um caso — releia antes de abrir ou preencher um caso.
- `docs/book/cases/README.md` define a finalidade da área e a organização do diretório opcional de evidências (`docs/book/cases/evidence/CASE-NNN/`).
- Os arquivos em `docs/book/cases/` são históricos. Nunca trate um caso existente como descrição do estado operacional atual do sistema.
- Não copie o protocolo ou o template para dentro desta skill. Sempre releia os arquivos canônicos antes de criar ou modificar um caso.
- Em caso de conflito entre esta skill, o protocolo e o template, o protocolo prevalece. Relate o conflito ao usuário; nunca altere silenciosamente os arquivos canônicos.

## Ações

A skill executa cinco ações. Interprete o primeiro argumento como a ação; quando ausente, infira a partir do estado da conversa e da tarefa atual. Se não houver contexto suficiente para agir com segurança, explique objetivamente o que falta — nunca invente fatos para preencher a lacuna.

```text
/engineering-book-capture assess
/engineering-book-capture open <contexto>
/engineering-book-capture update CASE-NNN
/engineering-book-capture close CASE-NNN
/engineering-book-capture review CASE-NNN
```

### `assess` — avaliação automática

Ao identificar um possível gatilho (ver lista de gatilhos em `docs/book/capture-protocol.md`, seção "O que deve gerar um estudo de caso"):

1. releia o protocolo;
2. verifique se há aprendizado não trivial e potencialmente generalizável, distinguindo isso de um evento técnico comum;
3. procure um caso ativo já aberto sobre o mesmo assunto para evitar duplicidade;
4. classifique como `clear`, `ambiguous` ou `not-relevant`.

- **`clear`**: abra um caso mínimo antes de investigar/implementar, avise brevemente que foi aberto, e continue a tarefa sem interromper o fluxo desnecessariamente. Só abra automaticamente quando houver gatilho explícito do protocolo, aprendizado provável não trivial, informação suficiente para registrar fatos e hipótese inicial, e nenhuma necessidade de inventar decisão ou motivação humana.
- **`ambiguous`**: não crie o caso sozinho. Faça uma pergunta curta pedindo confirmação, explicando em uma frase o gatilho identificado.
- **`not-relevant`**: não crie caso, não interrompa o trabalho, não produza justificativa longa. Nem toda tarefa vira estudo de caso.

### Invocação manual

Trate o acionamento explícito como autorização para avaliar o material, mas não presuma que toda invocação exige um caso novo — verifique primeiro se o correto é abrir, atualizar, concluir ou revisar. Respeite a ação informada quando compatível com o protocolo. Se um `case-id` for informado e não existir, diga isso claramente — nunca crie um caso substituto silenciosamente. Detalhes menores podem ficar como campos vazios ou marcados como incerteza; uma decisão humana material ainda não confirmada exige pergunta, não invenção.

### `open` — abrir um caso

1. releia protocolo e template;
2. procure casos existentes para evitar duplicidade;
3. determine o próximo ID livre sem sobrescrever arquivos, no padrão `CASE-NNN-slug-descritivo.md` (ex.: `CASE-001-security-checks-did-not-gate-deploy.md`), salvo em `docs/book/cases/`;
4. copie a estrutura do template;
5. preencha somente o que é sustentado pelo estado atual, preservando campos ainda desconhecidos sem inventar valores;
6. defina `status: active` (se em andamento), `date_started`, os gatilhos identificados (`trigger_types`) e o nível de autonomia conhecido até o momento;
7. registre, quando aplicável e antes da implementação: contexto, problema observado, fatos observados, modelo mental inicial, hipótese inicial, riscos, critérios de aceitação, obrigações de prova;
8. avalie se o caso provavelmente exigirá evidência de antes e depois (ver seção dedicada abaixo) e, se sim, capture cedo — antes da implementação — o que tende a se perder depois: estado atual do Git (`git status`, hash do `HEAD`), arquivos que provavelmente serão alterados, comandos para reproduzir o estado, exemplos candidatos do problema, referências a testes existentes;
9. não reescreva depois a hipótese inicial para fazê-la parecer correta;
10. informe o caminho do arquivo criado.

Se o caso for aberto retrospectivamente por pedido manual, marque explicitamente que a reconstrução é retrospectiva e liste o que não pôde ser verificado.

### Afirmações quantitativas e tabelas de evidência

Nunca registre contagem, tamanho ou lista de arquivos de memória/estimativa. Toda afirmação quantitativa (número de documentos criados, linhas antes/depois, arquivos alterados) deve ser obtida de um comando verificável no momento do registro (`git status`, `git diff --stat`, `wc -l`, `grep -c` etc.), não recalculada de cabeça — some os números explicitamente antes de escrever o total.

Tabelas de evidência ou de classificação (ex.: tabela de migração de uma refatoração de contexto) devem ser construídas incrementalmente durante o trabalho (`update`), não reconstruídas de memória no encerramento (`close`) ou, pior, só quando o usuário pedir revisão depois. Se uma tabela desse tipo só existir pronta no momento do `close`, registre isso como limitação explícita do próprio caso.

### `update` — atualizar durante o trabalho

Leia o arquivo atual antes de editar. Preserve o conteúdo histórico já registrado — nunca reescreva silenciosamente uma hipótese anterior. Adicione apenas eventos significativos: nova evidência, hipótese descartada, tentativa que falhou, recomendação da IA rejeitada, erro/limitação da IA, intervenção humana, mudança de estratégia ou escopo, alteração de nível de autonomia, nova limitação, questão em aberto. Atualize referências (arquivos, testes, commits, PRs, pipelines) só quando elas de fato existirem.

Não registre cada comando executado, não copie logs extensos, não transcreva a conversa, não duplique grandes trechos de código, não atualize o caso apenas para marcar atividade sem aprendizado.

Quando uma informação nova contradisser um registro anterior: preserve o registro original, acrescente a nova evidência, explique a mudança — nunca apague a evolução do raciocínio.

Quando a seção "Evidência de antes e depois" for aplicável: registre novos exemplos candidatos à medida que surgirem, relacione alterações aos arquivos, atualize `baseline_ref`/`result_ref` só com referências reais (nunca inventadas), colete evidência favorável e contrária à hipótese, e decida se o volume acumulado já justifica um diretório separado de evidências. Prefira atualizar evidência já existente a criar arquivos redundantes. Não reescreva o caso como se o resultado final sempre tivesse sido previsível; registre tentativas revertidas quando forem pedagogicamente relevantes.

### `close` — encerrar o caso

Ao concluir uma tarefa relevante, avalie se há um caso ativo relacionado. Para encerrar:

1. verifique os critérios de encerramento do protocolo (seção "Critérios de encerramento de um caso");
2. registre solução final, evidências obtidas e ausentes, decisão humana final, participação efetiva da IA, intervenções humanas, tentativas malsucedidas relevantes, alternativas rejeitadas, mudança do modelo mental, princípio generalizável, limites da conclusão, questões em aberto, potencial para o livro;
3. atualize `date_closed`, `status`, `ai_autonomy_level`, referências disponíveis, e `review_after` quando necessário;
4. **antes de escolher `resolved`, verifique a tabela de obrigações de prova (`## 6.3` do template) linha a linha**: se qualquer obrigação estiver `pending`/`partially-satisfied`, ou se a conclusão depender de revisão humana ainda não feita, de um teste ainda não rodado, ou de uso real ainda não observado, **não use `resolved`** — use `active` (trabalho técnico pronto, validação em aberto) ou `paused` (trabalho interrompido). `resolved` significa que a conclusão está sustentada por evidência já obtida, não que a implementação terminou;
5. use `inconclusive` quando as evidências não permitirem conclusão, ou outro status válido do protocolo;
6. não force uma conclusão positiva, não declare obrigação de prova satisfeita sem evidência, não afirme ganho de produtividade sem métrica;
7. se a seção "Evidência de antes e depois" for aplicável, confirme antes de encerrar: existe referência do estado anterior; existe referência ou descrição verificável do estado posterior; há pelo menos um exemplo representativo, literal e rastreável; a comparação pode ser reproduzida; fatos e interpretações estão separados; limitações foram registradas; dados sensíveis foram removidos; casos contrários foram considerados; arquivos de evidência referenciados em `evidence_files` realmente existem; se o resultado ainda depende de commit futuro, isso está explícito. Se a evidência necessária ainda não existir, não a invente — mantenha o caso `active`/`paused`, registre a evidência pendente e explique o que falta para encerrar;
8. apresente um resumo curto do que foi registrado, incluindo por que aquele status (não outro) foi escolhido.

Esta skill nunca faz commit automaticamente, nem cria tags, nem altera código para facilitar a documentação.

### `review` — revisão posterior

Leia o caso, verifique a data e o objetivo da revisão. Procure apenas evidências disponíveis no repositório e no contexto autorizado — não faça pesquisa externa sem solicitação ou autorização específica. Registre: se a decisão continua válida, retrabalho observado, efeitos não previstos, novas evidências, correções necessárias, validade do princípio generalizável, novo status. Preserve o conteúdo original — não substitua a conclusão anterior sem explicar o que mudou. Atualize `last_reviewed`.

## Classificação obrigatória

Preserve, conforme o protocolo, a distinção entre `Observed fact`, `AI inference`, `AI proposal`, `AI implementation`, `Human decision`, `Human intervention`, `Automated evidence`, `Observed evidence`, `Open question` e `Limitation`.

Regras que decorrem disso: sugestão da IA não é decisão; código produzido pela IA não prova que a decisão foi da IA; teste verde não é automaticamente evidência suficiente; afirmação de Marcelo não vira fato técnico sem validação; inferência não é comportamento observado; ausência de evidência deve ser registrada como ausência de evidência.

## Proteção da autoria e das decisões

Nunca: inventar motivações de Marcelo; atribuir a Marcelo uma decisão ainda não confirmada; atribuir à IA uma decisão humana; ocultar que a IA gerou uma implementação, teste ou hipótese; ocultar que Marcelo rejeitou, limitou ou corrigiu uma proposta; preencher retrospectivamente dúvidas ou convicções não registradas; dramatizar a colaboração humano-IA; produzir narrativa promocional.

Quando a decisão humana for material e ainda não estiver clara, peça confirmação em vez de assumir.

## Relação com work items

Quando o caso tiver um pacote de execução amplo associado (instrução de mudança, criação/atualização de skill, migração documental), o pacote em si vive em `docs/engineering/work-items/`, não duplicado dentro do caso — referencie via `related_work_items` no work item e cite o caminho no caso quando relevante. Um prompt que evidencia diretamente a evolução do próprio caso (não uma mudança ampla) continua indo para `docs/book/cases/evidence/CASE-NNN/`, nunca duplicado nos dois lugares — escolha o destino principal pela função predominante do arquivo.

## Relação com o contexto operacional

Nesta skill, não altere automaticamente `CLAUDE.md`, `.project-context.md`, arquivos de `memory/` ou `docs/backlog.md`, nem duplique o conteúdo do caso neles. Se identificar que uma referência compacta ao caso seria útil no contexto operacional, apenas recomende ao final (ID, título, status, impacto operacional ainda relevante) — não execute a atualização. A integração automática com os arquivos de contexto é definida em etapa posterior do processo, ainda não implementada.

## Relação com Git

Pode ler `git status`, diffs, histórico, identificar commits e relacionar referências já existentes. Não pode, por conta própria, criar commit, alterar commit, fazer push, abrir pull request, modificar branches ou adicionar trailers a commits. Quando relevante, pode sugerir trailers como:

```text
Book-Case: CASE-000
AI-Role: investigation, implementation, test-generation
Human-Decision: descrição curta
Evidence: unit, integration, CI
```

A aplicação desses trailers depende de autorização explícita ou de uma etapa futura do processo.

## Evidência de antes e depois

Regras completas em `docs/book/capture-protocol.md`, seção "Evidência de antes e depois" — releia antes de aplicar. Resumo operacional:

- Trabalha em três camadas: exemplo curto e literal dentro do caso; referência reproduzível no Git (`git diff <baseline-ref>..<result-ref> -- <arquivo>`); pacote separado em `docs/book/cases/evidence/CASE-NNN/` só quando justificado (vários arquivos, muitos exemplos, tabela extensa, alto valor pedagógico) — não crie diretório vazio nem para tarefa rotineira.
- Nunca invente `baseline_ref`, `result_ref`, hash, tag ou commit. Enquanto o resultado só existir no working tree, deixe `result_ref` vazio e explique isso no corpo do caso.
- Nunca crie commit ou tag apenas para produzir uma referência de evidência.
- Prefira exemplo curto e comando Git reproduzível a copiar diffs ou arquivos inteiros — trechos literais extraídos do estado real, nunca reconstruídos de memória.
- Busque ativamente casos contrários ou de controle quando necessários para testar a hipótese (exemplo em que o problema não ocorreu, regressão, situação sem melhoria) — evidência de antes/depois não deve funcionar como propaganda da solução.
- Patches `.patch` são exceção, não padrão — só com alto valor pedagógico, sem segredo, tamanho razoável e justificativa explícita no caso.
- Antes de salvar qualquer trecho, patch ou arquivo de evidência: verifique credenciais, tokens, segredos, dados pessoais/de cliente ou informação confidencial (ver "Segurança e privacidade" abaixo) — nunca dependa só do repositório ser privado.

## Segurança e privacidade

Nunca registre tokens, segredos, credenciais, dados pessoais, conteúdo sensível, variáveis de ambiente privadas, logs confidenciais, conversas completas, caminhos locais desnecessários ou informações externas não verificadas. Se uma evidência contiver material sensível, registre apenas uma descrição sanitizada e indique que a evidência existe, sem copiar o conteúdo sensível para o caso. Esta verificação vale tanto para trechos dentro do caso quanto para qualquer arquivo salvo em `docs/book/cases/evidence/CASE-NNN/`.

## Continuidade durante a sessão

Trate as instruções desta skill como válidas durante todo o ciclo em que foi acionada. Não abra múltiplos casos para o mesmo problema — procure um caso ativo antes de criar outro, e mantenha-o enquanto a investigação continuar. Atualize somente diante de evento significativo. Ao final da tarefa, verifique se o caso precisa ser concluído, pausado ou mantido ativo. Não interrompa o usuário repetidamente para confirmar atualizações rotineiras.
