# Auditoria AppSec — Categoria 6: Arquitetura/Threat Model, Logging, Proteção de Dados e Observabilidade de Segurança

> Data: 2026-06-28
> Referência: OWASP ASVS V1 (Arquitetura), V7 (Logging/Erros), V8 (Proteção de Dados); AWS Well-Architected — Security Pillar (Detecção)
> Escopo: AWS account (CloudTrail/GuardDuty, verificado via AWS CLI), tratamento de erro em todos os Lambdas, modelo de dados (`backend/src/common/types.ts`).
> Apenas análise — nenhum código foi alterado nesta etapa.

## 🔴 Achados de alto impacto

### 1. Nenhum CloudTrail e nenhum GuardDuty configurados na conta AWS

Confirmado via AWS CLI direto contra a conta (profile `claude-dev`, região `us-east-1`):
```
aws guardduty list-detectors   → { "DetectorIds": [] }
aws cloudtrail describe-trails → []
```
Não existe nenhum trail de CloudTrail (logging de toda chamada de API feita na conta — quem fez o quê, quando, de onde) e nenhum detector do GuardDuty (detecção automatizada de comportamento anômalo/comprometimento) ativo. Isso é mencionado no plano original como possível lacuna; está confirmado.

**Por que é alto impacto apesar do porte pequeno do projeto:** isso não é sobre prevenir um ataque — é sobre a capacidade de **saber que algo aconteceu**. Se a credencial AWS usada pelo pipeline (mesmo via OIDC, sem chave de longa duração) ou a sessão do Cognito admin forem comprometidas, hoje não existe nenhum log de API-level nem alerta automatizado que permitiria detectar isso, delimitar o que foi acessado/alterado, ou responder ao incidente. É a contraparte de visibilidade que falta a todo o resto da auditoria — mesmo que cada controle individual (IAM, CSP, sanitização) esteja correto, sem CloudTrail não há como confirmar isso retroativamente nem investigar quando algo sair errado.

**Recomendação:** habilitar 1 trail multi-região do CloudTrail (custo baixo, primeiro trail é gratuito) e 1 detector do GuardDuty (tem free trial de 30 dias, custo posterior é proporcional ao volume — avaliar para o porte da conta). Ambos resolvem boa parte do CIS AWS Foundations Benchmark de uma vez.

## 🟡 Achados de impacto médio

### 2. ~~Mensagens de erro internas vazadas ao cliente em 3 de 8 Lambdas~~ — ✅ corrigido

Levantamento de todos os blocos `catch` dos 8 Lambdas (estado antes da correção):

| Lambda | Resposta de erro ao cliente |
|---|---|
| `getPost`, `getPosts`, `getAuthor` | ✅ mensagem genérica (`"Internal Server Error"` / `"Erro interno do servidor"`) |
| `adminAuthors` | ✅ mensagem genérica (`"Internal Server Error"`) |
| `adminPosts` | ❌ `message: message \|\| "Internal Server Error"` — `message` é a string real da exceção (ex: erro do AWS SDK, do DynamoDB), só cai no fallback genérico se vazia |
| `adminCategorias` | ❌ mesmo padrão de `adminPosts` |
| `mediaUpload` | ❌ `JSON.stringify({ message })` — sempre a mensagem real da exceção, sem fallback algum |

Inconsistência real: a maioria dos Lambdas seguia a prática correta (ASVS V7.4 — não expor detalhes internos em respostas de erro), mas 3 não seguiam. **Correção aplicada:** os 3 Lambdas divergentes (`adminPosts`, `adminCategorias`, `mediaUpload`) agora retornam `"Internal Server Error"` genérico, igual aos outros 5 — o log interno (`logger.error`) continua recebendo a mensagem real da exceção, só a resposta HTTP ao cliente mudou.

## 🟢 Pontos positivos (manter)

- **Logger estruturado obrigatório** (`backend/src/common/logger.ts`) — confirmado que todos os 8 Lambdas usam `logger.error`/`logger.debug`/`logger.info`, nenhum `console.log` direto encontrado nesta auditoria. Logs incluem `requestId` para correlação.
- **Modelo de dados sem PII real de usuário final**: `backend/src/common/types.ts` não tem CPF, e-mail de leitor, telefone ou endereço — o projeto é editorial (posts, autores, categorias), não uma plataforma com cadastro de usuários. A superfície de "proteção de dados" (V8) é estruturalmente pequena, reduzindo o risco de boa parte das preocupações clássicas dessa categoria (vazamento de dados pessoais de terceiros).
- Alarmes de SLO de erro/latência já existem (`docs/observability-slo.md`, sessão 50) — cobertura de observabilidade de **disponibilidade** já é boa; o gap identificado aqui é especificamente de observabilidade de **segurança** (CloudTrail/GuardDuty), uma camada diferente.

## Resumo

O achado de CloudTrail/GuardDuty ausentes é o que mais distancia o projeto de um padrão "world-class" nesta categoria — não por ser uma vulnerabilidade explorável diretamente, mas por ser a ausência da capacidade de detectar e investigar qualquer um dos outros achados desta auditoria caso venham a ser explorados. O vazamento de mensagem de erro é um achado menor e pontual, fácil de corrigir (padronizar os 3 Lambdas divergentes para o mesmo padrão que os outros 5 já seguem).
