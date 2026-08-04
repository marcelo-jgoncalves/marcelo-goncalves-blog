# Fluxo de trabalho assistido por IA

Detalhes por trás das regras resumidas no `CLAUDE.md`. Estabelecido com Marcelo a partir da sessão 35 (2026-05-22), reforçado em sessões posteriores.

## Analysis vs Action

Quando solicitado análise:

- ler código/arquivos, extrair dados, apresentar achados;
- nunca modificar código na análise;
- ação requer instrução explícita ("mude", "aplique", "fix" etc.).

## Questions Only Answer

Quando perguntado algo:

- responder a pergunta especificamente;
- não assumir ações adicionais;
- não tomar ação baseada na resposta sem novo pedido.

## Incremental Investigation Protocol

Ao debugar problemas:

- **ANTES**: estado atual + modelo mental + hipótese + mudança mínima + teste;
- **DEPOIS**: resultado + diferença vs. esperado;
- **APRENDIZADO**: modelo mental atualizado + por que falhou + próxima hipótese.

Investigações com valor pedagógico usam o mecanismo de captura de aprendizado (`docs/book/capture-protocol.md` + skill `engineering-book-capture`) em vez de um arquivo de rastreamento paralelo.

## Colaboração — preferências duráveis

Padrões recorrentes de feedback e restrições específicas do ambiente de trabalho (ex.: regra de uma operação por chamada de Bash, preferência por ciclos pequenos) vivem em `memory/feedback_*.md`, não duplicados aqui.

## Critério de conclusão de um ciclo

- validação é proporcional ao risco (ver `docs/engineering/standards/testing-strategy.md`);
- cada tipo de mudança possui obrigação de prova própria;
- o ciclo termina quando as validações exigidas para aquele nível de risco passam;
- a suíte completa não é automaticamente necessária para toda alteração;
- pipeline verde é obrigatório quando houver push ou execução de pipeline aplicável;
- `.project-context.md` só é atualizado quando o estado necessário para uma sessão futura realmente mudou — não a cada sessão por definição.

## Commit e push

Nunca commitar ou fazer push automaticamente ao fim de um ciclo, mesmo validado. Deixar o trabalho pronto e avisar; executar `git add`/`commit`/`push` apenas quando Marcelo pedir explicitamente naquele momento.
