# Pendências — Ação de Marcelo

> Itens que dependem de decisão ou asset externo. Técnico já está pronto para receber cada um.

---

## 🔴 Bloqueiam SEO / Produto

### 1. Domínio definitivo
Quando o domínio estiver configurado, atualizar `NEXT_PUBLIC_SITE_URL` no Terraform (`infra/env/dev.tfvars` e `prd.tfvars`). O blog automaticamente:
- Para de emitir `noindex` / `Disallow: /`
- Passa a indexar normalmente no Google
- Corrige todas as URLs canônicas, OG e sitemap

### 2. Web App Manifest (`manifest.json`)
Favicon já aplicado ✅. Falta criar o manifest para PWA e SEO mobile.
Precisamos de:
- Nome curto do app (ex: `MG Blog`)
- Cor de tema (sugestão: `#111827`)
- Cor de fundo (sugestão: `#FFFFFF`)
- O arquivo `icon.png` já está em `frontend/app/` (1024px)

### 3. URLs sociais reais
Preencher no admin (perfil do autor) os campos:
- `linkedin_url`
- `github_url`
- `instagram_url` (se quiser)

Aparecem no Footer, na página /sobre e no AuthorBox dos artigos.

---

## 🟠 Afetam Conteúdo / UX

### 4. Foto de perfil (/sobre)
O campo `foto_avatar_url` no DynamoDB aponta para o bucket privado (`uploads-raw`), causando erro 403.

**Ação:** No admin → Perfil do autor → atualizar `foto_avatar_url` para:
```
https://dsns2wusdrj9z.cloudfront.net/media/1765152117835-mq4gxg-foto-perfil
```
(sem extensão — o sistema busca as variantes AVIF/WebP automaticamente)

### 5. Ferramenta de agendamento em /servicos
A página de serviços tem o CTA "Adote arquiteturas escaláveis..." mas sem link de agendamento.
Quando tiver Calendly (ou similar), basta substituir o botão ou adicionar o embed.

### 6. Newsletter
Página `/newsletter` existe como placeholder. Quando escolher o serviço (Brevo, Mailchimp, ConvertKit…), implementar o formulário lá e atualizar o `NewsletterCTA` com o link correto.

---

## 🟡 Quando AdSense for aprovado

### 7. Ativar AdSense
Em `frontend/components/ui/AdsenseSidebar.tsx`, linha 3:
```ts
const ADSENSE_CONFIGURED = false  // ← mudar para true
```
E descomentar a tag `<ins>` no mesmo arquivo com o Publisher ID real.

---

## 🟢 Baixa prioridade

### 8. Seed de novas categorias
Se quiser adicionar categorias além das 7 atuais, inserir via admin ou script DynamoDB.

### 9. Provisioned Concurrency em produção
Já configurado no Terraform (`provisioned_concurrency = 1` no `prd.tfvars`).
Entra em vigor automaticamente no deploy para produção — sem ação adicional.

---

*Última atualização: 2026-04-29*
