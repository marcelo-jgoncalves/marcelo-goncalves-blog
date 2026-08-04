---
id: PROMPT-2026-012
title: "Proposta de arquitetura da informação do repositório"
created_at: 2026-08-04
status: historical
purpose:
superseded_by: []
related_cases: []
related_work_items: []
contains_sensitive_content: false
---

<!-- Migrado de marcelo-goncalves-blog-arquivo/prompts/proposta_arquitetura_informacao_repositorio.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Proposta de arquitetura da informação do repositório

**Projeto:** `mgoncalves-editorial-platform`  
**Objetivo:** estabelecer uma fonte canônica para cada tipo de informação, reduzir o `CLAUDE.md` e evitar duplicação, obsolescência e contaminação do contexto da IA.

---

# 1. Princípio central

A organização deve considerar duas dimensões:

1. **Natureza da informação**
   - regra;
   - estado atual;
   - decisão;
   - plano;
   - investigação;
   - evidência;
   - histórico;
   - documentação pública.

2. **Ciclo de vida**
   - durável;
   - temporário;
   - evolutivo;
   - histórico;
   - derivado automaticamente.

Cada informação deve possuir **uma única fonte canônica**. Outros arquivos podem apontar para essa fonte, mas não devem copiar integralmente o conteúdo.

---

# 2. Estrutura recomendada

```text
mgoncalves-editorial-platform/
├── README.md
├── CLAUDE.md
├── .project-context.md
├── memory/
│   └── ...
│
├── docs/
│   ├── README.md
│   │
│   ├── product/
│   │   ├── README.md
│   │   ├── vision.md
│   │   ├── roadmap.md
│   │   └── requirements/
│   │
│   ├── architecture/
│   │   ├── README.md
│   │   ├── system-overview.md
│   │   ├── data-model.md
│   │   ├── integration-flows.md
│   │   └── diagrams/
│   │
│   ├── engineering/
│   │   ├── README.md
│   │   ├── decisions/
│   │   │   ├── README.md
│   │   │   └── ADR-NNN-*.md
│   │   ├── experiments/
│   │   │   ├── README.md
│   │   │   └── EXP-NNN-*.md
│   │   └── standards/
│   │       ├── README.md
│   │       ├── engineering-principles.md
│   │       ├── code-conventions.md
│   │       ├── testing-strategy.md
│   │       ├── security-standards.md
│   │       ├── observability-standards.md
│   │       └── ai-assisted-workflow.md
│   │
│   ├── operations/
│   │   ├── README.md
│   │   ├── environments.md
│   │   ├── deployment.md
│   │   ├── known-issues.md
│   │   ├── runbooks/
│   │   └── incidents/
│   │
│   ├── delivery/
│   │   ├── README.md
│   │   ├── backlog.md
│   │   ├── audits/
│   │   └── migrations/
│   │
│   ├── book/
│   │   ├── README.md
│   │   ├── capture-protocol.md
│   │   ├── cases/
│   │   ├── syntheses/
│   │   └── metrics/
│   │
│   └── archive/
│       └── README.md
│
├── frontend/
│   ├── README.md
│   └── docs/
│       └── design-system.md
│
├── backend/
│   └── README.md
│
├── infra/
│   └── README.md
│
└── admin/
    └── README.md
```

A estrutura é um destino final. Ela pode ser implantada gradualmente, sem mover todos os arquivos de uma vez.

---

# 3. Função de cada arquivo principal

## `README.md`

### Deve conter

- apresentação pública do projeto;
- problema resolvido;
- principais capacidades;
- arquitetura em alto nível;
- stack;
- como executar;
- como testar;
- estado público atual;
- participação da IA apresentada de forma transparente;
- links para documentação detalhada.

### Não deve conter

- instruções internas para a IA;
- histórico de sessões;
- URLs privadas ou efêmeras;
- hipóteses em andamento;
- detalhes operacionais confidenciais;
- regras extensas de implementação.

O `README.md` é voltado para recrutadores, desenvolvedores e visitantes externos.

---

## `CLAUDE.md`

### Deve conter

Somente regras duráveis que alteram como a IA deve trabalhar em várias sessões:

