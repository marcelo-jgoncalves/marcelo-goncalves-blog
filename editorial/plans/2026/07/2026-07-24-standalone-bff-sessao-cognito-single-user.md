---
id: POST-PLAN-2026-024
title: "Implementei um Backend de Sessão Para um Painel Admin de Um Usuário Só"
created_at: 2026-07-24
updated_at: 2026-07-24
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

<!-- Migrado de projects/publishing-content/postagens/24-standalone-bff-sessao-cognito-single-user.md em 2026-08-04, work item docs/engineering/work-items/2026/08/2026-08-04-organize-historical-editorial-artifacts.md -->

# Post Standalone: "Implementei um Backend de Sessão Para um Painel Admin de Um Usuário Só"

## Títulos alternativos
- "O Token no localStorage, a Correção Rápida, e Por Que Ela Não Foi Suficiente"
- "Padrão de Mercado Não é Dogma: Por Que Vale (ou Não) um BFF Para Proteger um Admin Single-User"
- "De sessionStorage a Sessão Revogável: A Escalada Consciente de uma Correção de Segurança"

## Por que este post é diferente dos demais

Não nasce de uma auditoria formal isolada nem de uma pergunta única — nasce de uma sequência de decisões encadeadas na mesma sessão, cada uma reabrindo a anterior. Começou como 1 achado dentro de uma auditoria "world class" mais ampla (3 agentes em paralelo cobrindo frontend/a11y, arquitetura e segurança); virou uma correção rápida aplicada de imediato; virou uma pergunta direta de trade-off ("vale a pena ir além, sendo eu o único usuário?"); virou uma pergunta de validação de mercado ("isso é boa prática reconhecida, ou estou inventando complexidade?"); e terminou em uma escolha consciente de ir além do que a "correção mínima" exigia, com a justificativa explícita registrada. É um post sobre como uma decisão de segurança amadurece em camadas dentro de uma única conversa — não sobre um bug único com uma correção única. Post irmão de tema com o `18-standalone-auditoria-appsec-ia-staff-engineer.md` (mesma superfície — autenticação Cognito do admin), mas com achado e ângulo diferentes: lá é MFA ausente e XSS armazenado; aqui é onde o próprio token de sessão mora depois do login.

## Tese central

Uma auditoria encontrou que o token do Cognito no painel admin (Vue) vive em `localStorage` — comportamento padrão do Amplify v6 — vulnerável a exfiltração via XSS. A correção mínima (trocar para `sessionStorage`) foi aplicada em minutos e já reduz a janela de exposição. Mas a decisão real do post não é essa: é a escolha consciente de ir além da correção mínima e implementar um Backend For Frontend (BFF) com sessão opaca revogável — um padrão de mercado documentado (IETF, OWASP, Auth0, Duende), mesmo o projeto tendo um único usuário admin e um risco real hoje classificado como "importante", não "crítico". A tese: aplicar o padrão correto por ele ser o padrão correto — não porque o risco atual o exige — é uma escolha legítima quando o projeto também serve como vitrine técnica e o custo de implementação é conhecido e aceito de olhos abertos, não escondido atrás de "boas práticas" genéricas.

## Por que importa

1. **A maior parte do conteúdo sobre "onde guardar o token JWT no frontend" para no diagnóstico** ("não use localStorage, use httpOnly cookie") sem nunca mostrar o custo real de implementar isso — CORS cross-origin, SameSite, CSRF, um authorizer novo. Este post mostra o preço completo, não só a recomendação.
2. **A pergunta "vale a pena, sendo eu o único usuário?" é honesta e raramente aparece em conteúdo técnico** — a maioria dos posts sobre segurança assume que qualquer vulnerabilidade justifica qualquer correção, sem espaço para o leitor calibrar esforço contra risco real do próprio contexto.
3. **A escolha de ir além do "gold standard mínimo" (cookie com JWT direto) para o "gold standard completo" (sessão opaca revogável) é uma decisão de engenharia real, com trade-off explícito** (mais uma tabela, mais uma camada de indireção) — não uma citação de melhores práticas sem instanciação.
4. **Referências de mercado verificáveis** (draft do IETF, OWASP Cheat Sheet, o padrão nomeado BFF, produtos reais que o implementam) dão ao leitor uma trilha de verificação, não apenas a palavra do autor do post.

## Linha do tempo real

