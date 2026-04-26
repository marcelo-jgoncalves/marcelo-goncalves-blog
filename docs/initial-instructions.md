# 🧠 PROJECT TAKEOVER PROMPT — CLAUDE

## 📌 Contexto

Você está assumindo **um projeto já existente e em andamento**.

Este **NÃO é um projeto novo**.

⚠️ **Regra fundamental:**
- NÃO reiniciar o projeto
- NÃO recriar arquitetura do zero
- NÃO substituir código funcional sem justificativa técnica

O objetivo é:

> **Assumir, compreender profundamente, auditar, corrigir e elevar o projeto ao nível world-class (Big Tech quality).**

---

## 📂 Fonte Inicial de Contexto

Existe um arquivo chamado:

\`blueprint.md\`

### Função do blueprint
- Serve como **referência inicial de entendimento**
- Contém decisões arquiteturais, visão do produto e contexto histórico

### Importante
O arquivo **PODE estar desatualizado**.

Portanto:

- Use o \`blueprint.md\` apenas como **ponto de partida**
- O **código atual é a fonte da verdade**
- Divergências devem ser detectadas e documentadas

---

## 🎯 Objetivo Geral

Você deve:

1. Assumir o projeto existente
2. Entender completamente o estado atual
3. Executar uma **auditoria técnica completa**
4. Corrigir problemas estruturais
5. Somente após estabilização → continuar o desenvolvimento

---

## 🚫 O que NÃO fazer

- ❌ Não iniciar refatorações massivas sem análise
- ❌ Não apagar código legado sem investigação
- ❌ Não introduzir novas features antes da auditoria
- ❌ Não alterar padrões arquiteturais sem documentação
- ❌ Não quebrar compatibilidade existente

---

## ✅ Fase 1 — Leitura e Compreensão

Antes de qualquer alteração:

1. Ler completamente:
   - \`blueprint.md\`
   - README
   - documentação existente
   - estrutura de diretórios
   - configs de infraestrutura
   - pipelines CI/CD
   - testes existentes
   - scripts
   - dependências

2. Construir modelo mental de:
   - arquitetura atual
   - fluxo de dados
   - responsabilidades dos módulos
   - decisões implícitas

---

## 📋 Fase 2 — Auditoria Técnica Completa (OBRIGATÓRIA)

Execute uma auditoria **minuciosa e sistemática**.

A auditoria deve avaliar:

---

### 🧱 Arquitetura

- separação de responsabilidades
- modularização
- acoplamento
- coesão
- organização de pastas
- anti-patterns
- dívida técnica
- escalabilidade futura
- alinhamento com Clean Architecture

---

### 💻 Qualidade de Código

- legibilidade
- naming conventions
- complexidade ciclomática
- duplicação
- code smells
- tratamento de erros
- uso correto de tipos
- consistência de padrões

---

### 🧪 Testes

Avaliar:

- existência de testes unitários
- cobertura real
- testes de integração
- testes de contrato
- mocks adequados
- isolamento
- determinismo
- qualidade dos asserts

Definir:

- lacunas críticas de testes
- estratégia ideal de testes

---

### 🔐 Segurança

Avaliar:

- exposição de segredos
- variáveis de ambiente
- autenticação
- autorização
- validação de entrada
- sanitização
- dependências vulneráveis
- permissões excessivas
- práticas OWASP

---

### ☁️ Infraestrutura

Avaliar:

- IaC qualidade
- reprodutibilidade
- ambientes isolados
- naming conventions
- versionamento
- rollback capability
- observabilidade
- custos implícitos
- princípios cloud-native

---

### 📜 Logging e Observabilidade

Avaliar:

- logging estruturado
- níveis de log
- correlação de requests
- tracing distribuído
- métricas
- audit logs
- debugging capability

O projeto deve alcançar padrão:

- production grade
- operável às 3h da manhã
- debugável sem acesso direto ao servidor

---

### 🚀 CI/CD

Avaliar:

- pipelines existentes
- qualidade dos checks
- automação de testes
- linting
- security scans
- build reproducibility
- deployment safety

---

### 📦 Dependências

- dependências não utilizadas
- versões inseguras
- lockfiles
- atualização segura

---

## 🧾 Resultado da Auditoria

Você deve gerar um arquivo:

\`\`\`
/docs/audit-report.md
\`\`\`

Este arquivo deve conter:

- visão geral do projeto
- pontos fortes
- riscos críticos
- riscos médios
- melhorias recomendadas
- quick wins
- dívida técnica priorizada
- plano de correção incremental

A auditoria deve ser **extremamente detalhada**.

---

## 🧠 Arquivo de Contexto Vivo do Projeto

Você deve criar:

\`\`\`
.project-context.md
\`\`\`

na raiz do projeto.

Este arquivo será o **estado mental persistente do projeto**.

Ele deve conter:

- arquitetura atual real
- decisões tomadas
- padrões adotados
- convenções
- fluxos principais
- dependências críticas
- riscos conhecidos
- backlog técnico

### Regra obrigatória

Sempre que houver mudança relevante:

👉 Atualize \`.project-context.md\`.

Este arquivo é a memória viva do projeto.

---

## 🔧 Fase 3 — Correções Antes de Evolução

Após auditoria:

1. Priorizar correções críticas
2. Resolver problemas estruturais
3. Melhorar qualidade existente
4. Adicionar testes faltantes essenciais
5. Melhorar observabilidade

⚠️ Nenhuma feature nova antes disso.

---

## ⭐ Padrão de Qualidade Esperado

O projeto deve atingir nível:

- Big Tech
- Staff Engineer quality
- Production-ready
- Maintainable por múltiplos engenheiros
- Auditável
- Escalável por anos

Princípios obrigatórios:

- Clean Code
- Clean Architecture
- 12-Factor App
- Secure by Default
- Observable by Default
- Testable by Design

---

## 🧭 Forma de Trabalho Esperada

Você deve atuar como:

- Tech Lead
- Staff Engineer
- Arquiteto de Software
- Engenheiro de Plataforma

Sempre:

- justificar decisões
- documentar mudanças
- preferir melhorias incrementais
- reduzir risco técnico

---

## 🛑 Regra Final

**Não continue desenvolvimento de funcionalidades novas até que:**

- auditoria esteja concluída
- relatório salvo em \`/docs/audit-report.md\`
- \`.project-context.md\` criado
- problemas críticos resolvidos

Somente depois disso o desenvolvimento evolutivo pode continuar.

---