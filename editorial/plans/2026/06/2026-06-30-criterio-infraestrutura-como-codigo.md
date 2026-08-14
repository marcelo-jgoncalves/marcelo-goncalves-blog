---
id: POST-PLAN-2026-009
schema_version: "1.0"
title: "Post 8 da série: Infraestrutura como Código — \"O arquivo de produção que ainda não existe de verdade\""
created_at: 2026-06-30
updated_at: 2026-06-30
status: idea
channels: []
source_skill: post-planejamento
planned_publication:
published_at:
canonical_content:
related_case:
related_work_items: []
tags: []
contains_sensitive_content: false
---

<!-- Migrado de projects/publishing-content/postagens/09-criterio-infraestrutura-como-codigo.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post 8 da série: Infraestrutura como Código — "O arquivo de produção que ainda não existe de verdade"

## Títulos alternativos
- "Escrevemos a regra. O arquivo de configuração não obedeceu."
- "Produção, no papel, ainda não é produção"

## Tese central

Infraestrutura como código promete reprodutibilidade — o mesmo código gera o mesmo ambiente, em qualquer estágio. O achado deste post mostra a falha clássica dessa promessa: o documento de padrões do projeto declara explicitamente o que produção *deve* ter, mostra até um exemplo de configuração — mas o arquivo real de configuração de produção, no repositório, não corresponde a esse exemplo. A regra existe em prosa. Não existe em `.tfvars`.

## Por que importa

É o tipo de gap que só é descoberto tarde — porque, até o primeiro deploy real de produção, ele não tem efeito nenhum. Documentar a regra não é o mesmo que aplicá-la; o post ensina o leitor a verificar essa distância antes que ela importe.

## Storytelling sugerido

Abra mostrando, lado a lado, duas coisas: o trecho do `contract.md` que diz, em letras maiúsculas, que tracing e alarmes são "OBRIGATÓRIO em produção" — com um exemplo de `prod.tfvars` ilustrando os valores esperados — e o `prd.tfvars` real do repositório, que simplesmente não define essas três variáveis. Sem definição, elas caem no valor padrão: o mesmo de desenvolvimento. A regra escrita e o arquivo real divergem, e ninguém precisou mentir para isso acontecer — bastou esquecer de uma linha.

Conecte com a ideia maior: "infraestrutura como código" só cumpre a promessa de reprodutibilidade se o código for, de fato, a fonte da verdade — não a documentação ao lado dele. Documentação que descreve uma intenção não aplicada é, na prática, ficção.

Segundo achado, mais leve, bom para fechar com humor seco: a tag `Project` nos recursos AWS diz `"marcelo-goncalves-tech"`; todo o resto do projeto usa `"marcelo-goncalves-blog"`. Um relatório de custo filtrado pelo nome certo do projeto não encontraria nada.

## Provas e exemplos reais

- `docs/contract.md`: "AWS X-Ray tracing é obrigatório em produção" / "Alarmes CloudWatch são obrigatórios em produção" — com bloco de exemplo `prod.tfvars` mostrando `enable_xray_tracing = true`, `enable_cloudwatch_alarms = true`, `alarm_email = "oncall@example.com"`.
- `infra/env/prd.tfvars` real: não define nenhuma das três variáveis — caem no default de `variables.tf` (`false`, `false`, `""`), idêntico a dev.
- `infra/providers.tf:33`: `default_tags.Project = "marcelo-goncalves-tech"` vs. `project_name = "marcelo-goncalves-blog"` usado em todo o resto (nomes de recursos, buckets).
- Contraponto positivo real: state remoto via S3 + lock DynamoDB, com configuração de backend injetada em runtime (nunca hardcoded); `.gitignore` comenta explicitamente por que os `.tfvars` são commitados (não têm segredo) — decisão documentada, não acidental; `log_retention_days` corretamente aplicado em 10 log groups diferentes; `provisioned_concurrency` é diferença deliberada e documentada entre dev (0, economia) e prod (1, elimina cold start).

## Conceitos a explicar

- **IaC (Infrastructure as Code)**: descrever infraestrutura em arquivos versionados (Terraform, aqui) em vez de configurar manualmente no console — a promessa central é "o mesmo código, o mesmo resultado, em qualquer ambiente".
- **Variável com valor default**: quando um arquivo de ambiente não sobrescreve uma variável, ela silenciosamente usa o valor padrão definido no módulo — não é um erro de sintaxe, então nada avisa que isso aconteceu.
- **Tags de recursos AWS**: metadados usados para agrupar custo/recursos por projeto/ambiente — uma tag errada não quebra nada tecnicamente, mas invalida silenciosamente qualquer relatório que dependa dela.

## Estrutura sugerida (H2s)

1. A regra escrita em letras maiúsculas
2. O arquivo que deveria obedecer a regra — e não obedece
3. Por que isso não tem efeito hoje (e exatamente quando vai ter)
4. A tag errada: um lembrete de que "documentado" e "verdadeiro" são coisas diferentes
5. O que já está certo nesse Terraform (e por que vale reconhecer antes de só apontar o erro)

## Fecho / CTA

Aponta para o post de Dependências ("a mesma lição — o que está documentado como verdade pode estar desatualizado — aparece de novo, e de forma mais urgente, no próximo post").

## Fonte interna

`docs/auditoria-engenharia/08-infraestrutura-como-codigo.md`