- papéis e responsabilidades;
- diferença entre análise e ação;
- critérios gerais de conclusão;
- protocolo resumido de investigação;
- regras críticas de autorização e segurança;
- restrições específicas da ferramenta;
- mapa das fontes canônicas;
- regra de manutenção do próprio `CLAUDE.md`;
- integração resumida da skill do livro;
- poucos invariantes críticos que não são óbvios no código.

### Não deve conter

- URLs atuais;
- números de testes;
- versões de dependências;
- inventário completo da arquitetura;
- status de pipeline;
- trabalho concluído;
- narrativa de sessões;
- planos ou backlog;
- auditorias;
- migrações;
- valores completos de tokens;
- documentação histórica;
- explicações que já vivem em outra fonte canônica.

O `CLAUDE.md` deve ser uma **constituição operacional**, não uma enciclopédia do projeto.

---

## `.project-context.md`

### Deve conter

Estado operacional necessário para continuar o trabalho em uma sessão futura:

- objetivo atual;
- branch atual;
- tarefa em andamento;
- alterações locais relevantes;
- decisões ainda pendentes;
- bloqueios;
- ambiente atualmente usado;
- validações já executadas;
- próximas ações concretas;
- referências compactas a ADRs, experimentos ou casos ativos;
- riscos que precisam continuar visíveis na próxima sessão.

### Não deve conter

- regras permanentes;
- documentação arquitetural completa;
- histórico longo;
- tarefas concluídas sem impacto futuro;
- conteúdo integral de estudos de caso;
- inventários deriváveis do repositório;
- decisões já consolidadas em ADR.

### Regra de retenção

O conteúdo deve ser substituído ou comprimido quando deixar de ser necessário para a próxima sessão.

---

## `memory/`

### Deve conter

Somente memória operacional persistente relacionada à colaboração com a IA:

- preferências duráveis de Marcelo;
- padrões recorrentes de feedback;
- restrições específicas do ambiente de trabalho;
- erros comportamentais que a IA não deve repetir;
- convenções de interação que não pertencem ao produto;
- aprendizados sobre como colaborar com Marcelo.

### Não deve conter

- arquitetura canônica;
- estado atual do produto;
- backlog;
- documentação de código;
- decisões arquiteturais;
- casos do livro;
- fatos que podem ser obtidos do repositório.

A memória não deve competir com a documentação do projeto.

---

# 4. Documentação por domínio

## `docs/product/`

Fonte canônica da intenção do produto.

### `vision.md`

- problema;
- público;
- proposta de valor;
- objetivos;
- não objetivos;
- princípios de produto.

### `roadmap.md`

- capacidades futuras;
- estágio;
- dependências;
- critérios para iniciar;
- itens explicitamente não iniciados.

### `requirements/`

- requisitos de funcionalidades;
- critérios de aceitação;
- atributos de qualidade do ponto de vista do produto.

Não armazenar detalhes de implementação aqui.

---

## `docs/architecture/`

Fonte canônica da arquitetura vigente.

### `system-overview.md`

- componentes;
- responsabilidades;
- fronteiras;
- fluxos principais;
- visão de alto nível.

### `data-model.md`

- entidades;
- relacionamentos;
- chaves;
- índices;
- invariantes;
- estratégia de concorrência.

### `integration-flows.md`

- autenticação;
- publicação;
- processamento de imagens;
- agendamento;
- cache e invalidação;
- observabilidade.

### `diagrams/`

- fontes dos diagramas;
- imagens geradas;
- instruções para regeneração.

Os arquivos devem apontar para o código e a infraestrutura como fontes executáveis.

---

## `docs/engineering/decisions/`

Fonte canônica das decisões técnicas atualmente válidas.

Cada ADR deve registrar:

- contexto;
- forças e restrições;
- alternativas;
- decisão;
- consequências;
- evidências;
- gatilhos para reconsideração;
- status.

Estados recomendados:

- `proposed`;
- `accepted`;
- `superseded`;
- `deprecated`;
- `rejected`.

Uma decisão superada permanece no histórico, mas deve apontar para o ADR sucessor.

---

## `docs/engineering/experiments/`

Usado quando o resultado ainda não é conhecido.

Cada experimento deve registrar:

- pergunta;
- hipótese;
- método;
- métricas;
- execução;
- evidências;
- resultado;
- limitações;
- conclusão;
- decisão derivada, quando houver.

Quando um experimento produzir uma decisão permanente, deve apontar para um ADR.

