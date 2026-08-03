# Terceira Auditoria do Repositório

## Projeto: `mgoncalves-editorial-platform`

**Versão analisada:** branch `develop`, commit `fee8c8212aec3b6cc26c54c32b1d1093453724e6`  
**Data da auditoria:** 2 de agosto de 2026

---

## 1. Escopo da análise

Esta auditoria revisou novamente o repositório, com foco em:

- verificar se os problemas da auditoria anterior foram corrigidos;
- confirmar a implementação das melhorias declaradas;
- identificar novas fragilidades;
- recalcular as notas por área;
- preservar as notas das auditorias anteriores para comparação.

A análise considerou:

- arquitetura;
- infraestrutura como código;
- CI/CD;
- segurança;
- testes;
- contratos compartilhados;
- estrutura do monorepo;
- código de aplicação;
- documentação;
- operações concorrentes no DynamoDB;
- fluxo de agendamento;
- execuções públicas do GitHub Actions.

Não foram realizados:

- execução local completa da suíte;
- pentest;
- testes de carga;
- inspeção direta da conta AWS;
- validação funcional manual em produção.

A execução pública mais recente confirmada como concluída com sucesso ainda correspondia a um commit anterior (`f14f01c`). Portanto, uma pipeline verde do commit `fee8c82` não foi considerada comprovada nesta auditoria.

---

# 2. Evolução das notas

| Área | 1ª auditoria | 2ª auditoria | Auditoria atual | Evolução desde a anterior |
|---|---:|---:|---:|---:|
| Arquitetura | 8,5 | 9,0 | **9,2** | +0,2 |
| Infraestrutura como código | 9,0 | 9,3 | **9,3** | — |
| CI/CD | 8,5 | 9,1 | **9,4** | +0,3 |
| Segurança | 8,0 | 9,0 | **9,2** | +0,2 |
| Testes | 8,5 | 8,7 | **9,0** | +0,3 |
| Código de aplicação | 7,5 | 8,3 | **8,8** | +0,5 |
| Contratos e monorepo | 7,0 | 8,5 | **9,3** | +0,8 |
| Documentação | 8,0 | 8,5 | **8,9** | +0,4 |
| Prontidão para produção | 7,5 | 8,0 | **8,5** | +0,5 |
| **Nota geral** | **8,0** | **8,7** | **9,0** | **+0,3** |

---

# 3. Melhorias confirmadas desde a auditoria anterior

## 3.1. O agendamento foi corrigido

O problema anterior entre:

```ts
data_publicacao
```

e:

```ts
data_publicacao_programada
```

foi resolvido.

O formulário agora valida e envia `data_publicacao_programada`, exatamente o campo esperado pelo contrato compartilhado e pelo scheduler.

O payload continua sendo construído a partir do estado completo do formulário.

### Evidência

- [usePostForm.ts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/admin/src/composables/usePostForm.ts)

---

## 3.2. O monorepo agora é um workspace real

A raiz passou a declarar npm workspaces para:

- `packages/contracts`;
- `backend`;
- `frontend`;
- `admin`.

Isso substitui a estrutura anterior baseada em dependências locais e instalações separadas.

Também existe agora:

- um único lockfile;
- Dependabot consolidado na raiz;
- resolução centralizada dos pacotes;
- instalação mais previsível;
- pipeline menos repetitiva.

Essa mudança foi responsável pelo maior aumento de nota.

**Contratos e monorepo:** de 8,5 para 9,3.

### Evidência

- [package.json raiz](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/package.json)

---

## 3.3. O pacote de contratos virou um gate independente

A pipeline agora executa explicitamente no pacote compartilhado:

```bash
npm audit --audit-level=high
npm run typecheck
npm test
```

O deploy depende desse job juntamente com:

- backend;
- frontend;
- admin;
- testes de integração;
- segurança;
- infraestrutura.

### Avaliação

A proteção contra deriva de contratos deixou de depender apenas dos consumidores e passou a possuir validação independente.

### Evidência

- [Workflow principal de CI/CD](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/.github/workflows/cd.yml)

---

## 3.4. Os scans duplicados foram eliminados

O workflow de segurança não possui mais disparo independente por `push`.

