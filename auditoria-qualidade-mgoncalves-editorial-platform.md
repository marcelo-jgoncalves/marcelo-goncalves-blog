# Auditoria de Qualidade de Engenharia  
## Projeto: `mgoncalves-editorial-platform`

**Repositório analisado:**  
https://github.com/marcelo-jgoncalves/mgoncalves-editorial-platform/tree/develop

**Branch analisada:** `develop`

**Data da auditoria:** 2 de agosto de 2026

---

## 1. Escopo e premissas da avaliação

Esta auditoria foi realizada com a perspectiva de um revisor externo, desconsiderando qualquer conhecimento prévio sobre o autor ou sobre o histórico do projeto.

A análise considerou principalmente:

- README e documentação técnica;
- estrutura do monorepo;
- código do backend;
- código do painel administrativo;
- infraestrutura Terraform;
- workflows do GitHub Actions;
- testes automatizados;
- controles de segurança;
- observabilidade;
- contratos entre componentes;
- práticas de CI/CD;
- sinais de manutenibilidade e prontidão para produção.

A avaliação foi baseada no conteúdo atual da branch `develop` e nas execuções públicas do GitHub Actions.

Não foram realizados:

- execução local completa da aplicação;
- testes de carga;
- pentest;
- análise dinâmica em ambiente de produção;
- inspeção de recursos diretamente na conta AWS;
- validação manual de todas as interfaces visuais.

---

# 2. Avaliação geral

## Nota geral: **8/10**

O projeto apresenta qualidade de engenharia claramente acima da média, inclusive quando comparado a muitos projetos profissionais.

Ele não aparenta ser apenas um protótipo acompanhado por um README sofisticado. Uma parte relevante das práticas descritas na documentação está efetivamente refletida:

- no código;
- nos testes;
- na infraestrutura;
- nas permissões IAM;
- nas pipelines;
- nos mecanismos de observabilidade;
- nos controles de segurança.

Ainda assim, o projeto ainda não deve ser classificado como plenamente **world class**.

Os principais fatores que impedem essa classificação são:

1. os scans de segurança não bloqueiam diretamente o deploy;
2. os contratos entre backend e frontend continuam duplicados;
3. as operações de escrita no DynamoDB não possuem garantias suficientes contra sobrescrita e concorrência;
4. a validação semântica das entradas ainda é limitada;
5. existem sinais de deriva na documentação;
6. alguns gates da pipeline são menos rigorosos do que aparentam.

---

# 3. Pontos fortes

## 3.1. Arquitetura coerente e realmente implementada

A separação entre os componentes está clara:

- site público;
- painel administrativo;
- backend serverless;
- infraestrutura Terraform;
- automações de CI/CD;
- processamento assíncrono;
- publicação agendada;
- observabilidade.

O repositório possui:

- dez módulos Terraform;
- onze funções Lambda com responsabilidades relativamente delimitadas;
- publicação agendada;
- processamento assíncrono de imagens;
- mecanismos de observabilidade;
- infraestrutura distribuída em componentes coerentes.

Isso demonstra que a arquitetura apresentada no README não é apenas conceitual.

### Evidência

- [README do projeto](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/README.md)

---

## 3.2. Infraestrutura como código madura

A infraestrutura Terraform apresenta decisões de boa qualidade, entre elas:

- roles IAM separadas por função Lambda;
- permissões delimitadas por recurso e operação;
- log groups com retenção explícita;
- suporte a X-Ray;
- alarmes para erros e throttling;
- dead-letter queue;
- publicação assíncrona;
- criptografia no DynamoDB;
- Point-in-Time Recovery configurável;
- índices esparsos;
- projeções `INCLUDE` para evitar replicação desnecessária de atributos grandes.

Um sinal especialmente positivo é o uso de blocos Terraform `moved` para preservar o estado durante refatorações das roles IAM.

Isso demonstra preocupação com:

- continuidade operacional;
- migração segura de recursos;
- preservação do state;
- prevenção de recriações desnecessárias.