---

## `docs/engineering/standards/`

Regras técnicas duráveis para humanos e IA.

### Exemplos

- princípios DRY, KISS e YAGNI;
- convenções de nomenclatura;
- política de comentários;
- estratégia de testes;
- exigências de segurança;
- logging e observabilidade;
- critérios para criação de novas abstrações;
- fluxo de engenharia assistida por IA.

### Regra importante

O `CLAUDE.md` deve conter apenas o resumo comportamental e apontar para esses documentos.

---

## `docs/operations/`

Fonte canônica para executar e operar o sistema.

### `environments.md`

- ambientes existentes;
- finalidade;
- domínios e endpoints;
- contas e regiões;
- diferenças de configuração;
- estado atual da produção.

Evitar segredos.

### `deployment.md`

- fluxo de deploy;
- branches;
- gates;
- rollback;
- smoke tests;
- responsabilidades.

### `known-issues.md`

Somente problemas conhecidos que afetam a operação ou o comportamento atual.

Cada item deve conter:

- impacto;
- workaround;
- prioridade;
- responsável;
- vínculo com backlog;
- condição de encerramento.

### `runbooks/`

Procedimentos repetíveis:

- deploy manual excepcional;
- rollback;
- restauração;
- investigação de alarmes;
- falha em processamento assíncrono;
- rotação de credenciais;
- recuperação de dados.

### `incidents/`

Registros pós-incidente:

- linha do tempo;
- impacto;
- causa;
- resposta;
- ações corretivas;
- aprendizado.

Incidentes com valor pedagógico podem apontar também para um caso em `docs/book/cases/`.

---

## `docs/delivery/`

Informação sobre trabalho planejado, temporário ou em execução.

### `backlog.md`

Fonte única de tarefas e melhorias ainda não executadas.

Cada item deve possuir:

- ID;
- descrição;
- motivação;
- prioridade;
- status;
- dependências;
- critério de conclusão;
- links para ADR, auditoria ou migração.

### `audits/`

Relatórios e rastreadores de auditorias.

Organização sugerida:

```text
audits/
  AUDIT-001/
    report.md
    remediation-plan.md
    tracker.md
```

Ao terminar a remediação, o tracker pode ser encerrado, mas não deve continuar sendo tratado como estado atual.

### `migrations/`

Planos temporários de migração.

Cada migração deve ter:

- contexto;
- estado inicial;
- estado desejado;
- fases;
- riscos;
- rollback;
- validação;
- status;
- data de encerramento.

Depois de concluída, a arquitetura vigente deve estar documentada em `architecture/` ou nos READMEs dos componentes. O plano de migração permanece apenas como histórico.

---

## `docs/book/`

Mantém o sistema já planejado:

- protocolo;
- casos históricos;
- sínteses;
- métricas.

Essa área não é fonte do estado operacional do produto.

---

## `docs/archive/`

Usado somente quando um documento:

- precisa continuar no repositório;
- não representa mais o estado atual;
- não se encaixa melhor como ADR, caso, incidente, auditoria ou migração encerrada.

Todo arquivo arquivado deve indicar:

- motivo do arquivamento;
- data;
- documento substituto;
- status `archived`.

Não usar `archive/` como depósito genérico.

---

# 5. Documentação próxima ao código

Nem toda informação deve ir para `docs/`.

Conhecimento específico de um componente deve permanecer próximo dele.

## `frontend/README.md`

- execução local;
- build;
- estrutura do frontend;
- regras específicas do Next.js e OpenNext;
- variáveis de ambiente;
- cache e ISR;
- testes do frontend.

## `frontend/docs/design-system.md`

- princípios visuais;
- papéis dos tokens;
- componentes compartilhados;
- regras de tipografia;
- regras de botões;
- CSS Modules versus CSS global;
- acessibilidade visual.

Os valores efetivos dos tokens continuam no CSS como fonte executável.

## `backend/README.md`

- estrutura das Lambdas;
- build;
- logging;
- sanitização;
- testes;
- DynamoDB Local;
- convenções específicas do backend.

## `infra/README.md`

- composição dos módulos;
- estado Terraform;
- ambientes;
- comandos;
- validações;
- padrões IAM;
- peculiaridades de CloudFront e Lambda URLs.

## `admin/README.md`