1. **Sintoma / achado inicial:** auditoria "world class" (3 agentes em paralelo) aponta que `admin/src/stores/auth.ts` usa `aws-amplify/auth` sem configuração explícita de storage — Amplify v6 usa `localStorage` por padrão para os tokens do Cognito (idToken/accessToken/refreshToken). Qualquer XSS no admin vira takeover de sessão persistente, refresh token incluso.
2. **Correção mínima aplicada de imediato:** trocado o storage para `sessionStorage`, usando o storage builtin do próprio Amplify (`cognitoUserPoolsTokenProvider.setKeyValueStorage(amplifySessionStorage)`, em `admin/src/main.ts`). Reduz a janela de exposição (token some ao fechar a aba), mas não elimina o risco — XSS durante uma sessão ativa ainda expõe o token.
3. **Pergunta de trade-off:** dado que o admin é usado por uma única pessoa (o próprio Marcelo), discutiu-se explicitamente se ir além da mitigação rápida (para um BFF completo com cookie httpOnly) valia o esforço de arquitetura. Decisão: sim — o projeto é também vitrine técnica/estudo, e demonstrar o padrão correto tem valor por si só, além de preparar terreno para uma eventual evolução multi-tenant.
4. **Proposta de arquitetura inicial:** em vez de cookie cross-origin (exigiria `SameSite=None` + proteção CSRF separada, porque o admin e a API hoje são origens diferentes — CloudFront do admin vs. `execute-api.amazonaws.com`), proposto usar o próprio CloudFront do admin como proxy same-origin para a API (`/admin/*` → API Gateway) — permite `SameSite=Strict` sem token CSRF adicional.
5. **Pergunta de validação de mercado:** "essa abordagem é boa prática, apoiada em padrão de mercado, ou estou complicando à toa?" Resposta ancorada em fontes reais: draft do IETF "OAuth 2.0 for Browser-Based Apps" (recomenda BFF para SPA, desaconselha localStorage/sessionStorage), OWASP Session Management Cheat Sheet (HttpOnly+Secure+SameSite como defesa primária), o padrão nomeado "BFF" (SoundCloud/Netflix, ThoughtWorks Tech Radar), e produtos reais que o implementam (Auth0 BFF, Duende.BFF).
6. **Refinamento da proposta:** identificado que a proposta original (cookie carregando o JWT do Cognito diretamente, ainda que httpOnly) é uma versão simplificada — o padrão mais rigoroso usado por Auth0/Duende guarda no cookie apenas um ID de sessão opaco, com os tokens reais mantidos server-side (ex.: tabela DynamoDB com TTL, no mesmo padrão já usado no projeto para contadores agregados). Vantagem: revogação instantânea de sessão, e o JWT nunca sai do servidor nem dentro de um cookie.
7. **Decisão final:** Marcelo escolhe a versão completa (sessão opaca + store server-side), mesmo sendo a opção de maior esforço, precisamente pelo valor de estudo/demonstração do projeto.
8. **Implementação (sessão de código seguinte, mesmo dia):** nova Lambda `adminSession` (POST login/GET me/DELETE logout, verifica idToken via JWKS com `aws-jwt-verify`, zero permissão IAM de Cognito), novo Lambda Authorizer `adminAuthorizer` (REQUEST, lê cookie, consulta a tabela `admin_sessions` no DynamoDB, `Allow`/`Deny`), tabela `admin_sessions` (TTL, sem PITR — sessão é efêmera por natureza), novo origin `/admin/*` no CloudFront do admin. Amplify reconfigurado para usar `sharedInMemoryStorage` (o token do Cognito nunca mais toca nenhum Web Storage, só existe em memória JS durante o handshake SRP, antes de virar sessão do BFF).
9. **Bug real nº1, achado na 1ª rodada de validação (Playwright):** `admin/src/services/api.ts` continuava prefixando as chamadas com a URL absoluta do API Gateway em vez do path relativo — isso bypassava o proxy same-origin do CloudFront, causando falha real de CORS em produção com `credentials:'include'` (a especificação proíbe `Access-Control-Allow-Origin: '*'` combinado com credenciais). Corrigido trocando para path relativo sempre.
10. **Bug real nº2, o mais caro em tempo de investigação — loop infinito de redirect em produção:** login parecia funcionar, mas a cada requisição autenticada voltava 401 e o app redirecionava de novo pro `/login`. 1ª hipótese (confirmada via documentação oficial da AWS consultada por MCP): `identity_source` do Lambda Authorizer exigia Cookie **e** Authorization juntos — o cliente só mandava Cookie, então o API Gateway devolvia 401 sem nunca invocar a Lambda. Corrigido para `identity_source = "method.request.header.Host"` — **não resolveu**. 2ª tentativa, ainda seguindo a documentação: `identity_source = ""` (o padrão correto para "sempre invocar", confirmado de novo via doc oficial) — **também não resolveu**, confirmado via curl direto mostrando zero invocações no CloudWatch. Só na 3ª volta a causa real apareceu: o trigger de redeploy do `aws_api_gateway_deployment` referenciava só o `.id` do authorizer no `jsonencode()` dos triggers — e o `id` de um recurso não muda numa atualização in-place de atributo (como `identity_source`), então **nenhum dos dois "fixes" anteriores tinha gerado um redeploy de verdade**; o stage continuava servindo a versão antiga do authorizer o tempo todo. Corrigido referenciando o objeto inteiro do authorizer no trigger (não só `.id`) — confirmado via `terraform plan` mostrando "must be replaced" pela primeira vez, e o `deploymentId` real mudando.
11. **Achado colateral, documentado e conscientemente adiado:** ao escrever o teste e2e de logout, descoberto que o CloudFront do admin mascara 403 legítimos vindos da API (do Lambda Authorizer negando) com o `index.html` do SPA (200 OK) — o `custom_error_response` da distribution é global, não por cache behavior, e foi configurado originalmente só para suportar rotas client-side do Vue Router. Sem impacto de segurança real (nenhum dado vaza, o corpo é só o shell do SPA), mas o status HTTP fica não confiável quando medido via CloudFront. Decisão explícita: anotar e resolver depois, sem bloquear a tarefa atual.
12. **Hardening pós-validação, pedido explicitamente depois do fluxo confirmado funcionando:** (a) remoção do fallback Bearer legado do authorizer (só cookie, sem meio-termo); (b) rate limit dedicado no login; (c) script e2e (`verify-admin-login.mjs`) para reverificar o fluxo inteiro em segundos, não em uma sequência manual de curl+CloudWatch+Playwright, na próxima vez que algo nessa área mudar.
13. **Bug real nº3, o mais instrutivo do ponto de vista de causa raiz — o rate limit dedicado, 2 tentativas erradas antes da certa:** `/admin/session` foi modelado com um único método `ANY` cobrindo POST/GET/DELETE. 1ª tentativa de rate limit: `method_path = "admin/session/ANY"` — rejeitado pela API real do API Gateway (`BadRequestException`, não pelo `terraform validate`, que não pega esse tipo de erro porque o schema aceita qualquer string ali). 2ª tentativa, lendo a mensagem de erro anterior e assumindo (errado) que o problema era usar "ANY" em vez de um curinga: `method_path = "admin/session/*"` — rejeitado de novo, com uma mensagem mais explícita: só existem duas formas válidas, `{recurso}/{verbo real}` ou `*/*` — não existe "recurso específico + todos os verbos". Causa raiz real: não dava pra corrigir só o valor da string, o modelo do recurso (`ANY` único) era incompatível com a meta (mirar só o login). Corrigido separando `/admin/session` em 3 métodos reais (`POST`/`GET`/`DELETE`, mesma Lambda nos 3), permitindo `method_path = "admin/session/POST"` de fato — validado com `terraform plan` mostrando exatamente os 8 recursos esperados (3 métodos + 3 integrações + o rate limit + a Lambda) antes do commit final.

