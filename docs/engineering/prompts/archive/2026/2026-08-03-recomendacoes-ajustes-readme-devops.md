---
id: PROMPT-2026-013
title: "Recomendações de Ajustes do README"
created_at: 2026-08-03
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
contains_sensitive_content: false
---

<!-- Migrado de marcelo-goncalves-blog-arquivo/prompts/recomendacoes-ajustes-readme-devops.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Recomendações de Ajustes do README

## Projeto

`mgoncalves-editorial-platform`

## Objetivo

Aprimorar o README para que ele funcione melhor como peça de portfólio profissional para vagas de:

- DevOps Engineer;
- Cloud Engineer;
- Platform Engineer;
- SRE;
- Arquiteto de Soluções AWS.

O README deve continuar apresentando o produto, mas sua prioridade deve ser demonstrar:

- senioridade técnica;
- domínio de AWS;
- capacidade de arquitetura;
- infraestrutura como código;
- CI/CD;
- segurança;
- observabilidade;
- confiabilidade;
- tomada de decisão;
- autoria;
- capacidade de operação.

---

# 1. Avaliação atual

## Nota como peça de portfólio DevOps

**8,2/10**

O README já é forte e demonstra um projeto tecnicamente avançado.

Ele comunica bem:

- arquitetura serverless;
- AWS;
- Terraform;
- GitHub Actions;
- segurança;
- observabilidade;
- testes;
- automação;
- preocupações operacionais.

O principal problema é que ele vende melhor o produto do que o autor como engenheiro DevOps.

Um recrutador técnico provavelmente compreenderá a profundidade do projeto. Porém, um recrutador ou gestor que leia apenas os primeiros 30 a 60 segundos pode não perceber imediatamente:

- o que foi projetado pelo autor;
- quais problemas foram resolvidos;
- quais decisões foram tomadas;
- quais trade-offs foram avaliados;
- quais resultados foram alcançados;
- por que o projeto demonstra experiência relevante para DevOps.

---

# 2. Reestruturar a abertura do README

## Problema

A abertura atual destaca primeiro a plataforma editorial e suas funcionalidades.

Isso pode fazer o leitor pensar inicialmente em:

- blog;
- CMS;
- plataforma de conteúdo;
- produto com inteligência artificial.

O principal diferencial profissional, porém, é a engenharia da plataforma.

## Ajuste recomendado

A primeira frase deve apresentar o projeto como uma plataforma AWS completa.

### Exemplo de abertura

```md
# Serverless Editorial Platform

Production-grade AWS serverless platform designed and implemented end to end with Terraform, GitHub Actions, automated testing, security controls and full-stack observability.

The application domain is a multilingual editorial platform with an administrative CMS, scheduled publication, asynchronous media processing and content distribution.
```

## Resultado esperado

Nos primeiros segundos, o leitor deve compreender que:

1. o projeto usa AWS;
2. a arquitetura é serverless;
3. a infraestrutura foi criada com Terraform;
4. existe CI/CD;
5. existem segurança e observabilidade;
6. o projeto demonstra engenharia de plataforma;
7. o domínio funcional é editorial.

---

# 3. Adicionar uma seção “Engineering highlights”

Criar uma seção curta logo após a abertura.

Ela deve apresentar de seis a oito destaques de engenharia.

### Exemplo

```md
## Engineering highlights

- 100% AWS infrastructure provisioned with Terraform.
- GitHub Actions CI/CD using AWS OIDC and no persistent cloud credentials.
- Specialized Lambda functions with least-privilege IAM roles.
- DynamoDB transactions and optimistic concurrency for consistent writes.
- Unit, integration and browser tests executed before deployment.
- Security gates with Semgrep, Gitleaks, Trivy, TFLint and dependency audits.
- Distributed tracing, alarms, synthetic monitoring and SLO burn-rate alerts.
- Asynchronous media processing with retries and dead-letter queues.
```

## Critérios

A seção deve:

- ser curta;
- evitar detalhes funcionais secundários;
- destacar os pontos mais relevantes para DevOps;
- ser compreensível sem ler o restante do README.

---

# 4. Adicionar uma seção explícita de autoria

## Problema

O README descreve o sistema, mas não deixa claro o suficiente o que foi projetado e implementado pelo autor.

Um contratante pode ficar em dúvida sobre:

- quanto do projeto foi criado pelo candidato;
- se a arquitetura veio de tutorial;
- se houve participação de outras pessoas;
- se o candidato entende profundamente as decisões;
- se apenas integrou ferramentas prontas.

## Ajuste recomendado

Criar uma seção:

```md
## What I engineered
```

### Texto sugerido

```md
## What I engineered

I designed and implemented the platform architecture, AWS infrastructure, Terraform modules, CI/CD workflows, backend services, operational controls and observability model.

Key responsibilities included:

- defining the serverless AWS architecture;
- implementing infrastructure as code;
- designing the deployment pipeline;
- configuring OIDC and least-privilege IAM;
- implementing DynamoDB consistency controls;
- designing asynchronous workflows;
- implementing monitoring and incident signals;
- creating the automated test strategy.
```

## Regras

A seção deve:

- ser objetiva;
- evitar tom exagerado;
- afirmar apenas o que foi realmente implementado;
- diferenciar claramente autoria técnica de funcionalidades do produto.

---

# 5. Adicionar uma seção de decisões de engenharia

## Objetivo

Demonstrar que as tecnologias não foram escolhidas aleatoriamente.

O leitor deve compreender:

- por que cada decisão foi tomada;
- qual problema ela resolve;
- qual trade-off foi aceito.

## Estrutura recomendada

```md
## Key engineering decisions

| Decision | Reason | Trade-off |
|---|---|---|
| Serverless AWS architecture | Low idle cost and independent scaling | Increased integration complexity |
| DynamoDB | Predictable serverless operation | Requires deliberate access-pattern design |
| OIDC for CI/CD | Removes persistent AWS credentials | Requires trust-policy management |
| DynamoDB Local integration tests | Detects behavior missed by mocks | Slower than unit tests |
| Opaque admin sessions | Keeps Cognito tokens out of browser storage | Requires session storage and cleanup |
| OpenNext | Supports Next.js on AWS serverless infrastructure | Adds packaging and deployment complexity |
```

## Decisões que podem ser incluídas

- arquitetura serverless;
- DynamoDB;
- Terraform;
- OpenNext;
- OIDC;
- sessão opaca;
- integração com DynamoDB Local;
- processamento assíncrono;
- DLQ;
- CloudFront;
- Cognito;
- observabilidade;
- SLO burn-rate;
- monorepo com workspaces.

---

# 6. Adicionar uma seção de problemas reais resolvidos

## Objetivo

Mostrar raciocínio de engenharia e aprendizado operacional.

## Nome sugerido

```md
## Engineering challenges solved
```

## Estrutura sugerida

```md
### Problem

Mocks were not detecting DynamoDB transaction and expression errors.

### Decision

Introduced integration tests against DynamoDB Local in the CI pipeline.

### Result

The pipeline now validates real DynamoDB behavior before deployment.
```

## Problemas que podem ser documentados

- evitar access keys AWS permanentes;
- proteger atualizações concorrentes;
- manter contadores consistentes;
- impedir exposição de tokens no navegador;
- detectar erros não identificados por mocks;
- implementar publicação programada;
- lidar com processamento assíncrono;
- invalidar cache corretamente;
- preservar state durante refatorações Terraform;
- bloquear deploy quando scans falham;
- padronizar contratos entre backend e admin.

## Regras

Cada item deve conter:

1. problema;
2. decisão;
3. resultado;
4. eventualmente o trade-off.

Evitar narrativas longas.

---

# 7. Reordenar as seções

## Problema

Atualmente, detalhes funcionais do produto podem receber a mesma prioridade visual que arquitetura, segurança e CI/CD.