Ele agora é:

- chamado pela pipeline principal como workflow reutilizável;
- executado em pull requests;
- disponível manualmente.

Isso elimina a duplicação anterior de Semgrep e Gitleaks para o mesmo commit.

### Evidência

- [Workflow de segurança](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/.github/workflows/security.yml)

---

## 3.5. Actions e warnings foram tratados

O commit atual atualizou:

- `setup-terraform`;
- Gitleaks;
- actions de cache;
- actions de artefatos.

As versões atuais utilizam runtime Node.js 24.

Também foram corrigidos warnings anteriores do frontend.

### Evidência

- [Commit analisado](https://github.com/marcelo-jgoncalves/mgoncalves-editorial-platform/commit/fee8c8212aec3b6cc26c54c32b1d1093453724e6)

---

## 3.6. A proteção de exclusão melhorou

O delete passou a utilizar uma `ConditionExpression` baseada na versão lida antes da transação.

Também foi criado um teste de integração contra DynamoDB Local demonstrando que uma exclusão com versão antiga falha quando uma atualização concorrente já avançou a versão do item.

### Avaliação

A correção resolveu adequadamente o cenário:

```text
update concorrente → delete baseado em versão antiga
```

Entretanto, ainda existe uma brecha no cenário de duas exclusões concorrentes, detalhada adiante.

### Evidência

- [adminPosts/index.ts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/backend/src/functions/adminPosts/index.ts)

---

# 4. Problemas ainda encontrados

## 4.1. Alta prioridade: proteção contra duas exclusões simultâneas ainda está incorreta

A condição atual do delete é:

```ts
attribute_not_exists(#version) OR #version = :expectedVersion
```

Essa condição protege contra uma atualização concorrente que altere a versão.

Porém, ela não protege corretamente contra duas exclusões concorrentes.

### Cenário de falha

1. Duas requisições leem o mesmo post.
2. A primeira exclusão remove o item.
3. A primeira exclusão reduz os contadores.
4. A segunda exclusão avalia a condição contra um item que já não existe.
5. `attribute_not_exists(version)` é verdadeiro.
6. A segunda operação pode prosseguir.
7. Os contadores podem ser reduzidos novamente.

O comentário do código afirma que a condição protege contra uma segunda exclusão, mas a expressão atual não garante isso.

O teste existente cobre:

```text
update versus delete
```

mas não cobre:

```text
delete versus delete
```

### Correção recomendada

Para compatibilidade com registros antigos:

```ts
attribute_exists(slug)
AND (
  attribute_not_exists(#version)
  OR #version = :expectedVersion
)
```

Após migrar todos os registros para possuir versão, a condição ideal seria:

```ts
attribute_exists(slug)
AND #version = :expectedVersion
```

### Teste necessário

Criar teste de integração com duas exclusões concorrentes e confirmar que:

- uma exclusão tem sucesso;
- a segunda recebe `409 Conflict`;
- os contadores são decrementados apenas uma vez;
- o item permanece ausente;
- a transação não deixa efeitos parciais.

### Evidência

- [adminPosts/index.ts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/backend/src/functions/adminPosts/index.ts)

---

## 4.2. Proteção otimista ainda pode ser ignorada em updates

No contrato, `version` continua opcional:

```ts
version: z.number().int().min(0).optional()
```

No handler, a condição de versão somente é adicionada quando o cliente envia o campo.

O admin atual preserva e reenvia a versão, mas outros consumidores podem omiti-la, por exemplo:

- integrações futuras;
- scripts;
- chamadas manuais;
- outro frontend;
- ferramentas administrativas;
- testes construídos sem o campo.

Nesse caso, o update pode ocorrer sem controle otimista.

### Problema de arquitetura

O versionamento está sendo tratado como uma convenção do cliente.

Ele deveria ser uma garantia imposta pelo backend.

### Correção recomendada

Separar os contratos:

```text
createPostSchema
updatePostSchema
persistedPostSchema
```

No `POST`:

- `version` não deve ser aceita;
- o backend define a versão inicial.

No `PUT`:

- `version` deve ser obrigatória;
- ausência deve retornar `400 Bad Request` ou `428 Precondition Required`.

No objeto persistido:

- `version` deve ser obrigatória.

### Critérios de aceite

- nenhum update ocorre sem versão;
- cliente desatualizado recebe `409`;
- cliente sem versão recebe erro explícito;
- criação sempre começa com versão definida pelo backend.

### Evidência

- [Schema compartilhado de posts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/packages/contracts/src/post.ts)

---

## 4.3. Validação de data programada ainda está concentrada no frontend

O admin verifica se a data programada:

- existe;
- está no futuro.

Porém, o contrato compartilhado aceita qualquer string para:

```ts
data_publicacao_programada
```

e apenas verifica sua presença quando o status é `Programado`.

### Entradas atualmente possíveis por chamada direta à API

- texto arbitrário;
- data inválida;
- data passada;
- formato sem timezone;
- formato diferente do usado pelo scheduler;
- string que não mantém ordenação temporal lexicográfica correta.

O schema reconhece que o formato pode variar entre:

- `datetime-local`;
- ISO 8601 completo.

Essa ambiguidade é problemática porque o scheduler consulta o DynamoDB por comparação de strings.

### Risco

Datas representando o mesmo instante podem ser persistidas em formatos diferentes e produzir:

- ordenação incorreta;
- posts não localizados pelo scheduler;
- publicações antecipadas ou atrasadas;
- comportamento diferente entre timezone local e UTC.

### Correção recomendada

O backend deve:

1. aceitar formato claramente definido;
2. validar semanticamente a data;
3. rejeitar datas passadas;
4. converter para UTC;
5. persistir sempre ISO 8601 completo;
6. utilizar o mesmo formato normalizado no scheduler.

Exemplo persistido:

```text
2026-08-03T18:30:00.000Z
```

### Critérios de aceite

- a API rejeita datas inválidas;
- a API rejeita datas passadas;
- o banco armazena apenas UTC normalizado;
- o scheduler compara strings no mesmo formato;
- testes cobrem timezone positivo e negativo.

### Evidência

- [Schema compartilhado de posts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/packages/contracts/src/post.ts)

---

## 4.4. `status` ainda é opcional no contrato de criação

O schema permite omitir `status`, embora:

- o tipo persistido dependa desse campo;
- os índices dependam desse campo;
- regras de publicação dependam desse campo;
- a interface sempre trabalhe com status conhecido.

O admin envia um status padrão, mas o backend não deveria depender desse comportamento.

### Correção recomendada

Escolher uma regra explícita.

#### Alternativa recomendada

Aplicar default server-side:

```ts
status: z.enum(POST_STATUSES).default("Rascunho")
```

#### Alternativa possível

Tornar o campo obrigatório.

### Critérios de aceite

- todo post persistido possui status;
- criação sem status resulta em `Rascunho` ou erro explícito;
- índices nunca recebem item sem status;
- testes cobrem criação sem campo.

### Evidência

- [Schema compartilhado de posts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/packages/contracts/src/post.ts)

---

## 4.5. Produção ainda não possui smoke test com navegador

O ambiente de desenvolvimento executa Playwright após o deploy.

O fluxo de produção, após `terraform apply`, ainda utiliza principalmente verificações por `curl` para:

- frontend;
- admin;
- API.

O README informa corretamente que apenas `dev` está ativo e produção ainda não existe.

Portanto, isso não é bloqueador imediato.

Entretanto, deve ser resolvido antes da ativação real de produção.

### Limitações do `curl`

O `curl` não valida adequadamente:

- execução de JavaScript;
- renderização do frontend;
- hidratação;
- navegação;
- cookies;
- autenticação;
- carregamento de assets;
- erros no console;
- comportamento real do navegador.

### Smoke recomendado para produção

Validar pelo menos:

- renderização real da home;
- carregamento de um artigo;
- carregamento de assets essenciais;
- ausência de erros críticos de hidratação;
- redirecionamentos;
- carregamento do admin;
- comportamento de autenticação;
- ausência de alterações destrutivas.

### Evidências

- [Workflow principal de CI/CD](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/.github/workflows/cd.yml)
- [README](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/README.md)

---

# 5. Avaliação detalhada por área

## 5.1. Arquitetura — 9,2

A arquitetura permanece muito bem delimitada:

- Next.js/OpenNext no frontend;
- CMS em Vue;
- onze Lambdas especializadas;
- processamento assíncrono;
- agendamento;
- observabilidade;
- contratos compartilhados;
- diagramas separados por fluxo.

O README agora apresenta fluxos específicos para:

- leitura pública;
- sessão administrativa;
- mídia;
- agendamento;
- observabilidade;
- segurança.

### Motivo de não receber nota maior

Ainda existem contratos de criação, atualização e persistência parcialmente misturados.

Algumas regras de domínio continuam dependentes do frontend.

### Evidência

- [README](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/README.md)

---

## 5.2. Infraestrutura como código — 9,3

A infraestrutura mantém padrão muito alto, com:

- módulos delimitados;
- state locking;
- validações;
- TFLint;
- Trivy;
- roles por função;
- políticas IAM granulares;
- migrações preservadas por blocos `moved`.

### Evolução

A nota permaneceu estável porque não houve mudança estrutural relevante nesta área desde a auditoria anterior.

### Evidência

- [IAM das Lambdas](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/infra/modules/lambda/lambda-iam.tf)

---

## 5.3. CI/CD — 9,4

A pipeline agora possui:

- npm workspaces;
- auditoria de dependências;
- testes por componente;
- job específico de contratos;
- integração real com DynamoDB Local;
- Semgrep;
- Gitleaks;
- Terraform validate;
- TFLint;
- Trivy;
- deploy condicionado a todos os gates;
- plano de produção aprovado;
- aplicação do plano aprovado sem regeneração.

### Principal limitação

Ausência de Playwright no fluxo de produção.

### Evidência

- [Workflow principal de CI/CD](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/.github/workflows/cd.yml)

---

## 5.4. Segurança — 9,2

Os controles de segurança estão bem integrados ao ciclo de entrega.

Pontos positivos:

- scans como gates;
- actions fixadas por SHA;
- IAM granular;
- OIDC;
- Gitleaks;
- Semgrep;
- auditoria de dependências;
- Trivy;
- cookies seguros;
- sessões opacas;
- validação de autenticação no backend.

### Pontos restantes

- `version` deve ser obrigatória em updates;
- datas devem ser validadas no backend;
- o cenário de duas exclusões concorrentes deve ser protegido.

### Evidência

- [Workflow de segurança](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/.github/workflows/security.yml)

---

## 5.5. Testes — 9,0

A suíte cresceu e passou a cobrir:

- round-trip de versão;
- conflitos de escrita;
- transações reais;
- atualização concorrente com exclusão;
- contratos compartilhados;
- backend;
- frontend;
- admin;
- E2E.

O README declara aproximadamente:

- 175 testes unitários do backend;
- 5 testes de integração;
- 81 testes no frontend;
- 25 testes no admin;
- 80 testes E2E.

### Lacunas

Ainda faltam:

- duas exclusões concorrentes;
- fluxo integrado do agendamento com timezone;
- validação server-side de datas;
- update sem version.

### Evidência

- [README](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/README.md)

---

## 5.6. Código de aplicação — 8,8

O fluxo de agendamento foi corrigido.

As operações DynamoDB estão significativamente mais protegidas.

Os erros e contratos ficaram mais coerentes.

### Limitações

- condição de exclusão ainda possui brecha lógica;
- versionamento ainda é opcional;
- datas programadas não são normalizadas no backend;
- status ainda é opcional.

### Evidência

- [adminPosts/index.ts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/backend/src/functions/adminPosts/index.ts)

---

## 5.7. Contratos e monorepo — 9,3

A migração para workspaces corrigiu quase completamente os problemas estruturais identificados nas primeiras auditorias.

Pontos confirmados:

- contrato compartilhado;
- um único lockfile;
- gate específico na CI;
- Dependabot centralizado;
- resolução por workspace;
- scripts executados pela raiz.

### Limitação

Ainda devem existir schemas distintos para:

- criação;
- atualização;
- persistência;
- resposta da API.

### Evidência

- [Workflow principal de CI/CD](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/.github/workflows/cd.yml)

---

## 5.8. Documentação — 8,9

O README está mais objetivo e reconhece explicitamente o ambiente realmente ativo.

Também oferece diagramas arquiteturais organizados por fluxo.

### Limitação

Ainda existem comentários no código que descrevem como garantido um cenário de concorrência que a expressão atual não cobre integralmente.

### Evidência

- [README](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/README.md)

---

## 5.9. Prontidão para produção — 8,5

O projeto está bastante próximo de produção.

Porém, o próprio repositório informa que produção ainda não existe.

Antes de ativá-la, devem ser corrigidos obrigatoriamente:

1. corrida entre duas exclusões;
2. versão obrigatória nos updates;
3. normalização server-side das datas;
4. smoke Playwright em produção.

### Evidência

- [README](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/fee8c8212aec3b6cc26c54c32b1d1093453724e6/README.md)

---

# 6. Plano de ação priorizado

## P0 — Correções imediatas

### P0.1. Corrigir double delete

- adicionar `attribute_exists` à condição;
- impedir segunda exclusão;
- retornar `409`;
- criar teste de duas exclusões concorrentes;
- validar contadores.

### P0.2. Tornar versão obrigatória no update

- separar schemas;
- rejeitar update sem versão;
- manter versão sob controle do backend;
- testar ausência e conflito.

---

## P1 — Regras de domínio no backend

### P1.1. Normalizar datas programadas

- definir formato de entrada;
- converter para UTC;
- persistir ISO completo;
- rejeitar datas passadas;
- testar timezones.

### P1.2. Garantir status na criação

- aplicar default server-side;
- ou tornar obrigatório;
- testar criação sem status.

---

## P2 — Preparação de produção

### P2.1. Adicionar smoke Playwright em produção

### P2.2. Confirmar pipeline verde do commit atual

### P2.3. Atualizar comentários sobre concorrência

---

# 7. Critérios de aceite

## Concorrência

- [ ] Duas exclusões simultâneas não alteram contadores duas vezes.
- [ ] A segunda exclusão retorna `409`.
- [ ] Update sem versão é rejeitado.
- [ ] Update com versão antiga retorna `409`.
- [ ] Todos os registros persistidos possuem versão.

## Agendamento

- [ ] Data é validada no backend.
- [ ] Data passada é rejeitada.
- [ ] Data é convertida para UTC.
- [ ] Apenas ISO 8601 completo é persistido.
- [ ] Scheduler utiliza o mesmo formato.
- [ ] Testes cobrem diferentes timezones.

## Contratos

- [ ] Existe schema separado para criação.
- [ ] Existe schema separado para atualização.
- [ ] Existe schema separado para persistência.
- [ ] `version` não é aceita na criação.
- [ ] `version` é obrigatória na atualização.
- [ ] `status` possui default ou é obrigatório.

## Produção

- [ ] Existe smoke Playwright após deploy.
- [ ] Smoke não altera dados reais.
- [ ] Falha do smoke bloqueia conclusão da entrega.
- [ ] Pipeline do commit final está verde.

---

# 8. Conclusão final

A evolução acumulada é clara:

```text
1ª auditoria: 8,0
2ª auditoria: 8,7
Auditoria atual: 9,0
```

O projeto passou de **muito bom** para **engenharia de alto nível, próxima de um padrão de referência**.

Os principais problemas das auditorias anteriores foram efetivamente corrigidos:

- segurança passou a bloquear deploy;
- contratos foram centralizados;
- o monorepo virou workspace real;
- o pacote compartilhado recebeu gate próprio;
- o agendamento foi corrigido;
- concorrência passou a ser considerada;
- scans duplicados foram removidos;
- warnings e actions foram atualizados.

A nota atual não é maior principalmente por uma sutileza importante:

> A condição criada para proteger a exclusão ainda permite que uma segunda exclusão sobre um item já removido passe pela cláusula `attribute_not_exists(version)`.

Corrigindo:

1. double delete;
2. versão obrigatória nos updates;
3. normalização de datas no backend;
4. smoke test de produção;

o projeto pode avançar de forma justificável para aproximadamente **9,3/10**.