- execução;
- autenticação;
- editor;
- build;
- variáveis;
- testes;
- integração com contratos.

### Critério

Se a regra só é útil ao trabalhar em um componente, ela deve ficar próxima desse componente. O `CLAUDE.md` apenas aponta para o README relevante.

---

# 6. Tabela de roteamento da informação

| Tipo de informação | Destino canônico |
|---|---|
| Regra durável de comportamento da IA | `CLAUDE.md` |
| Preferência durável de colaboração com Marcelo | `memory/` |
| Estado para continuar a próxima sessão | `.project-context.md` |
| Apresentação pública do projeto | `README.md` |
| Visão e objetivos do produto | `docs/product/vision.md` |
| Funcionalidade futura | `docs/product/roadmap.md` |
| Trabalho pendente | `docs/delivery/backlog.md` |
| Arquitetura vigente | `docs/architecture/` |
| Decisão técnica durável | `docs/engineering/decisions/` |
| Investigação com resultado desconhecido | `docs/engineering/experiments/` |
| Padrão técnico durável | `docs/engineering/standards/` |
| Informação específica de componente | README ou `docs/` do componente |
| Ambiente, deploy ou operação | `docs/operations/` |
| Problema operacional atual | `docs/operations/known-issues.md` |
| Procedimento operacional | `docs/operations/runbooks/` |
| Incidente ocorrido | `docs/operations/incidents/` |
| Auditoria e remediação | `docs/delivery/audits/` |
| Migração planejada ou em andamento | `docs/delivery/migrations/` |
| Aprendizado histórico para o livro | `docs/book/cases/` |
| Padrão extraído de vários casos | `docs/book/syntheses/` |
| Documento obsoleto sem destino melhor | `docs/archive/` |
| Versões, contagens e fatos deriváveis | código, lockfiles, workflows ou script |
| Histórico de alteração | Git |

---

# 7. Como tratar informações deriváveis

Não duplicar em documentos internos fatos que podem ser obtidos de forma confiável de:

- `package.json`;
- lockfiles;
- Terraform;
- workflows;
- testes;
- código;
- Git.

Exemplos:

- versão do Node;
- número de Lambdas;
- quantidade de módulos;
- número de testes;
- lista completa de dependências;
- nomes de todas as funções;
- valores completos dos tokens CSS.

Esses dados podem aparecer no `README.md` como fotografia pública, mas devem ser tratados como resumo derivado e revisados por automação ou auditoria periódica.

---

# 8. Metadados recomendados

Documentos evolutivos ou históricos devem usar front matter semelhante:

```yaml
---
title:
status: draft
owner: Marcelo Gonçalves
created_at:
last_verified:
superseded_by:
related_adrs: []
related_cases: []
related_backlog_items: []
---
```

Nem todos os campos são obrigatórios em todos os documentos.

## Estados gerais

- `draft`;
- `active`;
- `accepted`;
- `completed`;
- `paused`;
- `superseded`;
- `deprecated`;
- `archived`.

`last_verified` é particularmente importante para documentos que descrevem estado atual.

---

# 9. Regras contra duplicação

1. Toda informação importante deve possuir uma fonte canônica identificável.
2. Arquivos secundários devem usar links, não cópias.
3. O `CLAUDE.md` deve apontar para detalhes, não reproduzi-los.
4. `.project-context.md` deve registrar somente o necessário para continuidade.
5. Informações históricas nunca devem ser apresentadas como estado atual.
6. Uma decisão aceita deve ser registrada em ADR, não apenas em commit ou memória.
7. Uma tarefa pendente deve existir apenas no backlog.
8. Uma migração concluída não deve continuar definindo a arquitetura vigente.
9. Valores derivados do código não devem ser mantidos manualmente em vários arquivos.
10. Quando houver conflito, a fonte canônica deve prevalecer e a duplicação deve ser removida.

---

# 10. Papel do `docs/README.md`

Esse arquivo deve funcionar como índice e mapa de autoridade.

Estrutura sugerida:

```markdown
# Documentação do projeto

## Onde encontrar cada informação

| Preciso saber... | Consulte... |
|---|---|
| O objetivo do produto | `product/vision.md` |
| O que está planejado | `product/roadmap.md` |
| O que está pendente | `delivery/backlog.md` |
| Como o sistema funciona | `architecture/` |
| Por que uma decisão foi tomada | `engineering/decisions/` |
| Quais experimentos foram feitos | `engineering/experiments/` |
| Como operar o sistema | `operations/` |
| Quais padrões técnicos seguir | `engineering/standards/` |
| Quais aprendizados irão para o livro | `book/` |
```