## Storytelling sugerido

**Primeiro movimento — o achado que parecia pequeno.** Abrir com o achado real da auditoria: o token do Cognito do admin mora em `localStorage`, comportamento padrão do Amplify, não uma configuração explícita de ninguém. Mostrar o antes (`admin/src/stores/auth.ts`, sem nenhuma configuração de storage) e explicar por que isso importa: XSS num painel admin não é um erro de exibição, é um vazamento de sessão inteira.

**Segundo movimento — a correção de 5 minutos.** Mostrar a mudança real em `admin/src/main.ts`: trocar para `sessionStorage` usando o storage builtin do próprio Amplify. Uma linha de configuração, zero mudança de arquitetura. Deixar claro o que essa correção resolve (janela de exposição) e o que ela não resolve (o token ainda é legível por qualquer script rodando na página durante a sessão ativa).

**Terceiro movimento — a pergunta que a maioria não faz em voz alta.** "Sou o único usuário deste admin. Vale a pena ir além?" Não responder com um "sempre siga as boas práticas" vazio — mostrar o argumento real que decidiu a favor: o projeto tem valor como estudo e vitrine técnica, e demonstrar o padrão correto, aplicado de verdade e não só citado, é parte do propósito do projeto.

**Quarto movimento — validar contra o mercado, não contra a intuição.** Apresentar as fontes reais que confirmam que a rota escolhida (BFF, cookie httpOnly, proxy same-origin) não é invenção: o draft do IETF sobre OAuth para SPAs, o OWASP Cheat Sheet, o padrão nomeado BFF e seus produtos comerciais. O ponto central deste movimento: pedir a um assistente (ou a si mesmo) para justificar uma escolha de arquitetura com fontes verificáveis, antes de implementar, é parte do processo — não uma formalidade.