Para um contratante DevOps, elementos como:

- embeds;
- pull quotes;
- recursos editoriais;
- ebooks;
- funcionalidades de conteúdo;

não devem aparecer antes ou com o mesmo peso de:

- Terraform;
- OIDC;
- IAM;
- CI/CD;
- DLQ;
- observabilidade;
- testes;
- segurança;
- SLOs.

## Ordem recomendada

1. título e proposta técnica;
2. badges e links;
3. engineering highlights;
4. what I engineered;
5. key engineering decisions;
6. arquitetura;
7. CI/CD;
8. segurança;
9. observabilidade;
10. testes;
11. FinOps;
12. desafios resolvidos;
13. funcionalidades do produto;
14. execução local;
15. status atual;
16. roadmap.

---

# 8. Adicionar evidências verificáveis

## Problema

Afirmações como:

- production-grade;
- 100% IaC;
- centenas de testes;
- good Core Web Vitals;
- auditoria SEO;
- no manual clicks;

podem parecer autoatribuídas sem evidências visíveis.

## Ajustes recomendados

Adicionar:

- badge da pipeline;
- badge do workflow de segurança;
- link para a última execução verde;
- link para o ambiente de desenvolvimento;
- badge de cobertura, caso confiável;
- screenshot de dashboard;
- relatório de Core Web Vitals;
- resultado de auditoria SEO;
- custo estimado;
- disponibilidade observada;
- contagem automática de testes.

### Exemplo

```md
[![CI/CD](...)](...)
[![Security](...)](...)
[![Tests](...)](...)
```

## Regras

- não usar badges decorativos sem valor;
- preferir evidências verificáveis;
- evitar números mantidos manualmente;
- automatizar contagem e status sempre que possível.

---

# 9. Adicionar uma seção FinOps

## Problema

O projeto possui preocupação com custos, mas o README não evidencia isso de forma concreta.

Para vagas de DevOps e Cloud, isso é um diferencial importante.

## Conteúdo recomendado

- custo mensal estimado do ambiente `dev`;
- principais componentes de custo;
- serviços que escalam para zero;
- uso de pay-per-request;
- custos fixos;
- custos de observabilidade;
- alarmes de orçamento;
- justificativa da arquitetura serverless.

### Exemplo

```md
## Cost profile

The development environment is designed for low idle cost. Most application components scale to zero or use pay-per-request pricing.

Estimated monthly cost under the current traffic profile: approximately US$ X–Y.

Main cost drivers:

- CloudWatch logs and metrics;
- CloudWatch Synthetics Canary;
- GuardDuty;
- CloudTrail data events;
- CloudFront requests and transfer;
- Lambda invocations.
```

## Regras

- usar estimativas realistas;
- indicar a data da estimativa;
- explicar premissas;
- não apresentar custo como garantia absoluta.

---

# 10. Corrigir inconsistências documentais

## Problema

O README deve refletir exatamente o estado atual do repositório.

Verificar:

- número de workspaces;
- comandos de instalação;
- scripts disponíveis;
- árvore do repositório;
- pacote de contratos;
- versão do Node;
- versão do Terraform;
- ambientes ativos;
- quantidade de Lambdas;
- quantidade de módulos;
- número de testes;
- status de funcionalidades.

## Critério

Todo comando apresentado deve funcionar quando copiado.

## Ajustes recomendados

- remover scripts inexistentes;
- atualizar a árvore de diretórios;
- incluir `packages/contracts`;
- garantir que o número de workspaces esteja correto;
- alinhar README e `package.json`;
- alinhar README e workflows;
- alinhar README e Terraform.

## Automação recomendada

Criar verificações para:

- links quebrados;
- comandos inválidos;
- versão de ferramentas;
- estrutura documentada;
- número de testes, quando possível.

---

# 11. Melhorar a comunicação sobre produção

## Problema

A frase:

```text
production doesn't exist yet
```

é honesta, mas pode soar excessivamente negativa.

