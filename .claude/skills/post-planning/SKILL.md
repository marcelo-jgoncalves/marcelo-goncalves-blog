---
name: post-planning
description: Gera um planejamento de postagem (pauta/outline, não o texto final) para o blog, seguindo o modelo de 14 seções já estabelecido na série. Acionar manualmente, no momento em que uma decisão/investigação real da sessão parecer boa matéria-prima de post — não é automático.
trigger: "/post-planning", pedido explícito para criar planejamento de postagem, pauta ou outline de post
---

# Post Planning — Gerador de pauta de postagem no padrão da série

Gera um arquivo de planejamento de postagem (pauta/outline) em `editorial/plans/YYYY/MM/`, seguindo exatamente o modelo de 14 seções consolidado nos arquivos `21`, `22`, `23` da série histórica (hoje em `projects/publishing-content/postagens/`, fora do repositório — consultar lá como referência de padrão, não como destino de novos arquivos). **Não escreve o texto final do post** — só o planejamento que orienta quem escrever depois.

Fonte canônica de destino e ciclo de vida: `editorial/README.md` e `editorial/plans/README.md` — releia antes de gerar um arquivo novo.

## Quando acionar

Esta skill não roda sozinha nem detecta o momento automaticamente. É acionada manualmente, geralmente por mim mesmo (durante a sessão) quando percebo que uma decisão, investigação ou correção de rumo real tem o perfil da série: nasce de auditoria estruturada, de uma pergunta direta de processo/arquitetura, ou de uma sequência de tentativa→correção que vale documentar — não de um bug isolado sem storytelling.

**Quem aciona decide, não a skill.** Se estiver em dúvida se o momento é bom, perguntar ao Marcelo antes de gerar o arquivo.

## O que o orquestrador (eu, na sessão) precisa reunir ANTES de acionar

Esta skill não tem acesso ao histórico da conversa nem investiga o código por conta própria em busca do "porquê" — ela monta o arquivo a partir do que for passado no prompt. Antes de acionar, reunir:

1. **O tópico/tese** — qual decisão, achado ou princípio está sendo documentado.
2. **Arquivos e trechos de código reais envolvidos** — caminhos exatos, e o trecho relevante (não paráfrase).
3. **Antes/depois, quando existir** — valores, comportamento ou código anterior vs. o resultado final.
4. **A linha do tempo real, quando houver um arco de investigação** — sintoma → hipótese → tentativa 1 (e por que não resolveu) → tentativa(s) seguinte(s) → causa real → correção final. Se a decisão foi direta (pergunta → resposta, sem becos sem saída), não inventar um arco — omitir a seção.
5. **Referências externas citadas** (papers, palestras, nomes de autores) — só incluir o que for genuinamente usado no raciocínio, não enfeite.
6. **Posts irmãos temáticos**, se algum já existente tocar em tema parecido — checar tanto `editorial/plans/` (planejamentos novos, neste repositório) quanto a série histórica em `projects/publishing-content/postagens/` (fora do repositório, arquivos `01`-`24`).

Quanto mais concreto o que for passado (código real, não resumo do código), melhor o planejamento final — a skill não deve preencher lacunas com exemplos genéricos ou hipotéticos além do estritamente necessário para ilustrar um contraponto.

## Localização e convenção de arquivo

- Pasta: `editorial/plans/YYYY/MM/` (dentro do repositório `marcelo-goncalves-blog`, versionada — repositório é público, ver "Segurança" abaixo antes de commitar).
- Nome do arquivo: `YYYY-MM-DD-{slug-curto}.md`, com `YYYY/MM` a data de criação.
- Estruturar a partir de `editorial/plans/templates/post-plan-template.md` (front matter de ciclo de vida) + o modelo de 14 seções desta skill (corpo do arquivo).
- Gerar `id: POST-PLAN-YYYY-NNN` estável (checar o maior `NNN` já usado no ano antes de gerar) e preencher `source_skill: post-planejamento`.
- Não sobrescrever um planejamento existente; ao atualizar um já criado, atualizar `updated_at`.
- Não armazenar o texto do post publicado por completo no arquivo — depois de `status: published`, preencher `canonical_content` com slug/URL real e não replicar o conteúdo final aqui.

### Segurança (repositório público)

