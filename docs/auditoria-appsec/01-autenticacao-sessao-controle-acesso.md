# Auditoria AppSec — Categoria 1: Autenticação, Gestão de Sessão e Controle de Acesso

> Data: 2026-06-28
> Referência: OWASP ASVS V2 (Autenticação), V3 (Sessão), V4 (Controle de Acesso)
> Escopo: Cognito (`infra/modules/cognito/main.tf`), API Gateway authorizers (`infra/modules/api-gateway/main.tf`), Amplify no admin.
> Apenas análise — nenhum código foi alterado nesta etapa.

## 🔴 Achados de alto impacto

### 1. Conta de admin sem MFA e com `ALLOW_USER_PASSWORD_AUTH` habilitado — único ponto de autenticação de todo o sistema

`infra/modules/cognito/main.tf` não declara `mfa_configuration` (default = `OFF`), e o app client habilita `ALLOW_USER_PASSWORD_AUTH` junto com `ALLOW_USER_SRP_AUTH` — já era o item #19 do backlog (`CLAUDE.md`), confirmado ainda presente.

Isoladamente isso já seria risco médio. Mas há só **uma conta admin em todo o sistema**, com poder de escrita total sobre o conteúdo público (posts, autores, categorias, upload de mídia). Se essa única credencial for comprometida (senha fraca, reuso, phishing — sem MFA para conter nenhum desses cenários), o atacante herda automaticamente o achado #1 da Categoria 2 (stored XSS via `bio` do autor não sanitizado): o blast radius vai de "uma conta comprometida" para "JavaScript arbitrário executando no browser de todo visitante do blog público". É essa combinação que eleva o achado para alto impacto.

**Recomendação:** habilitar MFA (mesmo que `OPTIONAL` para não travar o único usuário sem aviso prévio) e migrar para `ALLOW_USER_SRP_AUTH` exclusivo, conforme já planejado no backlog.

## 🟡 Achados de impacto médio

### 2. ~~Password policy abaixo do recomendado para conta de privilégio total~~ — ✅ corrigido

`password_policy` exigia mínimo 8 caracteres, maiúscula, minúscula e número — mas **não exigia símbolo**. ASVS V2.1.1 recomenda mínimo 12 caracteres. **Corrigido:** `infra/modules/cognito/main.tf` agora exige mínimo 12 caracteres + símbolo. MFA (achado #1, 🔴) continua não habilitado — essa correção isolada não substitui o controle compensatório que faltava, só fecha a parte de força de senha.

### 3. Armazenamento do token de sessão no browser não confirmado/documentado

Não há nenhuma configuração explícita de `Storage` do Amplify Auth no código do admin (`admin/src/` não tem nenhuma referência a `localStorage`/`cookieStorage` customizada) — significa que está usando o comportamento **default** do `aws-amplify` v6, que é `localStorage`. Tokens em `localStorage` são acessíveis por qualquer JavaScript executando na página, incluindo um eventual XSS. Hoje a CSP do admin não usa `'unsafe-inline'` em `script-src` (mitigação real), o que reduz bastante a explorabilidade — mas vale documentar essa decisão explicitamente em vez de depender do default silencioso de uma lib externa.

### 4. Sem `advanced_security_mode` no Cognito

Cognito Plus (`advanced_security_mode = "ENFORCED"` ou `"AUDIT"`) adiciona detecção de credencial comprometida e autenticação baseada em risco. Tem custo adicional — avaliar se se justifica dado o porte do projeto (1 usuário), mas vale registrar como opção considerada e descartada por custo, não esquecida.

## 🟢 Pontos positivos (manter)

- **Controle de acesso por rota verificado linha a linha**: todas as 6 rotas de mutação (`admin_post_slug_any`, `admin_autor_id_any`, `admin_posts_any`, `media_upload_post`, `admin_categorias_any`, `admin_categorias_slug_any`) exigem `authorization = "COGNITO_USER_POOLS"` com `authorizer_id` correto. As 8 rotas públicas de leitura (`get_post`, `get_populares`, `get_author`, `get_recentes`, `get_artigos`, `get_categoria`, `get_busca`, `get_projeto`) corretamente **não** têm authorizer — são leitura pública por design, não uma omissão.
- `generate_secret = false` no app client — correto para SPA, que não tem como guardar segredo de cliente com segurança.
- `admin_create_user_config.allow_admin_create_user_only = true` — sem auto-cadastro público, reduz superfície de ataque de criação de conta.
- IAM least-privilege por Lambda (sessão 52) já elimina o risco de uma credencial de função comprometida ter acesso amplo a recursos não relacionados.

## Resumo

O controle de acesso a nível de rota (quem pode chamar o quê) está correto e foi verificado rota por rota. O gap real está um nível abaixo: a robustez da própria autenticação (MFA, força de senha, hardening de fluxo) não acompanha o fato de que essa é a **única** porta de entrada com poder de escrita no sistema inteiro — e essa fragilidade se conecta diretamente a um achado de stored XSS na Categoria 2, multiplicando o impacto de uma eventual conta comprometida.