## Formulação recomendada

```md
## Current status

The development environment is currently deployed and operational.

The production workflow and Terraform definitions are implemented, but the production environment has not yet been provisioned.

AI-assisted editorial features remain on the roadmap and are not represented as completed functionality.
```

## Resultado esperado

Comunicar que:

- `dev` está ativo;
- produção ainda não foi criada;
- a infraestrutura e pipeline de produção já foram projetadas;
- funcionalidades futuras não são apresentadas como concluídas.

---

# 12. Reduzir a prioridade visual de detalhes editoriais

## Ajuste

Mover funcionalidades específicas do produto para uma seção posterior.

Exemplos:

- editor de conteúdo;
- embeds;
- pull quotes;
- geração de ebook;
- integração editorial;
- recursos de SEO;
- publicação em redes sociais.

Esses recursos devem continuar documentados, mas não dominar a primeira metade do README.

## Objetivo

Garantir que o leitor perceba primeiro:

- arquitetura;
- segurança;
- CI/CD;
- infraestrutura;
- confiabilidade;
- observabilidade;
- decisões técnicas.

---

# 13. Melhorar a seção de arquitetura

## Ajuste

Manter os diagramas atuais, pois são um dos maiores pontos fortes.

Antes dos diagramas, adicionar um resumo curto:

```md
## Architecture

The platform uses an event-driven serverless architecture on AWS. Public content is delivered through CloudFront, administrative operations are protected through Cognito and opaque sessions, and asynchronous workloads are isolated through queues, retries and dead-letter handling.
```

## Diagramas recomendados

- visão geral;
- leitura pública;
- autenticação;
- gravação administrativa;
- processamento de mídia;
- publicação programada;
- observabilidade;
- segurança.

## Regras

- evitar diagramas repetitivos;
- explicar cada diagrama em dois ou três parágrafos;
- indicar decisões e limites;
- manter nomes alinhados ao código e Terraform.

---

# 14. Melhorar a seção de CI/CD

## Conteúdo recomendado

Explicar o fluxo de gates:

```text
lint
→ typecheck
→ unit tests
→ integration tests
→ security scans
→ Terraform validation
→ build
→ deploy
→ browser smoke
```

## Explicar

- OIDC;
- ausência de credenciais permanentes;
- actions fixadas por SHA;
- auditoria de dependências;
- Semgrep;
- Gitleaks;
- Trivy;
- TFLint;
- DynamoDB Local;
- aprovação de produção;
- plano Terraform armazenado;
- aplicação do plano aprovado;
- smoke tests.

## Evitar

- excesso de YAML no README;
- repetir todo o workflow;
- listar ferramentas sem explicar sua função.

---

# 15. Melhorar a seção de segurança e confiabilidade

## Itens a destacar

- OIDC;
- least-privilege IAM;
- CloudFront OAC;
- Cognito;
- sessão opaca;
- cookies seguros;
- sanitização server-side;
- security headers;
- Semgrep;
- Gitleaks;
- Trivy;
- dependency audit;
- DLQ;
- retries;
- alarmes;
- tracing;
- Canary;
- SLOs.

## Estrutura sugerida

```md
## Security and reliability

### Identity and access

...

### Application security

...

### Supply-chain security

...

### Failure handling

...

### Observability

...
```

---

# 16. Adicionar uma seção de evidências operacionais

## Nome sugerido

```md
## Operational evidence
```

## Incluir

- link para Actions;
- status atual da pipeline;
- número de testes;
- ambiente ativo;
- screenshots;
- métricas;
- dashboards;
- disponibilidade do Canary;
- custo estimado;
- eventos de deploy;
- tempo médio de pipeline.

## Regras

- não expor dados sensíveis;
- não compartilhar IDs de conta;
- não compartilhar secrets;
- não compartilhar URLs internas privadas;
- anonimizar informações quando necessário.

---

# 17. Manter a execução local simples

## Objetivo

