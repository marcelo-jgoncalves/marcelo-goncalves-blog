# Nova Auditoria do Repositório

## Projeto: `mgoncalves-editorial-platform`

**Versão analisada:** branch `develop`, commit `c1d3a4f`  
**Data da auditoria:** 2 de agosto de 2026

---

## 1. Escopo da análise

Esta auditoria revisou novamente o repositório, com foco em verificar:

- quais pontos da auditoria anterior foram corrigidos;
- se as correções foram implementadas de forma substantiva;
- se surgiram novas fragilidades;
- a evolução das notas por área;
- o nível atual de prontidão para produção.

A análise considerou:

- arquitetura;
- infraestrutura como código;
- CI/CD;
- segurança;
- testes;
- contratos compartilhados;
- código de aplicação;
- documentação;
- fluxos de escrita no DynamoDB;
- comportamento do painel administrativo;
- execuções públicas do GitHub Actions.

Não foram realizados:

- execução local completa;
- pentest;
- testes de carga;
- inspeção direta da conta AWS;
- validação manual em produção.

---

# 2. Comparativo das notas

| Área | Antes | Agora | Evolução |
|---|---:|---:|---:|
| Arquitetura | 8,5 | **9,0** | +0,5 |
| Infraestrutura como código | 9,0 | **9,3** | +0,3 |
| CI/CD | 8,5 | **9,1** | +0,6 |
| Segurança | 8,0 | **9,0** | +1,0 |
| Testes | 8,5 | **8,7** | +0,2 |
| Código de aplicação | 7,5 | **8,3** | +0,8 |
| Contratos e monorepo | 7,0 | **8,5** | +1,5 |
| Documentação | 8,0 | **8,5** | +0,5 |
| Prontidão para produção | 7,5 | **8,0** | +0,5 |
| **Nota geral** | **8,0** | **8,7** | **+0,7** |

---

# 3. Veredito geral

O projeto evoluiu de **muito bom** para **engenharia de nível profissional avançado**.

As correções observadas não foram apenas cosméticas. Quase todos os problemas principais da auditoria anterior receberam implementações reais.

Ainda assim, a nota não chega a 9 porque foram encontrados:

1. uma provável regressão funcional no fluxo de agendamento;
2. uma proteção de concorrência incompleta na exclusão de posts;
3. lacunas menores no pacote compartilhado, na estrutura do monorepo e na pipeline.

**Nota anterior:** 8,0/10  
**Nova nota:** 8,7/10

---

# 4. Melhorias confirmadas

## 4.1. Segurança agora bloqueia efetivamente o deploy

Este era o problema mais importante da auditoria anterior e foi corretamente resolvido.

O deploy para `develop` e o plano de produção agora dependem explicitamente de:

- builds;
- testes do admin;
- testes de integração;
- Semgrep;
- Gitleaks;
- Terraform validate;
- TFLint;
- Trivy.

Além disso, `npm audit --audit-level=high` foi incorporado aos componentes principais.

### Antes

Os scans existiam, mas eram executados em workflows paralelos e não impediam diretamente um deploy.

### Agora

Os scans passaram a fazer parte do grafo real de dependências da entrega.

### Evidência

- [Workflow principal de CI/CD](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/.github/workflows/cd.yml)

---

## 4.2. Foi criada uma fonte compartilhada de contratos

Foi introduzido o pacote:

```text
packages/contracts
```

Ele concentra:

- schemas Zod;
- tipos de `Post`;
- tipos de categorias;
- tipos de autores;
- enums de status;
- testes dos schemas.

Backend e admin agora dependem de:

```text
@mgoncalves/contracts
```

Isso reduz substancialmente a duplicação de tipos que existia anteriormente.

### Avaliação

Essa foi a maior evolução estrutural do projeto.

### Evidência

- [Package do módulo de contratos](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/packages/contracts/package.json)

---

## 4.3. As escritas no DynamoDB estão mais protegidas

Foram adicionadas condições para:

- impedir criação sobre slug existente;
- impedir atualização de post inexistente;
- detectar atualização baseada em versão antiga;
- devolver `409 Conflict`;
- devolver `404 Not Found`;
- manter post e contadores na mesma transação.

Os testes de integração verificam essas condições contra DynamoDB Local, incluindo:

- tentativa de sobrescrita;
- atualização inexistente;
- versão obsoleta;
- rollback transacional.

### Avaliação

A correção elevou significativamente a qualidade do código de aplicação.

### Evidência

- [Função de administração de posts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/backend/src/functions/adminPosts/index.ts)

---

## 4.4. A validação de entrada ficou mais robusta

O schema agora possui:

- regex e limite para slug;
- limites para título;
- limites para resumo;
- limites para conteúdo;
- limites para SEO;
- inteiro positivo e limite para tempo de leitura;
- enum de status;
- campo de versão;
- regra específica para posts programados;
- remoção de campos não permitidos.

Também existem testes dedicados ao schema.

### Evidência

- [Schema compartilhado de posts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/packages/contracts/src/post.ts)

---

## 4.5. CI/CD e infraestrutura foram fortalecidos

Foram confirmadas as seguintes melhorias:

- concorrência dos workflows controlada;
- lock nativo do state Terraform;
- `terraform fmt`;
- `terraform validate`;
- TFLint;
- Trivy;
- actions fixadas por SHA;
- remoção do input manual de ambiente que anteriormente não possuía efeito;
- Playwright após deploy em desenvolvimento;
- instalação explícita do pacote de contratos.

### Evidência

- [Workflow principal de CI/CD](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/.github/workflows/cd.yml)

---

# 5. Problemas ainda encontrados

## 5.1. Alta prioridade: possível falha no fluxo de agendamento

Existe uma inconsistência concreta entre o admin e o contrato do backend.

O campo exibido no admin está ligado a:

```ts
form.data_publicacao
```

A validação do composable também consulta `data_publicacao`, e o payload é enviado sem converter esse valor.

Porém, o schema compartilhado exige:

```ts
data_publicacao_programada
```

quando o status é `Programado`.

O scheduler também consulta exclusivamente:

```ts
data_publicacao_programada
```

### Fluxo provável do erro

1. O usuário escolhe `Programado`.
2. O admin preenche `data_publicacao`.
3. O payload não possui `data_publicacao_programada`.
4. O backend rejeita a requisição por falha de validação.

### Causa de o problema não ter sido detectado

Os testes do schema e do scheduler montam manualmente payloads usando o campo correto.

Eles não validam o payload realmente produzido pelo formulário do admin.

### Correção recomendada

Usar apenas:

```vue
<input
  v-model="form.data_publicacao_programada"
  type="datetime-local"
/>
```

Também deve ser ajustado o composable `usePostForm` para validar o mesmo campo.

### Testes necessários

Criar teste que:

- preencha o formulário;
- selecione status programado;
- informe data e hora;
- capture o payload real enviado;
- valide que `data_publicacao_programada` está presente;
- valide que o backend aceita o payload.

### Evidências

