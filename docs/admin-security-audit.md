# Auditoria de Segurança — Admin SPA (Vue 3 + Amplify)

> Realizada em: 2026-04-29  
> Escopo: `admin/src/` — SPA Vue 3 + Vite + Pinia + AWS Amplify v6  
> Resultado: **1 Crítico · 4 Altos · 3 Médios · 2 Baixos · 2 Info**

---

## Resumo

| Severidade | # | Itens |
|---|---|---|
| **Crítico** | 1 | Falta expiração/renovação de token |
| **Alto** | 4 | Guard de rota; Token storage; HTML sem sanitização; Ownership de posts |
| **Médio** | 3 | Exposição de erros; Upload sem validação; Logout sem cleanup |
| **Baixo** | 2 | CSP ausente; DevTools em produção |
| **Info** | 2 | Variáveis VITE_* expostas (by design); AUTHOR_ID hardcoded |

---

## 1. CRÍTICO — Sem expiração/renovação de token

**Arquivo:** `admin/src/stores/auth.ts`  
`checkSession()` verifica apenas se existe sessão, mas não detecta expiração do JWT nem renova automaticamente. Quando o token expira, a próxima ação falha com erro genérico.

**Fix:**
- Decodificar o JWT para verificar o campo `exp` antes de cada request
- Implementar refresh automático (Amplify suporta `fetchAuthSession({ forceRefresh: true })`)
- Interceptar `401` em `apiCall()` e redirecionar para login com mensagem clara

---

## 2. ALTO — Guard de rota incompleto

**Arquivo:** `admin/src/router/index.ts` (linhas 60–71)  
O `beforeEach` chama `checkSession()` sem `await` adequado — a sessão pode não ter sido verificada antes de liberar a navegação. Rotas filhas de categorias não têm `meta.requiresAuth`.

**Fix:**
```typescript
router.beforeEach(async (to, _from, next) => {
  if (!auth.user) await auth.checkSession();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});
```

---

## 3. ALTO — HTML do Tiptap enviado sem sanitização

**Arquivos:** `admin/src/components/RichTextEditor.vue` · `admin/src/views/EditorView.vue`  
O `editor.getHTML()` é enviado diretamente para a API. Um administrador mal-intencionado (ou XSS no editor) pode injetar `<img onerror="...">` que executa no browser dos leitores.

> **Nota:** O backend (`backend/src/common/sanitizer.ts`) usa `sanitize-html` no `savePost()`. Este é o controle principal e está funcionando. O risco é de bypass via admin comprometido.

**Fix recomendado (defesa em profundidade):**
```bash
npm install dompurify @types/dompurify --save-dev
```
```typescript
// EditorView.vue — antes de enviar
import DOMPurify from 'dompurify';
const sanitized = DOMPurify.sanitize(form.value.conteudo_html, {
  ALLOWED_TAGS: ['p','br','strong','em','h2','h3','ul','ol','li','blockquote','pre','code','img','a'],
  ALLOWED_ATTR: ['src','alt','href','class'],
});
```

---

## 4. ALTO — Token JWT armazenado sem proteção explícita

**Arquivo:** `admin/src/services/api.ts`  
O Amplify v6 armazena tokens em `localStorage` por padrão — vulnerável a XSS. Não há `httpOnly` cookie.

**Fix:**
- Configurar Amplify para usar `sessionStorage` (fechamento de aba = logout automático)
- Adicionar CSP rigorosa para bloquear scripts de terceiros (ver item 7)
- Nunca logar o token em console

---

## 5. ~~ALTO — Rota de edição não valida ownership do post~~ — N/A (único admin)

> **Decisão de produto (2026-04-29):** o blog terá apenas um administrador. Não há risco de um admin acessar posts de outro. AUTHOR_ID hardcoded também é aceitável por este motivo.

## 5. ALTO — Rota de edição não valida ownership do post [IGNORADO POR DESIGN]