**Quinto movimento — o próprio "padrão recomendado" tem um "mais recomendado ainda".** Mostrar que a primeira proposta (cookie com o JWT direto) já seria uma melhoria real, mas não é o topo da régua — o padrão usado por produtos como Auth0 BFF/Duende.BFF vai um passo além: cookie carrega só um ID opaco, sessão real fica num store server-side, revogável a qualquer momento. Este é o "gancho gold standard" do post: a diferença entre "seguro" e "seguro com margem para revogação instantânea".

**Sexto movimento — o preço real não foi arquitetura, foi depuração.** Aqui a narrativa muda de tom: implementar o desenho (Lambda de sessão, authorizer, tabela, proxy) foi a parte previsível. O custo real e imprevisto apareceu depois: um loop infinito de redirect em produção que sobreviveu a 2 correções "corretas" segundo a própria documentação da AWS (`identity_source`), porque a causa verdadeira não estava na configuração testada, e sim num trigger de Terraform que nunca redeployava mudanças in-place — as duas primeiras correções foram aplicadas, validadas contra a doc oficial, e simplesmente nunca chegaram a rodar. Mostrar como isso só foi descoberto comparando `terraform plan` antes/depois (a ausência de "must be replaced" era o sintoma real, não o comportamento do authorizer em si).

**Sétimo movimento — o mesmo padrão de erro se repete no hardening, em miniatura.** Ao adicionar rate limit dedicado no endpoint de login, a mesma dinâmica se repete em escala menor: 1ª tentativa (`method_path = "ANY"`) falha; 2ª tentativa, corrigindo pela leitura do erro anterior mas ainda sem entender a causa real (`method_path = "*"`), falha de novo; só a 3ª, depois de entender que o modelo do recurso (um único método `ANY`) era incompatível com a meta, resolve de verdade — dividir o recurso em métodos reais. Dois "bugs de infraestrutura" na mesma sessão, resolvidos com a mesma disciplina: parar de tentar valores diferentes e ler a causa raiz real antes da 3ª tentativa.

**Fechamento — a decisão registrada, não escondida.** Fechar nomeando explicitamente o trade-off aceito: mais uma Lambda, mais uma tabela, mais um authorizer — esforço real, para um risco hoje classificado como "importante" (não "crítico"), num sistema de um usuário só. Mas fechar também com a lição que só apareceu depois de implementar: o "custo nomeado" de adotar um padrão de mercado raramente é o design em si — é a superfície nova de infraestrutura que ele introduz, e as suas próprias formas particulares de falhar silenciosamente. A lição generalizável: seguir o padrão de mercado por ele ser correto, e não apenas quando o risco imediato "obriga", é uma escolha de engenharia válida — desde que o custo (incluindo o de depuração, não só o de desenho) seja nomeado e aceito conscientemente, não empurrado por medo genérico de vulnerabilidade.

## Provas e exemplos reais