### Evidência

- [Configuração de IAM das Lambdas](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/infra/modules/lambda/lambda-iam.tf)

---

## 3.3. CI/CD acima da média

A pipeline principal executa uma sequência significativa de verificações:

- derivação ou verificação de tipos;
- lint;
- testes unitários;
- testes de integração com DynamoDB Local;
- builds;
- validações Terraform;
- deploy;
- smoke tests;
- Playwright no ambiente de desenvolvimento.

Outros pontos positivos:

- GitHub Actions fixadas por SHA;
- imagem do DynamoDB Local fixada por digest;
- autenticação AWS por OIDC;
- ausência de access keys AWS permanentes na pipeline;
- plano Terraform armazenado como artefato;
- aprovação por GitHub Environment;
- aplicação exatamente do plano aprovado.

A estratégia de produção reduz o risco de divergência entre o plano revisado e o plano aplicado.

### Evidências

- [Workflow principal de CI/CD](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/.github/workflows/cd.yml)
- [Execução pública examinada](https://github.com/marcelo-jgoncalves/mgoncalves-editorial-platform/actions/runs/30763830350)

---

## 3.4. Segurança tratada como requisito de engenharia

O projeto possui controles de segurança concretos, não apenas declarações documentais.

Entre eles:

- sessão opaca armazenada no DynamoDB;
- cookie `HttpOnly`;
- cookie `Secure`;
- `SameSite=Strict`;
- validação de JWT do Cognito no backend;
- sanitização HTML server-side;
- schemas Zod com rejeição de campos desconhecidos;
- proteção contra mass assignment;
- IAM separado por função;
- Semgrep;
- Gitleaks;
- CloudFront com Origin Access Control;
- headers de segurança.

A sessão não depende exclusivamente do TTL do DynamoDB para expiração. O código valida explicitamente a validade temporal da sessão, enquanto o TTL fica responsável apenas pela remoção eventual dos registros.

Essa é a abordagem correta, porque o TTL do DynamoDB não garante exclusão imediata.

### Evidências

- [Implementação da sessão administrativa](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/backend/src/functions/adminSession/index.ts)
- [Configuração DynamoDB](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/infra/modules/dynamodb/main.tf)

---

## 3.5. Aprendizado operacional incorporado ao projeto

A estrutura do projeto demonstra que vários controles surgiram como resposta a problemas concretos.

Exemplos:

- integração com DynamoDB Local;
- índices esparsos;
- transações para manutenção de contadores;
- invalidação de cache após publicação;
- detecção de deriva de tipos;
- tratamento explícito de JSON malformado;
- verificações pós-deploy;
- smoke tests.

Isso é um bom sinal de maturidade.

Projetos robustos normalmente não surgem apenas da aplicação mecânica de padrões teóricos. Eles evoluem a partir de:

- incidentes;
- falhas;
- inconsistências;
- problemas de integração;
- necessidades operacionais reais.

### Evidência

- [Workflow de CI/CD](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/.github/workflows/cd.yml)

---

# 4. Problemas e riscos encontrados

## 4.1. Crítico: scans de segurança não bloqueiam diretamente o deploy

Este é o problema mais importante identificado na auditoria.

A pipeline de segurança está implementada como um workflow separado, disparado em paralelo.

O job de deploy depende de:

- build;
- testes;
- integração;
- validações internas da pipeline principal.

Porém, ele não depende explicitamente de:

- Semgrep;
- Gitleaks;
- `npm audit`;
- TFLint;
- Trivy.

O README afirma que alguns desses controles são obrigatórios, mas o workflow de CD não os incorpora como dependências do deploy.

### Risco

Por inferência da estrutura atual:

- um commit pode ser implantado;
- mesmo que o workflow de segurança falhe;
- desde que os jobs da pipeline principal sejam aprovados.

Isso é especialmente relevante porque o fluxo normal permite pushes para `develop`.

### Consequência

Os scans existem, mas não funcionam como gates reais da entrega.

Eles funcionam como verificações paralelas e informativas.

### Recomendação

Adotar uma das seguintes estratégias:

#### Opção A — incorporar os scans ao workflow principal

Adicionar jobs para:

- Semgrep;
- Gitleaks;
- auditoria de dependências;
- Trivy;
- TFLint;
- Terraform security scanning.

O job de deploy deve incluir todos esses jobs em `needs`.

#### Opção B — criar workflow reutilizável

Transformar a análise de segurança em um workflow chamado por `workflow_call`.

A pipeline principal deve chamar esse workflow e depender do resultado.

#### Critério de aceite

Nenhum deploy para `dev` ou `prod` deve ocorrer quando qualquer gate obrigatório de segurança falhar.

### Evidência

- [Workflow principal de CI/CD](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/.github/workflows/cd.yml)

---

## 4.2. Importante: contratos entre backend e admin continuam duplicados

O projeto possui um script chamado:

```text
scripts/check-types-drift.mjs
```

A ideia é detectar inconsistências entre os tipos usados pelo backend e pelo painel administrativo.

A intenção é boa, mas a implementação é estruturalmente frágil.

### Limitações identificadas

O script:

- usa parsing baseado em expressões regulares;
- entende apenas interfaces e aliases relativamente simples;
- não garante que todos os campos existam dos dois lados;
- registra opcionalidade, mas não a compara de forma completa;
- compara principalmente a entidade `Post`;
- pode deixar de detectar mudanças mais complexas de TypeScript.

### Problema de fundo

Backend e admin mantêm cópias independentes dos mesmos contratos.

O script tenta detectar a divergência depois que ela acontece.

A solução mais sólida é eliminar a duplicação.

### Observação sobre o monorepo

O repositório é tratado como monorepo, mas o `package.json` raiz não declara npm workspaces.

A instalação é feita entrando em diferentes diretórios e executando `npm install`.

Portanto, o projeto funciona mais como um monorepo organizacional do que como um workspace integrado.

### Recomendação

Criar um pacote compartilhado, por exemplo:

```text
packages/contracts
```

Esse pacote deve conter:

- schemas Zod;
- enums compartilhados;
- tipos inferidos;
- contratos de requests;
- contratos de responses;
- tipos de domínio;
- validações comuns.

Exemplo:

```ts
export const PostStatusSchema = z.enum([
  "draft",
  "scheduled",
  "published",
  "archived",
]);

export const PostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  status: PostStatusSchema,
});

export type Post = z.infer<typeof PostSchema>;
```

Backend e admin devem importar os mesmos schemas e tipos.

### Critério de aceite

- não existir cópia independente do contrato principal de `Post`;
- backend e admin compilarem contra a mesma fonte de verdade;
- remover ou simplificar significativamente o script de comparação por regex;
- a pipeline falhar naturalmente quando um consumidor estiver incompatível com o contrato.

### Evidências

- [Script de detecção de deriva](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/scripts/check-types-drift.mjs)
- [Package.json raiz](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/package.json)

---

## 4.3. Importante: validação semântica insuficiente nas operações de posts

O schema Zod possui uma boa proteção contra campos desconhecidos.

Porém, várias propriedades ainda são validadas apenas de forma superficial.

### Problemas identificados

- `status` é opcional;
- datas são strings arbitrárias;
- URLs são strings arbitrárias;
- slug não possui padrão explícito;
- título não possui tamanho máximo;
- resumo não possui tamanho máximo;
- conteúdo HTML não possui limite máximo;
- `tempo_leitura_min` não exige inteiro;
- `tempo_leitura_min` não possui mínimo ou máximo;
- não há regras claras para combinações válidas de status e datas.

### Exemplos de regras que deveriam existir

- um post `scheduled` deve possuir data futura;
- um post `published` deve possuir data de publicação válida;
- um slug deve seguir um formato previsível;
- URLs devem ser URLs válidas;
- tempo de leitura deve ser inteiro positivo;
- títulos vazios ou excessivamente longos devem ser rejeitados;
- HTML deve respeitar um limite seguro de tamanho;
- campos obrigatórios devem variar de acordo com o status.

### Recomendação

Fortalecer os schemas Zod com:

- `.url()`;
- `.datetime()`;
- `.min()`;
- `.max()`;
- `.int()`;
- regex para slugs;
- `superRefine`;
- discriminated unions quando aplicável.

Exemplo conceitual:

```ts
const PostSchema = z
  .object({
    slug: z
      .string()
      .min(3)
      .max(160)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

    title: z.string().min(3).max(180),

    status: z.enum([
      "draft",
      "scheduled",
      "published",
      "archived",
    ]),

    publicationDate: z.string().datetime().optional(),

    readingTimeMinutes: z.number().int().min(1).max(120),

    canonicalUrl: z.string().url().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "scheduled" && !data.publicationDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["publicationDate"],
        message: "Scheduled posts require a publication date.",
      });
    }
  });
```

### Critério de aceite

- todos os campos com semântica conhecida devem possuir validação correspondente;
- entradas inválidas devem resultar em `400`;
- regras entre status e datas devem estar automatizadas;
- deve haver testes unitários cobrindo limites e combinações inválidas.

### Evidência

- [Schema de posts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/backend/src/common/postSchema.ts)

---

## 4.4. Importante: criação e atualização podem sobrescrever dados indevidamente

Foram identificados riscos nas operações de escrita do DynamoDB.

### Criação

O `POST` usa uma operação `Put` sem `ConditionExpression`.

Isso significa que a criação de um post com slug já existente pode sobrescrever silenciosamente o registro anterior.

### Atualização

O `PUT` não exige explicitamente que o item exista.

Dependendo da composição do item, a operação pode funcionar como upsert.

### Recomendação para criação

Usar condição:

```ts
ConditionExpression: "attribute_not_exists(pk)"
```

ou na chave apropriada do item.

### Recomendação para atualização

Exigir existência:

```ts
ConditionExpression: "attribute_exists(pk)"
```

### Tratamento esperado

Condições não atendidas devem gerar respostas específicas:

- `409 Conflict` para criação de slug já existente;
- `404 Not Found` para atualização de item inexistente.

### Critério de aceite

- criar slug já existente não pode sobrescrever conteúdo;
- atualizar post inexistente não pode criar implicitamente um novo item;
- testes de integração devem cobrir ambos os cenários.

### Evidência

- [Função de administração de posts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/backend/src/functions/adminPosts/index.ts)

---

## 4.5. Importante: ausência de controle otimista de concorrência

A atualização de posts segue aproximadamente este fluxo:

1. lê o registro atual;
2. calcula diferenças;
3. monta a transação;
4. grava o post;
5. atualiza contadores.

A transação garante atomicidade entre as alterações realizadas por aquela requisição.

Porém, não protege adequadamente contra duas requisições concorrentes que tenham lido a mesma versão anterior.

### Cenário de risco

Duas atualizações podem:

- ler o mesmo estado;
- calcular deltas sobre o mesmo valor antigo;
- tentar alterar contadores;
- produzir resultados incorretos ou sobrescrever uma atualização anterior.

Mesmo que haja apenas um administrador na maior parte do tempo, concorrência ainda pode ocorrer por:

- duplo clique;
- retries;
- duas abas;
- automações;
- publicação agendada;
- processamento paralelo;
- falhas de rede;
- reenvio da mesma requisição.

### Recomendação

Adicionar versionamento otimista.

Exemplo:

```ts
{
  version: 7
}
```

Na atualização:

```ts
ConditionExpression: "#version = :expectedVersion"
```

A nova versão deve ser:

```ts
version + 1
```

Também é possível usar `updatedAt` como condição, embora um contador de versão seja mais explícito.

### Resposta esperada

Quando a versão tiver mudado:

```text
409 Conflict
```

O frontend deve informar que o registro foi alterado desde que foi carregado.

### Critério de aceite

- duas atualizações concorrentes não podem sobrescrever silenciosamente uma à outra;
- contadores devem permanecer corretos;
- deve existir teste de integração para conflito de versão.

### Evidência

- [Função de administração de posts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/backend/src/functions/adminPosts/index.ts)

---

## 4.6. Importante: falta validação centralizada de configuração

Algumas funções leem diretamente variáveis de ambiente, por exemplo:

```ts
process.env.POSTS_TABLE
```

Também existe fallback como:

```ts
ADMIN_ORIGIN || "*"
```

### Problemas

Uma configuração ausente pode produzir:

- comportamento permissivo;
- erro tardio;
- falha em runtime;
- resposta CORS inconsistente;
- diferença silenciosa entre ambientes.

No caso de CORS, existe ainda o risco de combinar:

```text
Access-Control-Allow-Origin: *
```

com:

```text
Access-Control-Allow-Credentials: true
```

Essa combinação não é aceita pelos navegadores para requisições credenciadas.

### Recomendação

Criar um módulo centralizado de configuração.

Exemplo:

```ts
import { z } from "zod";

const EnvSchema = z.object({
  POSTS_TABLE: z.string().min(1),
  ADMIN_ORIGIN: z.string().url(),
  AWS_REGION: z.string().min(1),
});

export const env = EnvSchema.parse(process.env);
```

As Lambdas devem falhar no cold start quando a configuração for inválida.

Não usar fallback `*` para endpoints administrativos com credenciais.

### Critério de aceite

- todas as variáveis obrigatórias devem ser validadas;
- configuração inválida deve impedir inicialização;
- nenhum endpoint credenciado deve usar `Access-Control-Allow-Origin: *`;
- testes devem cobrir configuração ausente e inválida.

### Evidências

- [Admin posts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/backend/src/functions/adminPosts/index.ts)
- [Admin session](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/backend/src/functions/adminSession/index.ts)

---

## 4.7. Importante: tratamento inconsistente de JSON inválido

A função `adminPosts` trata JSON malformado como erro do cliente.

A função `adminSession`, porém, utiliza `JSON.parse` dentro de um bloco genérico.

Assim, JSON inválido pode resultar em:

```text
500 Internal Server Error
```

quando o correto seria:

```text
400 Bad Request
```

### Recomendação

Criar utilitário comum:

```ts
export function parseJsonBody<T>(body: string | null): T {
  if (!body) {
    throw new BadRequestError("Request body is required.");
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new BadRequestError("Invalid JSON body.");
  }
}
```

Idealmente, esse utilitário deve já integrar:

- parsing;
- validação Zod;
- padronização da resposta;
- logging seguro;
- correlação de requisição.

### Critério de aceite

- JSON inválido sempre resultar em `400`;
- comportamento consistente em todas as Lambdas HTTP;
- testes cobrirem body vazio e JSON malformado.

### Evidências

- [Admin posts](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/backend/src/functions/adminPosts/index.ts)
- [Admin session](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/backend/src/functions/adminSession/index.ts)

---

## 4.8. Documentação apresenta sinais de deriva

O README atual descreve dez módulos Terraform.

O arquivo `CLAUDE.md` ainda afirma que existem sete.

O mesmo documento reconhece a existência de comentários antigos contendo:

- datas;
- sessões;
- auditorias;
- contexto de processo;
- referências temporárias.

Ao mesmo tempo, as regras atuais do próprio documento desaconselham esse tipo de comentário.

### Problema

A documentação está forte, mas mistura conteúdos com ciclos de vida muito diferentes:

- arquitetura durável;
- regras de engenharia;
- instruções para agentes;
- estado temporário;
- histórico de decisões;
- URLs de ambientes;
- contexto de sessões anteriores.

Quanto maior essa mistura, maior a chance de deriva.

### Recomendação

Separar a documentação.

Estrutura sugerida:

```text
docs/
├── architecture/
│   ├── overview.md
│   ├── backend.md
│   ├── frontend.md
│   ├── data-model.md
│   └── infrastructure.md
├── operations/
│   ├── deployments.md
│   ├── incident-response.md
│   ├── observability.md
│   └── rollback.md
├── decisions/
│   └── ADR-*.md
├── development/
│   ├── local-setup.md
│   ├── testing.md
│   └── contributing.md
└── agents/
    └── instructions.md
```

O README deve permanecer como visão geral e ponto de entrada.

O `CLAUDE.md` deve conter apenas instruções úteis ao agente, sem tentar substituir toda a documentação do sistema.

### Critério de aceite

- não haver números arquiteturais contraditórios;
- documentação durável separada de contexto temporário;
- instruções para IA não serem fonte única de conhecimento arquitetural;
- criar verificação automatizada para links e comandos documentados, quando possível.

### Evidências

- [README](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/README.md)
- Arquivo `CLAUDE.md` da branch `develop`.

---

## 4.9. Lint usa `--fix` dentro da CI

O comando de lint do admin é:

```text
eslint . --fix --cache
```

### Problema

A CI deve verificar o código, não modificá-lo silenciosamente.

Com `--fix`, algumas violações podem:

- ser corrigidas no workspace temporário;
- deixar de falhar;
- não ser persistidas no repositório;
- produzir diferença entre o código validado e o código versionado.

### Recomendação

Separar comandos:

```json
{
  "lint": "eslint .",
  "lint:fix": "eslint . --fix"
}
```

Na CI, executar:

```text
npm run lint
```

Localmente, desenvolvedores e agentes podem executar:

```text
npm run lint:fix
```

### Critério de aceite

- a CI nunca deve modificar arquivos;
- código que necessita correção automática deve falhar no gate;
- o comando de correção deve existir separadamente.

### Evidência

- [Package.json do admin](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/admin/package.json)

---

## 4.10. Smoke Playwright não aparece no fluxo de produção

O ambiente `dev` recebe smoke test com Playwright após o deploy.

No fluxo de produção, a verificação observada é mais limitada e baseada em `curl`.

### Risco

A produção pode ter diferenças relacionadas a:

- distribuição CloudFront;
- cookies;
- autenticação;
- headers;
- assets;
- roteamento;
- comportamento real no navegador.

Um teste HTTP simples não captura toda a jornada.

### Recomendação

Executar um conjunto pequeno e seguro de smoke tests Playwright em produção.

Esses testes devem:

- ser não destrutivos;
- verificar carregamento das páginas essenciais;
- verificar assets;
- validar status e conteúdo mínimo;
- verificar redirecionamentos;
- validar headers essenciais;
- evitar criar ou alterar dados reais, salvo ambiente controlado.

### Critério de aceite

Após o deploy de produção:

- páginas públicas essenciais devem ser abertas por navegador real;
- o teste deve falhar em caso de erro funcional crítico;
- deve existir estratégia de rollback ou interrupção quando o smoke falhar.

### Evidência

- [Workflow principal de CI/CD](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/.github/workflows/cd.yml)

---

## 4.11. Input manual de ambiente não é efetivamente utilizado

O `workflow_dispatch` declara um input como:

```text
environment: dev | prod
```

Porém, os jobs observados determinam o ambiente principalmente por:

```text
github.ref
```

### Problema

Isso pode induzir o operador a acreditar que o input controla o deploy, quando não controla efetivamente todos os jobs.

### Recomendação

Escolher uma das abordagens:

#### Abordagem 1

Remover o input se a branch for a única fonte de verdade.

#### Abordagem 2

Usar explicitamente o input em todos os jobs relevantes e validar combinações permitidas.

Exemplo:

- `develop` pode implantar apenas em `dev`;
- tag ou branch de release pode implantar em `prod`;
- input manual não pode violar essas regras.

### Critério de aceite

- não existir input sem efeito;
- o ambiente selecionado deve ser inequívoco;
- regras de autorização devem ser explícitas.

### Evidência

- [Workflow principal de CI/CD](https://raw.githubusercontent.com/marcelo-jgoncalves/mgoncalves-editorial-platform/develop/.github/workflows/cd.yml)

---

## 4.12. Actions com aviso de runtime Node.js

As execuções atuais mostram avisos relacionados a actions ainda direcionadas ao runtime Node.js 20 e executadas com Node.js 24.

### Avaliação

Não é uma falha funcional atual.

Porém, é um sinal de manutenção futura.

### Recomendação

- identificar as actions que geram o aviso;
- verificar versões mais recentes;
- atualizar os SHAs de forma controlada;
- conferir changelogs;
- manter fixação por SHA após a atualização.

### Critério de aceite

- pipeline sem warnings de runtime obsoleto;
- actions atualizadas e fixadas por SHA;
- testes completos após atualização.

### Evidência

- [Execução pública examinada](https://github.com/marcelo-jgoncalves/mgoncalves-editorial-platform/actions/runs/30763830350)

---

# 5. Avaliação por área

| Área | Nota |
|---|---:|
| Arquitetura | **8,5/10** |
| Infraestrutura como código | **9/10** |
| CI/CD | **8,5/10** |
| Segurança | **8/10** |
| Testes | **8,5/10** |
| Qualidade do código de aplicação | **7,5/10** |
| Contratos e modularidade do monorepo | **7/10** |
| Documentação | **8/10** |
| Prontidão para produção | **7,5/10** |
| **Nota geral** | **8/10** |

---

# 6. Plano de ação priorizado

## P0 — Deve ser corrigido antes de considerar a entrega plenamente protegida

### P0.1. Transformar segurança em gate real de deploy

Implementar dependência obrigatória entre o deploy e:

- Semgrep;
- Gitleaks;
- auditoria de dependências;
- TFLint;
- Trivy;
- demais verificações consideradas obrigatórias.

### P0.2. Proteger criação e atualização no DynamoDB

Adicionar:

- `attribute_not_exists` na criação;
- `attribute_exists` na atualização;
- tratamento de `409`;
- tratamento de `404`.

### P0.3. Implementar controle otimista de concorrência

Adicionar campo de versão e condição em updates.

---

## P1 — Deve ser corrigido para elevar o projeto ao nível de engenharia de referência

### P1.1. Criar pacote compartilhado de contratos

Centralizar:

- Zod;
- tipos;
- enums;
- requests;
- responses;
- entidades de domínio.

### P1.2. Fortalecer validação semântica

Adicionar validações de:

- URLs;
- datas;
- slugs;
- tamanhos;
- números inteiros;
- limites;
- combinações entre campos;
- regras por status.

### P1.3. Centralizar configuração

Criar módulo `env` ou equivalente com validação no cold start.

### P1.4. Padronizar erros HTTP

Criar camada comum para:

- parsing;
- validação;
- erros;
- logging;
- responses;
- headers;
- CORS.

---

## P2 — Melhorias de qualidade e manutenção

### P2.1. Remover `--fix` do lint da CI

### P2.2. Executar smoke Playwright em produção

### P2.3. Corrigir ou remover input manual de ambiente

### P2.4. Atualizar actions com warnings de runtime

### P2.5. Reorganizar a documentação

### P2.6. Reduzir comentários temporários e históricos no código

---

# 7. Critérios de aceite globais

A evolução deve ser considerada concluída apenas quando todos os critérios abaixo forem atendidos.

## Segurança e CI/CD

- [ ] Nenhum deploy ocorre quando um scan obrigatório falha.
- [ ] Todos os gates obrigatórios estão no mesmo grafo de dependências do deploy.
- [ ] Actions continuam fixadas por SHA.
- [ ] AWS continua usando OIDC.
- [ ] Nenhuma credencial persistente é introduzida.

## Contratos

- [ ] Backend e admin consomem a mesma definição de contratos.
- [ ] Não há duplicação manual da entidade principal `Post`.
- [ ] Alterações incompatíveis quebram a compilação ou os testes.
- [ ] O script de regex deixa de ser a principal proteção contra deriva.

## Validação

- [ ] URLs inválidas são rejeitadas.
- [ ] Datas inválidas são rejeitadas.
- [ ] Slugs inválidos são rejeitados.
- [ ] Valores numéricos inválidos são rejeitados.
- [ ] Regras entre status e publicação são testadas.
- [ ] Campos possuem limites máximos coerentes.

## DynamoDB e concorrência

- [ ] Criação não sobrescreve slug existente.
- [ ] Atualização não cria item inexistente.
- [ ] Atualizações concorrentes não sobrescrevem silenciosamente.
- [ ] Conflitos retornam `409`.
- [ ] Contadores permanecem consistentes.
- [ ] Testes de integração cobrem concorrência e condições.

## Configuração

- [ ] Todas as variáveis obrigatórias são validadas no cold start.
- [ ] Não há fallback CORS permissivo em endpoints administrativos.
- [ ] Configuração inválida falha de forma explícita.
- [ ] As configurações possuem testes automatizados.

## Qualidade

- [ ] Lint na CI não modifica arquivos.
- [ ] Produção possui smoke test de navegador.
- [ ] Inputs manuais da pipeline possuem efeito real ou são removidos.
- [ ] A documentação não possui números contraditórios.
- [ ] Warnings de runtime das actions foram resolvidos.

---

# 8. Veredito final

O projeto apresenta qualidade alta e sinais claros de engenharia sênior.

Os pontos mais fortes são:

- arquitetura serverless coerente;
- Terraform bem estruturado;
- IAM granular;
- CI/CD madura;
- integração com DynamoDB Local;
- observabilidade;
- autenticação e sessões bem pensadas;
- preocupação real com supply chain;
- aprendizado operacional incorporado ao código.

O projeto está substancialmente acima do nível típico de:

- projetos pessoais;
- portfólios;
- MVPs;
- aplicações internas pequenas;
- muitos sistemas comerciais.

Entretanto, o projeto ainda não deve ser classificado como plenamente **world class**.

O que o separa desse nível não é falta de ferramentas ou quantidade de automações.

O principal ponto é transformar boas intenções e verificações existentes em garantias realmente executáveis.

As prioridades mais importantes são:

1. fazer dos scans de segurança gates obrigatórios do deploy;
2. estabelecer uma única fonte de verdade para contratos;
3. proteger as operações DynamoDB contra sobrescrita e concorrência;
4. fortalecer a validação semântica;
5. centralizar configuração e erros;
6. reduzir deriva documental.

Após a correção desses pontos, o projeto poderá se aproximar de um padrão de engenharia de referência para uma plataforma serverless de pequeno ou médio porte.

---

# 9. Ordem recomendada de implementação

A IA engenheira deve executar as mudanças na seguinte ordem:

1. **Mapear o grafo atual dos workflows.**
2. **Transformar os scans em gates obrigatórios.**
3. **Adicionar condições de criação e atualização no DynamoDB.**
4. **Adicionar versionamento otimista.**
5. **Criar testes de integração para os novos conflitos.**
6. **Criar o pacote compartilhado de contratos.**
7. **Migrar backend e admin para o pacote compartilhado.**
8. **Fortalecer os schemas Zod.**
9. **Criar configuração centralizada.**
10. **Padronizar parsing, erros e responses.**
11. **Remover `--fix` da CI.**
12. **Adicionar smoke Playwright de produção.**
13. **Corrigir o input manual do workflow.**
14. **Atualizar actions com warnings.**
15. **Reorganizar e sincronizar a documentação.**
16. **Executar a suíte completa.**
17. **Validar deploy em `dev`.**
18. **Validar plano e fluxo de produção.**

Cada etapa deve produzir um estado:

- compilável;
- testável;
- revisável;
- sem quebra de comportamento anterior;
- com testes automatizados correspondentes.