Ele deve também declarar a política de fonte canônica e apontar para as regras de manutenção documental.

---

# 11. Migração do conteúdo atual do `CLAUDE.md`

| Conteúdo atual | Destino recomendado |
|---|---|
| Propósito do projeto | `docs/product/vision.md`; resumo curto no `CLAUDE.md` |
| URLs e ambiente ativo | `docs/operations/environments.md` |
| Branch e pipeline | `docs/operations/deployment.md` |
| Próxima sessão | `.project-context.md` |
| DRY, KISS e YAGNI | `docs/engineering/standards/engineering-principles.md` |
| Feedback e modo de colaboração | resumo no `CLAUDE.md`; detalhes em `engineering/standards/ai-assisted-workflow.md` ou `memory/` |
| Restrição de Bash da ferramenta | `CLAUDE.md` |
| Nomenclatura e comentários | `docs/engineering/standards/code-conventions.md` |
| Inventário da arquitetura | `docs/architecture/system-overview.md` |
| Regras específicas do frontend | `frontend/README.md` |
| Regras específicas do backend | `backend/README.md` |
| Regras específicas de infraestrutura | `infra/README.md` |
| Design system | `frontend/docs/design-system.md` |
| Valores dos tokens | CSS; documentação apenas dos papéis |
| Pipeline de imagens | `docs/architecture/integration-flows.md` e READMEs dos componentes |
| Auditorias | `docs/delivery/audits/` |
| Migração Tiptap | `docs/delivery/migrations/` |
| Problemas ainda abertos | backlog ou `operations/known-issues.md` |
| Aprendizados históricos | `docs/book/cases/` |
| Regras da skill do livro | resumo no `CLAUDE.md`; detalhes na skill e no protocolo |

---

# 12. Sequência recomendada de implantação

## Etapa 1 — Criar o mapa

Criar:

- `docs/README.md`;
- READMEs das novas áreas;
- política de fonte canônica;
- tabela de roteamento.

Ainda não mover conteúdo.

## Etapa 2 — Organizar os documentos existentes

Mover gradualmente:

- auditorias para `docs/delivery/audits/`;
- migrações para `docs/delivery/migrations/`;
- backlog para `docs/delivery/backlog.md`;
- diagramas e arquitetura para `docs/architecture/`.

Atualizar todos os links.

## Etapa 3 — Criar documentação canônica ausente

Prioridade:

1. `docs/product/vision.md`;
2. `docs/architecture/system-overview.md`;
3. `docs/operations/environments.md`;
4. `docs/operations/deployment.md`;
5. `docs/engineering/standards/code-conventions.md`;
6. `frontend/docs/design-system.md`.

## Etapa 4 — Reduzir o `CLAUDE.md`

Mover detalhes para as fontes canônicas e manter apenas:

- regras duráveis;
- invariantes críticos;
- protocolo de trabalho;
- mapa de leitura;
- integração das skills.

## Etapa 5 — Limpar contexto e memória

- reduzir `.project-context.md` ao estado necessário para continuidade;
- revisar `memory/`;
- remover arquitetura, backlog e histórico duplicados;
- substituir cópias por referências.

## Etapa 6 — Adicionar governança documental

Posteriormente, avaliar:

- validação de links Markdown;
- schema de front matter;
- detecção de documentos sem `last_verified`;
- índice automático de ADRs, casos e experimentos;
- revisão documental periódica.

---

# 13. Recomendação prática

O próximo artefato a ser criado deve ser:

```text
docs/README.md
```

Ele funcionará como o **mapa canônico da documentação** e deverá ser criado antes de qualquer grande refatoração do `CLAUDE.md`.

Depois disso:

1. criar a estrutura mínima das áreas;
2. classificar os documentos existentes;
3. mover apenas o que tiver destino inequívoco;
4. criar as fontes canônicas ausentes;
5. somente então reduzir o `CLAUDE.md`.

Essa ordem evita mover informações para diretórios sem função claramente definida e reduz o risco de perda ou duplicação.