- **`admin/src/stores/auth.ts`** — store de autenticação via `aws-amplify/auth` (`signIn`, `fetchAuthSession`, `getToken`), sem nenhuma configuração de storage explícita antes da correção — o "antes" real do post.
- **`admin/src/main.ts`** — a correção mínima aplicada: `cognitoUserPoolsTokenProvider.setKeyValueStorage(amplifySessionStorage)`, usando o storage `sessionStorage` builtin já exportado por `aws-amplify/utils` (não foi necessário escrever um adapter customizado).
- **Achado original, classificado "importante" (não "crítico") na auditoria**: porque o admin é single-user — a própria auditoria já registrou essa calibração de severidade contra o contexto real do projeto, antes da decisão de ir além.
- **Post irmão `18-standalone-auditoria-appsec-ia-staff-engineer.md`**: mesma superfície (autenticação Cognito do admin), achado diferente (MFA ausente + XSS armazenado no campo `bio`) — mesma disciplina de calibrar correção contra risco real, aplicada a um achado distinto.
- **Arquitetura implementada e validada em produção (dev)**: `backend/src/functions/adminSession/index.ts` (Lambda de sessão), `backend/src/functions/adminAuthorizer/index.ts` (Lambda Authorizer REQUEST), `backend/src/common/adminSessionStore.ts` (create/get/delete na tabela `admin_sessions`), `backend/src/common/cognitoJwt.ts` (`verifyIdToken` via JWKS, `aws-jwt-verify`), origin `API-Gateway-Admin` + `ordered_cache_behavior` para `/admin/*` em `infra/modules/admin/cloudfront.tf`.
- **Os 2 bugs reais de infraestrutura, ambos únicos por não aparecerem no `terraform validate`/`plan` de rotina**: (1) trigger de deployment do API Gateway (`infra/modules/api-gateway/main.tf`, recurso `aws_api_gateway_deployment.main`) referenciando `.id` em vez do objeto inteiro do authorizer; (2) `method_path` de `aws_api_gateway_method_settings` não aceitar verbo curinga (`ANY`/`*`) combinado a um recurso específico — só `{recurso}/{verbo real}` ou `*/*`, forçando a separação de `/admin/session` em 3 métodos reais.
- **Script de verificação e2e criado como produto colateral da depuração**: `frontend/scripts/verify-admin-login.mjs` — 12 checks reais (cookie httpOnly/SameSite=Strict, zero 401 pós-login, dado real no dashboard, revogação de sessão confirmada tanto direto na API Gateway quanto via CloudFront). Não existiria sem o custo de ter validado o mesmo fluxo manualmente várias vezes ao longo da sessão.

## Trechos de código reais para ilustrar o post

**1. O "antes" — auth store sem configuração de storage explícita:**

```typescript
// admin/src/stores/auth.ts (antes da correção)
import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'

// Obter Token JWT para API
async function getToken() {
  try {
    const session = await fetchAuthSession()
    return session.tokens?.idToken?.toString()
  } catch {
    return null
  }
}
```

**2. A correção mínima aplicada — troca de storage, sem redesenho de arquitetura:**

```typescript
// admin/src/main.ts (depois da correção mínima)
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import { sessionStorage as amplifySessionStorage } from 'aws-amplify/utils'

// Tokens do Cognito em sessionStorage em vez do padrão do Amplify (localStorage).
// Não elimina o risco de exfiltração via XSS (só httpOnly cookie setado por um
// backend faria isso, exigindo redesenho de sessão fora do escopo desta correção),
// mas reduz a janela de exposição: o token some ao fechar a aba/navegador em vez
// de persistir indefinidamente entre sessões.
cognitoUserPoolsTokenProvider.setKeyValueStorage(amplifySessionStorage)
```

**3. A arquitetura final — o Lambda Authorizer, na versão final (sem fallback Bearer, só cookie):**

```typescript
// backend/src/functions/adminAuthorizer/index.ts
export const handler: APIGatewayRequestAuthorizerHandler = async (event) => {
  const headers = event.headers || {};
  const cookies = parseCookies(headers.Cookie || headers.cookie);
  const sessionId = cookies[SESSION_COOKIE_NAME];

  if (sessionId) {
    const session = await getSession(sessionId);
    if (session) {
      return policy(session.sub, "Allow", event.methodArn);
    }
    logger.warn("admin_authorizer_invalid_session", {});
    return policy("anonymous", "Deny", event.methodArn);
  }

  return policy("anonymous", "Deny", event.methodArn);
};
```

**4. O bug real nº2 (o mais caro) — a causa não estava na config do authorizer, estava no trigger de deploy:**