Antes de salvar o arquivo, revisar o conteúdo reunido pelo orquestrador contra credenciais, dados pessoais, nomes de clientes e informação interna confidencial. Marcar `contains_sensitive_content: true` no front matter quando aplicável — isso não impede a criação do arquivo, mas sinaliza que ele precisa de revisão humana antes de ser commitado.

## O modelo — 14 seções, nesta ordem exata

Seguir o padrão mais recente e mais completo (arquivos `21`-`23` em diante), não o modelo mais simples dos primeiros arquivos da série (`01`-`20`):

1. `# Post Standalone: "Título"` — título principal como manchete, chamativo mas honesto (não clickbait vazio)
2. `## Títulos alternativos` — 2-3 variações
3. `## Por que este post é diferente dos demais` — **só incluir quando fizer sentido**: quando o post foge do padrão "post de critério de auditoria formal" (nasce de pergunta direta em sessão normal, ou de um arco de investigação atípico) — explica a origem e o que o torna atípico na série. Omitir se o post for um post de critério padrão da auditoria-mãe.
4. `## Tese central` — a ideia central em 1 parágrafo denso, sem enrolação
5. `## Por que importa` — 2-4 razões numeradas, cada uma justificando por que o leitor deveria se importar (não "é interessante", e sim consequência prática)
6. `## Linha do tempo real (quando houver)` — registro cru da investigação, na ordem em que aconteceu: sintoma observado → hipótese → tentativa 1 (e o que ela não resolveu / revelou) → tentativa(s) seguinte(s) → causa real identificada → correção final. **Omitir esta seção inteira** se a decisão não teve arco de tentativa-erro (pergunta direta → resposta certa de primeira). Esta seção é material bruto; a seção 7 é a versão já lapidada para o leitor.
7. `## Storytelling sugerido` — narrativa em "movimentos" numerados (Primeiro movimento, Segundo movimento, Terceiro movimento...), cada um dizendo o que mostrar e por quê, terminando num fechamento que generaliza a lição
8. `## Provas e exemplos reais` — bullets com caminhos de arquivo reais, valores antes/depois, números concretos. Nunca abstrair em "imagine um sistema que..." — se o exemplo reunido pelo orquestrador não tiver número/caminho real, não inventar um
9. `## Trechos de código reais para ilustrar o post` — blocos de código reais (extraídos do que foi passado, não reescritos de memória) prontos para embutir no texto final. Pseudocódigo só é aceitável quando explicitamente marcado como hipotético (ex.: simular o custo de uma abstração que não chegou a ser escrita)
10. `## Conceitos a explicar` — definições dos termos técnicos usados, cada um em 1-2 frases, sem jargão não explicado
11. `## Estrutura sugerida (H2s)` — lista numerada dos H2s do post final, cada um com sub-bullets do que cobrir
12. `## Fecho / CTA` — parágrafo final como citação direta, pronto para uso sem edição
13. `## Fonte interna` — sessão/data de origem, commits reais (se houver), arquivos reais citados, posts irmãos temáticos linkados (formato `NN-nome.md`)
14. `## Notas de escrita` — regras de tom específicas deste post e o que não cortar na edição (ex.: "não esconder a correção de rumo da sessão", "evitar tom de alarme genérico")

## Regras de conteúdo (inegociáveis)

- Todo planejamento cita números/arquivos/commits reais do projeto — nunca abstrair exemplos em genérico.
- Tom: peer técnico sênior narrando investigação real, não "10 dicas" nem tom de marketing. Sem emoji, sem analogia forçada, sem "você já passou por isso?" genérico.
- Post que nasce de decisão de processo/arquitetura (não de bug nem de auditoria formal) segue o mesmo perfil de `20`/`21`/`22`/`23`: pergunta direta em sessão normal vira gancho do post — incluir a seção 3 ("Por que este post é diferente dos demais") nesse caso.
- Não inventar linha do tempo, referência externa, ou trecho de código que não tenha sido fornecido pelo orquestrador ou verificado no código real.

## Depois de gerar

1. Confirmar o `id`/nome de arquivo usado (não colidir com um já existente em `editorial/plans/YYYY/MM/`).
2. Não fazer commit — deixar pronto e avisar, mesmo padrão do resto do projeto.
3. Reportar de volta ao orquestrador/usuário: caminho do arquivo criado, e se alguma seção do modelo foi omitida (e por quê — ex. "sem linha do tempo real, decisão foi direta").