Um recrutador técnico deve conseguir entender rapidamente como executar ou validar o projeto.

## Regras

- usar comandos atuais;
- evitar passos redundantes;
- informar pré-requisitos;
- explicar variáveis de ambiente;
- separar execução completa de execução por componente;
- informar limitações locais.

## Estrutura sugerida

```md
## Local development

### Requirements

- Node.js 24
- npm
- Docker
- Terraform
- AWS CLI

### Install

...

### Run the admin

...

### Run the frontend

...

### Run backend tests

...

### Run integration tests

...
```

---

# 18. Avaliação por critério

| Critério | Nota atual |
|---|---:|
| Profundidade técnica | **9,3** |
| Demonstração de DevOps/Cloud | **9,0** |
| Clareza arquitetural | **9,2** |
| Credibilidade das evidências | **8,0** |
| Leitura rápida por recrutador | **7,4** |
| Posicionamento pessoal | **6,8** |
| Qualidade geral como portfólio | **8,2** |

---

# 19. Prioridades de implementação

## P0 — Impacto imediato

1. Reescrever a abertura.
2. Adicionar `Engineering highlights`.
3. Adicionar `What I engineered`.
4. Adicionar `Key engineering decisions`.
5. Corrigir inconsistências documentais.
6. Adicionar badges e links para evidências.

## P1 — Reforço da credibilidade

7. Adicionar problemas reais resolvidos.
8. Documentar trade-offs.
9. Adicionar FinOps.
10. Adicionar evidências operacionais.
11. Reorganizar as seções.

## P2 — Refinamento

12. Reduzir prioridade de detalhes editoriais.
13. Melhorar comunicação sobre produção.
14. Automatizar números mantidos manualmente.
15. Validar comandos pela CI.
16. Revisar periodicamente a documentação.

---

# 20. Critérios de aceite

O README revisado deve permitir que um recrutador compreenda em menos de 30 segundos:

- que o projeto é uma plataforma AWS serverless;
- que a infraestrutura foi criada com Terraform;
- que existe CI/CD profissional;
- que há segurança, observabilidade e testes;
- que o autor projetou e implementou as partes principais;
- que existem evidências verificáveis;
- que `dev` está ativo;
- que produção está tecnicamente preparada, mas ainda não provisionada.

Também deve ser possível identificar rapidamente:

- decisões principais;
- trade-offs;
- problemas resolvidos;
- resultados;
- custo estimado;
- links para arquitetura;
- links para pipelines;
- instruções de execução.

---

# 21. Ordem recomendada de implementação

1. Conferir o README contra o estado atual do repositório.
2. Corrigir scripts, números e estrutura.
3. Reescrever a abertura.
4. Criar `Engineering highlights`.
5. Criar `What I engineered`.
6. Criar `Key engineering decisions`.
7. Criar `Engineering challenges solved`.
8. Reordenar as seções.
9. Adicionar badges.
10. Adicionar evidências.
11. Adicionar FinOps.
12. Revisar diagramas.
13. Revisar CI/CD.
14. Revisar segurança e observabilidade.
15. Mover recursos editoriais para seção posterior.
16. Revisar execução local.
17. Atualizar status atual.
18. Validar todos os links.
19. Validar todos os comandos.
20. Fazer uma leitura final sob a perspectiva de um recrutador.

---

# 22. Resultado esperado

Após os ajustes, o README deve funcionar como:

- documentação técnica;
- apresentação arquitetural;
- demonstração de senioridade;
- peça de portfólio;
- evidência de domínio de AWS;
- evidência de experiência em DevOps;
- suporte para entrevistas técnicas.

A meta razoável é elevar sua qualidade como peça de posicionamento profissional de:

```text
8,2/10
```

para aproximadamente:

```text
9,0/10
```

O principal ganho não virá da inclusão de mais ferramentas, mas de uma comunicação mais clara sobre:

- autoria;
- decisões;
- problemas;
- trade-offs;
- resultados;
- evidências.