```hcl
# infra/modules/api-gateway/main.tf — ANTES (2 "correções" de identity_source
# aplicadas aqui nunca tiveram efeito, porque nada disparava redeploy):
triggers = {
  redeployment = sha1(jsonencode([
    aws_api_gateway_authorizer.admin_cookie_auth.id,  # .id não muda num update in-place
    # ...
  ]))
}

# DEPOIS — objeto inteiro, não só o id:
triggers = {
  redeployment = sha1(jsonencode([
    aws_api_gateway_authorizer.admin_cookie_auth,  # objeto inteiro: qualquer atributo muda o hash
    # ...
  ]))
}
```

**5. O bug real nº3 — o erro literal da API que revelou a causa raiz (não é algo que `terraform validate` pega):**

```
BadRequestException: 'admin/session/*' is not a valid method path. Method paths
can be defined as {resource_path}/{http_method} for an individual method
override, or */* for overriding all methods in the stage.
```

```hcl
# infra/modules/api-gateway/main.tf — recurso dividido em 3 métodos reais,
# só assim dá pra mirar o rate limit dedicado exclusivamente no login:
resource "aws_api_gateway_method" "admin_session_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.admin_session.id
  http_method   = "POST"
  authorization = "NONE"
}
# ... mesmo padrão para admin_session_get (GET) e admin_session_delete (DELETE)

resource "aws_api_gateway_method_settings" "throttle_admin_session" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  stage_name  = aws_api_gateway_stage.main.stage_name
  method_path = "admin/session/POST"

  settings {
    throttling_rate_limit  = 5
    throttling_burst_limit = 10
  }
}
```

## Conceitos a explicar

- **BFF (Backend For Frontend)**: padrão de arquitetura em que um componente de backend confidencial fica entre o browser e os serviços reais (aqui, o Cognito), segurando tokens/segredos que nunca devem chegar ao JavaScript do cliente.
- **httpOnly cookie**: cookie que não pode ser lido via `document.cookie` no JavaScript do browser — mitiga (não elimina sozinho) o roubo de sessão via XSS, porque o script malicioso não consegue ler o valor do cookie mesmo se conseguir executar no contexto da página.
- **SameSite (Strict/Lax/None)**: atributo de cookie que controla se ele é enviado em requisições de origens diferentes; `SameSite=Strict/Lax` já neutraliza a maior parte do CSRF sem precisar de um token anti-CSRF separado, desde que app e API sejam a mesma origem.
- **Sessão opaca vs. token direto no cookie**: guardar no cookie um identificador aleatório sem significado próprio (opaco), em vez do JWT real — os tokens de verdade ficam num store server-side (ex.: DynamoDB com TTL), permitindo revogar uma sessão instantaneamente sem esperar o JWT expirar.
- **Proxy same-origin via CDN**: técnica de configurar o CloudFront (ou qualquer CDN) para rotear um path (`/api/*`) para um backend diferente do origin principal, fazendo o browser enxergar app e API como a mesma origem — elimina CORS e simplifica a política de cookie.

## Estrutura sugerida (H2s)

1. **O achado: onde o token do admin mora**
   - `localStorage`, comportamento padrão do Amplify, achado pela auditoria "world class"
2. **A correção de 5 minutos**
   - `sessionStorage` via `cognitoUserPoolsTokenProvider.setKeyValueStorage` — o que resolve e o que não resolve
3. **A pergunta que a maioria não faz: vale a pena, sendo eu o único usuário?**
   - O argumento real a favor de ir além (vitrine técnica, valor de estudo, potencial multi-tenant futuro)
4. **Validando contra o mercado, não contra a intuição**
   - IETF, OWASP, o padrão BFF nomeado, Auth0/Duende — por que essa não é uma complicação inventada
5. **O "gold standard" tem um "mais gold standard ainda"**
   - Cookie com JWT direto vs. sessão opaca revogável — a diferença real entre as duas versões
6. **A decisão registrada com o custo nomeado**
   - Nova Lambda, novo authorizer, nova tabela — o preço aceito conscientemente, não escondido atrás da palavra "segurança"
7. **O preço real não foi o design, foi a depuração**
   - O loop de redirect que sobreviveu a 2 correções "corretas" segundo a doc oficial da AWS — a causa estava no trigger de Terraform, não na configuração testada
8. **O mesmo erro, em miniatura, no hardening**
   - Rate limit dedicado: 2 tentativas de valor errado antes de entender que o modelo do recurso (`ANY` único) precisava mudar, não a string

## Fecho / CTA