- [SettingsDrawer.vue](https://github.com/marcelo-jgoncalves/mgoncalves-editorial-platform/blob/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/admin/src/components/editor/SettingsDrawer.vue)
- [Schema compartilhado](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/packages/contracts/src/post.ts)
- [Scheduler](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/backend/src/functions/postScheduler/index.ts)

---

## 5.2. Alta prioridade: exclusão ainda possui uma condição de corrida

A exclusão segue aproximadamente este fluxo:

1. lê o post;
2. calcula os deltas dos contadores;
3. executa `Delete`;
4. atualiza os contadores na transação.

O `Delete` não possui `ConditionExpression` baseada na versão lida.

### Cenário de risco

1. A exclusão lê um post publicado.
2. Outra requisição altera o post para rascunho.
3. A atualização ajusta o contador.
4. A exclusão remove a nova versão.
5. A exclusão reduz novamente o contador com base no estado antigo.

A transação garante atomicidade entre o delete e a alteração do contador, mas não garante que o estado usado para calcular o delta ainda seja o atual.

### Correção recomendada

Adicionar ao `Delete`:

```ts
ConditionExpression: "#version = :expectedVersion"
```

Também é necessário mapear o nome do atributo e informar a versão esperada.

### Comportamento esperado

Quando a versão não corresponder:

```text
409 Conflict
```

### Testes necessários

Criar teste de integração para:

- carregar post na versão N;
- atualizar para versão N+1;
- tentar excluir usando a versão N;
- confirmar falha com `409`;
- confirmar que o post e os contadores permanecem consistentes.

### Evidência

- [Função de administração de posts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/backend/src/functions/adminPosts/index.ts)

---

## 5.3. O pacote de contratos ainda não é um gate independente

O pacote possui scripts:

```json
{
  "test": "jest",
  "typecheck": "tsc --noEmit"
}
```

Também possui testes reais.

Porém, o workflow apenas instala suas dependências.

Não foi identificado um job explícito executando dentro de `packages/contracts`:

```bash
npm ci
npm audit --audit-level=high
npm run typecheck
npm test
```

O Dependabot também cobre:

- backend;
- frontend;
- admin;
- GitHub Actions.

Mas não cobre o novo pacote de contratos.

### Correção recomendada

Criar um job:

```text
Test Shared Contracts
```

Esse job deve executar:

```bash
npm ci
npm audit --audit-level=high
npm run typecheck
npm test
```

O deploy deve depender dele.

Adicionar também `/packages/contracts` ao Dependabot.

### Critérios de aceite

- testes do pacote devem ser executados explicitamente;
- typecheck do pacote deve bloquear a entrega;
- vulnerabilidades altas devem bloquear a entrega;
- dependências do pacote devem ser monitoradas.

### Evidências

- [Package do módulo de contratos](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/packages/contracts/package.json)
- [Dependabot](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/.github/dependabot.yml)

---

## 5.4. A estrutura do monorepo ainda é frágil

Apesar da criação do pacote compartilhado, a raiz continua sem npm workspaces.

Backend e admin dependem dele usando:

```text
file:../packages/contracts
```

A pipeline precisou adicionar instalações independentes de `packages/contracts` em vários jobs para que o TypeScript encontrasse as dependências do pacote.

### Consequências

- repetição no workflow;
- múltiplos `node_modules`;
- múltiplos lockfiles;
- cache mais complexo;
- maior possibilidade de diferenças entre ambientes;
- instalação local menos previsível;
- maior dificuldade de evolução futura.

### Recomendação

Adotar npm workspaces ou outro gerenciador de monorepo.

Exemplo de raiz:

```json
{
  "private": true,
  "workspaces": [
    "admin",
    "backend",
    "frontend",
    "packages/*"
  ]
}
```

Também deve ser avaliada a consolidação dos lockfiles.

### Critérios de aceite

- instalação única na raiz;
- resolução automática do pacote compartilhado;
- pipeline com menos passos repetidos;
- cache centralizado;
- scripts de build e teste executáveis a partir da raiz.

### Evidência

- [Package.json raiz](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/package.json)

---

## 5.5. Os scans de segurança são executados duas vezes

O arquivo `security.yml` possui simultaneamente:

```yaml
push:
workflow_call:
```

A pipeline principal chama esse workflow por `workflow_call`.

O evento de push também inicia outra execução independente para o mesmo commit.

### Impacto

Não é um risco de segurança.

Porém, produz:

- consumo desnecessário de runner;
- duplicação de resultados;
- interface do Actions mais ruidosa;
- maior tempo total de processamento;
- risco de confusão sobre qual execução é o gate real.

### Correção recomendada

Se a pipeline principal for a única responsável pelo gate, manter apenas:

```yaml
on:
  workflow_call:
```

Caso se deseje permitir execução independente, manter também:

```yaml
workflow_dispatch:
```

Evitar disparo duplicado por `push`.

### Evidência

- [Workflow de segurança](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/.github/workflows/security.yml)

---

## 5.6. Produção ainda não possui smoke test com navegador

O ambiente de desenvolvimento executa Playwright após o deploy.

O fluxo de produção continua usando principalmente verificações `curl` para:

- frontend;
- admin;
- API.

### Risco

O `curl` não valida adequadamente:

- execução de JavaScript;
- renderização real;
- navegação;
- cookies;
- autenticação;
- assets;
- erros de hidratação;
- comportamentos específicos do navegador.

### Avaliação

Como o ambiente ainda é tratado como desenvolvimento sem tráfego de produção, isso não é bloqueador imediato.

Deve ser resolvido antes de uma ativação real de produção.

### Correção recomendada

Criar um conjunto mínimo e não destrutivo de testes Playwright para produção.

Verificar:

- carregamento da home;
- carregamento de artigo;
- assets essenciais;
- ausência de erros críticos;
- rotas principais;
- headers e redirecionamentos;
- carregamento do admin;
- comportamento de autenticação sem alterar dados.

### Evidências

- [Workflow principal de CI/CD](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/.github/workflows/cd.yml)
- [Riscos aceitos no Trivy](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/.trivyignore)

---

## 5.7. A pipeline ainda termina com warnings

A última execução bem-sucedida apresentou warnings, incluindo:

- Gitleaks usando action baseada em Node.js 20;
- `setup-terraform` baseado em Node.js 20;
- variável não utilizada no frontend;
- uso de `<img>` sinalizado pelo Next.js.

### Avaliação

Não são falhas críticas.

Entretanto, um projeto que pretende manter padrão rigoroso deve buscar uma pipeline limpa.

### Correção recomendada

- atualizar actions compatíveis;
- manter fixação por SHA;
- remover variável não utilizada;
- revisar uso de `<img>`;
- usar componente de imagem do framework quando apropriado;
- documentar exceções quando a substituição não fizer sentido.

### Evidência

- [Execução pública examinada](https://github.com/marcelo-jgoncalves/mgoncalves-editorial-platform/actions/runs/30772260682)

---

## 5.8. Existe pequena deriva em comentários

O backend contém comentário indicando que o admin ainda não devolve `version` e que a proteção otimista não seria acionada.

Porém, o admin:

- carrega o objeto retornado pela API no formulário;
- preserva `version`;
- envia o formulário no payload;
- trata explicitamente respostas `409`.

### Avaliação

A implementação parece estar melhor do que o comentário sugere.

O comentário desatualizado pode induzir futuras mudanças incorretas.

### Correção recomendada

- atualizar ou remover o comentário;
- documentar o fluxo real de versionamento;
- incluir teste no admin confirmando que `version` é preservada no payload.

### Evidências

- [Admin posts backend](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/backend/src/functions/adminPosts/index.ts)
- [usePostForm](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/c1d3a4f22bf930dd901a77a50b0e20df2ac4d11c/admin/src/composables/usePostForm.ts)

---

# 6. Plano de ação priorizado

## P0 — Correções imediatas

### P0.1. Corrigir o campo de agendamento

- substituir `data_publicacao` por `data_publicacao_programada`;
- revisar todos os consumidores do campo;
- migrar dados antigos, caso existam;
- criar teste integrado do payload do admin;
- validar scheduler de ponta a ponta.

### P0.2. Proteger o delete com versionamento otimista

- adicionar `ConditionExpression`;
- tratar conflito com `409`;
- testar atualização concorrente com exclusão;
- validar consistência dos contadores.

---

## P1 — Elevar a robustez dos contratos e da pipeline

### P1.1. Criar gate específico para `packages/contracts`

Executar:

- `npm ci`;
- `npm audit`;
- `npm run typecheck`;
- `npm test`.

### P1.2. Adicionar contratos ao Dependabot

Adicionar diretório:

```text
/packages/contracts
```

### P1.3. Consolidar o monorepo com workspaces

- declarar workspaces;
- revisar lockfiles;
- centralizar instalação;
- simplificar cache e workflows;
- executar scripts pela raiz.

---

## P2 — Qualidade operacional

### P2.1. Remover scans duplicados

### P2.2. Adicionar smoke Playwright em produção

### P2.3. Eliminar warnings da pipeline

### P2.4. Atualizar comentários desatualizados

---

# 7. Critérios de aceite

## Agendamento

- [ ] O admin usa exclusivamente `data_publicacao_programada`.
- [ ] O schema aceita o payload real do formulário.
- [ ] O scheduler encontra os posts programados.
- [ ] Existe teste end-to-end do fluxo de agendamento.
- [ ] Não existe duplicidade entre `data_publicacao` e `data_publicacao_programada`.

## Exclusão e concorrência

- [ ] Delete exige versão esperada.
- [ ] Conflito de versão retorna `409`.
- [ ] Atualização concorrente não causa contadores incorretos.
- [ ] Existe teste de integração cobrindo update versus delete.

## Contratos

- [ ] O pacote possui job próprio na CI.
- [ ] Typecheck do pacote bloqueia o deploy.
- [ ] Testes do pacote bloqueiam o deploy.
- [ ] Audit do pacote bloqueia vulnerabilidades altas.
- [ ] Dependabot monitora o pacote.

## Monorepo

- [ ] Existe instalação centralizada.
- [ ] O pacote compartilhado é resolvido por workspace.
- [ ] A pipeline não repete instalações desnecessárias.
- [ ] Scripts principais podem ser executados pela raiz.

## Operação

- [ ] Scans não são executados duas vezes para o mesmo push.
- [ ] Produção possui smoke test de navegador antes da ativação real.
- [ ] A pipeline termina sem warnings conhecidos.
- [ ] Comentários refletem o comportamento atual.

---

# 8. Conclusão final

A evolução foi significativa.

Foram confirmadas melhorias importantes em:

- segurança;
- contratos compartilhados;
- concorrência;
- validação;
- testes de integração;
- infraestrutura;
- CI/CD;
- documentação.

O projeto agora está próximo de um padrão de referência para uma plataforma serverless de pequeno ou médio porte.

O principal motivo para a nota permanecer abaixo de 9 é a provável falha funcional no fluxo de agendamento, somada à condição de corrida ainda presente na exclusão.

As duas primeiras correções devem ser tratadas antes de considerar o sistema completamente confiável para produção.

## Resultado final

**Nota anterior:** 8,0/10  
**Nova nota:** 8,7/10  
**Evolução:** +0,7 ponto