**Arquivos:** `admin/src/router/index.ts` · `admin/src/views/EditorView.vue`  
Qualquer admin autenticado pode acessar `/post/:slug` e editar posts de outros autores. A validação existe apenas no backend.

**Fix no frontend (defesa em profundidade):**
```typescript
// EditorView.vue — ao carregar post para edição
const post = await postsApi.get(slug);
if (post.autor_id && post.autor_id !== auth.user?.username) {
  router.push('/');
  showToast('Acesso negado', 'error');
  return;
}
```

---

## 6. MÉDIO — Mensagens de erro revelam infraestrutura

**Arquivos:** `admin/src/views/CategoriesView.vue` · `admin/src/views/AuthorEditView.vue`  
```typescript
alert('Erro ao salvar perfil: ' + error.message)
// Pode exibir: "DynamoDB access denied", "Table not found", etc.
```
Além disso, uso de `alert()` bloqueador.

**Fix:**
- Criar mapa de erros sanitizados para produção
- Usar o componente Toast que já existe em `EditorView.vue` (torná-lo global)
- Em produção, exibir apenas "Erro ao processar sua solicitação"

---

## 7. MÉDIO — Upload sem validação de tipo/tamanho no cliente

**Arquivo:** `admin/src/components/UploadModal.vue`  
O atributo `accept` HTML é ignorável. Nenhuma validação de `file.type` ou `file.size` em JS antes do upload para S3.

**Fix:**
```typescript
const VALID_TYPES = ['image/png','image/jpeg','image/webp','image/heic','image/heif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

if (!VALID_TYPES.includes(file.type)) { error.value = 'Tipo inválido'; return; }
if (file.size > MAX_SIZE) { error.value = 'Arquivo muito grande (máx 10 MB)'; return; }
```

---

## 8. MÉDIO — Logout sem limpeza de estado Pinia

**Arquivo:** `admin/src/layouts/AdminLayout.vue`  
`handleLogout()` chama `auth.logout()` mas não faz `auth.$reset()`. Estado residual do Pinia pode vazar entre sessões no mesmo browser.

**Fix:**
```typescript
async function handleLogout() {
  try { await auth.logout(); } finally { auth.$reset(); router.push('/login'); }
}
```

---

## 9. BAIXO — Content Security Policy ausente

**Arquivo:** `admin/index.html`  
Nenhum header ou meta tag de CSP. Facilita ataques XSS e clickjacking.

**Fix (meta tag no `index.html`):**
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://cognito-idp.us-east-1.amazonaws.com https://*.execute-api.us-east-1.amazonaws.com;
  frame-ancestors 'none';
">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```

---

## 10. BAIXO — Vue DevTools ativo em produção

**Arquivo:** `admin/vite.config.ts`  
`vitePluginVueDevTools()` sem guard de ambiente. Em produção, aumenta bundle e pode expor estado interno do Pinia.

**Fix:**
```typescript
plugins: [vue(), ...(process.env.NODE_ENV !== 'production' ? [vitePluginVueDevTools()] : [])],
```

---

## Prioridades de remediação

| Prazo | Item |
|---|---|
| **Imediato** | Refresh automático de token (item 1) |
| **Curto prazo** | DOMPurify no cliente (item 3) · Validação de upload (item 7) · Limpeza de estado no logout (item 8) |
| **Médio prazo** | Guard de rota com await (item 2) · CSP no index.html (item 9) · DevTools condicional (item 10) |
| **Longo prazo** | Ownership check de posts (item 5) · Mapa de erros sanitizados (item 6) |

---

## Contexto positivo

- ✅ Backend sanitiza HTML via `sanitize-html` em `savePost()` — principal barreira contra XSS
- ✅ Lambda URL com `authorization_type = "AWS_IAM"` — só CloudFront invoca a Lambda
- ✅ CORS restrito: `ADMIN_ORIGIN` via Terraform, não hardcoded
- ✅ npm audit zerado em frontend e backend (11 moderate residuais em aws-amplify@6 conhecidos)
- ✅ Autenticação via Cognito com pool dedicado — não há senha armazenada no banco