"A pergunta que valia a pena fazer não era 'isso é uma boa prática?' — quase tudo pode ser justificado como boa prática em abstrato. A pergunta era: essa boa prática específica está documentada por fontes que eu consigo verificar, e o esforço de implementá-la é um custo que estou disposto a nomear e pagar, mesmo sendo o único usuário do sistema que ela protege? A resposta foi sim, nas duas perguntas — e é essa dupla verificação, não o reflexo de 'sempre siga o padrão', que separa engenharia de dogma."

## Fonte interna

- Sessão de origem: 2026-07-24, projeto `marcelo-goncalves-blog`, durante uma auditoria "world class" mais ampla (3 agentes em paralelo: frontend/a11y, código/arquitetura, segurança/admin).
- Achado original: token do Cognito em `localStorage`, `admin/src/stores/auth.ts` (sem configuração de storage explícita).
- Correção mínima aplicada e commitada nesta sessão: `admin/src/main.ts` (`cognitoUserPoolsTokenProvider.setKeyValueStorage`).
- Decisão de ir além, arquitetura de BFF proposta (proxy same-origin via CloudFront do admin) e refinamento para sessão opaca revogável: discutidos e **implementados e validados na mesma sessão** (mesmo dia, 2026-07-24) — Lambda `adminSession`, Lambda Authorizer `adminAuthorizer`, tabela `admin_sessions`, proxy `/admin/*` no CloudFront do admin.
- Validação funcional real, não só pipeline verde: `frontend/scripts/verify-admin-login.mjs` (12 checks Playwright + curl/CloudWatch), rodado após cada correção de infra até todos passarem.
- 3 bugs reais encontrados e corrigidos durante a implementação/hardening: URL absoluta quebrando CORS (`admin/src/services/api.ts`); trigger de deployment do API Gateway referenciando só `.id` do authorizer (causa do loop de redirect, sobreviveu a 2 tentativas de fix na config errada); `method_path` não aceitando verbo curinga com recurso específico (forçou dividir `/admin/session` em 3 métodos reais).
- 1 achado documentado e conscientemente adiado (não bloqueou a tarefa): CloudFront do admin mascara 403 reais da API com o `index.html` do SPA — sem impacto de segurança, ver `memory/project_cloudfront_error_response_masks_api_403.md`.
- Post irmão temático: `18-standalone-auditoria-appsec-ia-staff-engineer.md` (mesma superfície — Cognito do admin — achados diferentes: MFA ausente e XSS armazenado).

## Notas de escrita

- **Este planejamento foi atualizado depois da implementação completa e validada em produção (dev).** A arquitetura, os 3 bugs reais e a validação e2e já existem como código e evidência real (não mais plano) — o post pode ser escrito de ponta a ponta, incluindo os movimentos 6-7 (a depuração), que se tornaram o material mais forte do post, mais até que a decisão de arquitetura em si.
- **Não esconder a escalada de escopo da própria sessão**: o post ganha força justamente por mostrar que a solução cresceu em 3 etapas dentro da mesma conversa (mitigação rápida → BFF simples → sessão opaca revogável), não porque a primeira resposta estava errada, mas porque cada pergunta seguinte (trade-off, depois validação de mercado) revelou uma camada a mais que valia a pena considerar.
- **Não esconder também que 2 "correções" reais falharam antes da 3ª acertar, duas vezes na mesma sessão** (identity_source do authorizer, depois method_path do rate limit) — é tentador editar a história para parecer linear ("troquei X e resolvi"), mas o valor didático do post está exatamente em mostrar que seguir a documentação oficial à risca não bastou nos dois casos, porque o erro estava uma camada abaixo do que a doc cobria (o trigger do Terraform, o modelo do recurso). Ver [[feedback_incremental_investigation_protocol]] como referência de disciplina aplicada aqui.
- **Evitar tom de alarme** ("XSS é catastrófico!") — o achado foi calibrado pela própria auditoria como "importante", não "crítico", justamente porque o admin é single-user. A decisão de ir além é apresentada como escolha deliberada, não como correção de uma falha grave que estava sendo ignorada.
- Mesmo espírito de honestidade dos posts `20`-`23`: decisão de arquitetura real, com o raciocínio completo preservado, incluindo a parte em que a primeira proposta (cookie com JWT direto) foi identificada como incompleta antes mesmo de ser implementada, e as tentativas de correção erradas antes da causa raiz real.
