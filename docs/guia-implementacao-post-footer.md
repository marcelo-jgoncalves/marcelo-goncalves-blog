# Guia de Implementação: PostFooter Component

**Data:** 2026-05-22  
**Objetivo:** Reproduzir o design do protótipo (`post-page-prototype.html`) no projeto Next.js com pixel-perfect accuracy

---

## FASE 1: PREPARAÇÃO

### 1.1 Verificar dependências
- ✅ Font Awesome 6.5.2+ (já instalado)
- ✅ CSS Modules ou arquivo `.css` separado
- ✅ Tokens CSS globais (`:root` em `globals.css`)

### 1.2 Tokens CSS a mapear
```
Protótipo → Projeto

--accent:        #0F4C5C    → verificar token existente
--accent-deep:   #073642    → verificar token existente  
--accent-mid:    #5B8B96    → verificar token existente
--accent-soft:   #E6EEF0    → verificar token existente
--moss:          #3F6B47    → verificar token existente
--t-muted:       #6F6760    → verificar token existente
--t-meta:        #4D453E    → verificar token existente
--ink:           #0A0E1A    → verificar token existente
--rule:          rgba(10, 14, 26, .10)  → verificar
--space-epic:    112px      → verificar token existente
```

---

## FASE 2: ESTRUTURA JSX (sem mudanças)

### 2.1 Componente esperado em `PostFooter.tsx`
```jsx
export interface PostFooterProps {
  author: {
    name: string;
    bio: string;
    avatarInitials: string;  // "MG"
    profileUrl: string;       // "/sobre"
  };
  shareUrls: {
    linkedin: string;
    twitter: string;
    whatsapp: string;
    currentPageUrl: string;
  };
}

export default function PostFooter({ author, shareUrls }: PostFooterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrls.currentPageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <div className={styles.postFooter}>
      {/* SHARE STRIP */}
      <div className={styles.share}>
        <span className={styles.label}>Compartilhar</span>
        <div className={styles.btns}>
          <a 
            href={shareUrls.linkedin} 
            className={styles.sbtn}
            aria-label="Compartilhar no LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i>LinkedIn
          </a>
          <a 
            href={shareUrls.twitter} 
            className={styles.sbtn}
            aria-label="Compartilhar no Twitter"
          >
            <i className="fab fa-x-twitter"></i>Twitter
          </a>
          <a 
            href={shareUrls.whatsapp} 
            className={styles.sbtn}
            aria-label="Compartilhar no WhatsApp"
          >
            <i className="fab fa-whatsapp"></i>WhatsApp
          </a>
          <button 
            className={`${styles.sbtn} ${styles.sbtnCopy}`}
            onClick={handleCopyLink}
            aria-label="Copiar link do artigo"
          >
            <i className="fas fa-link"></i>
            {copied ? 'Copiado' : 'Copiar link'}
          </button>
        </div>
      </div>

      {/* AUTHOR SECTION */}
      <section className={styles.author}>
        <div className={styles.avatar} aria-hidden="true">
          {author.avatarInitials}
        </div>
        <div className={styles.info}>
          <p>
            <strong className={styles.authorName}>{author.name}</strong>
            {' '}
            {author.bio}{' '}
            <a href={author.profileUrl} className={styles.profileLink}>
              Veja o perfil
            </a>.
          </p>
        </div>
        <div className={styles.actions}>
          <span className={styles.netLabel}>Acompanhe nas redes</span>
          <div className={styles.nets}>
            <a 
              href={shareUrls.linkedin} 
              className={styles.net}
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a 
              href="#" 
              className={styles.net}
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a 
              href={shareUrls.twitter} 
              className={styles.net}
              aria-label="X (Twitter)"
            >
              <i className="fab fa-x-twitter"></i>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## FASE 3: CSS (IMPLEMENTAÇÃO PASSO-A-PASSO)

### 3.1 Criar arquivo `PostFooter.module.css`
Localização: `frontend/components/post/PostFooter.module.css`

### 3.2 BLOCO 1: Reset & container principal

```css
/* PostFooter.module.css */

.postFooter {
  background: #fff;
  border: 1px solid var(--rule);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 1px 0 rgba(10, 14, 26, .02), 
    0 10px 32px rgba(15, 76, 92, .06);
  position: relative;
  margin-top: var(--space-epic);  /* 112px */
}

.postFooter::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--accent);
}
```

**Validação:** Container tem borda cinza hairline, border-radius 16px, sombra dupla, e barra accent à esquerda.

### 3.3 BLOCO 2: Share strip

```css
.share {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 24px 16px 28px;
  border-bottom: 1px dashed var(--rule);
  flex-wrap: wrap;
  margin: 0;
}

.label {
  font-family: var(--mono);
  font-size: 0.6875rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--t-muted);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  line-height: 1;
}

.label::after {
  content: "";
  width: 24px;
  height: 1px;
  background: var(--rule);
  display: inline-block;
}
```

**Validação:** Label em mono, 11px, uppercase, tracking .22em. Linha de 24px após label.

### 3.4 BLOCO 3: Botões de share

```css
.btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.sbtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  font-family: var(--sans);
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(10, 14, 26, .70);
  text-decoration: none;
  transition: 
    background-color 0.15s ease, 
    color 0.15s ease;
}

.sbtn i {
  font-size: 0.875rem;
}

.sbtn:hover {
  background: var(--accent-soft);
  color: var(--accent);
}

.sbtnCopy {
  border: 1px solid var(--rule);
}

.sbtnCopy:hover {
  border-color: var(--accent);
}
```

**Validação:** Botões 34px height, transparent bg, hover com soft accent. Copy button tem border.

### 3.5 BLOCO 4: Author section

```css
.author {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 28px;
  align-items: center;
  padding: 28px 32px 28px 36px;
  margin: 0;
  background: linear-gradient(
    180deg, 
    rgba(15, 76, 92, .025) 0%, 
    rgba(15, 76, 92, .05) 100%
  );
  border-left: 4px solid var(--accent);
  box-shadow: 
    0 2px 16px rgba(15, 76, 92, 0.07), 
    0 1px 4px rgba(15, 76, 92, 0.04);
}
```

**Validação:** Grid 3 colunas, gap 28px, padding 28/32/28/36, gradient subtle petróleo, border-left 4px accent.

### 3.6 BLOCO 5: Avatar

```css
.avatar {
  width: 76px;
  height: 76px;
  flex: none;
  background: 
    radial-gradient(
      circle at 30% 25%, 
      rgba(255, 255, 255, .18) 0%, 
      transparent 55%
    ),
    linear-gradient(
      140deg, 
      var(--accent-deep) 0%, 
      var(--accent) 55%, 
      var(--accent-mid) 100%
    );
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #FAF8F3;
  font-family: var(--sans);
  font-weight: 800;
  font-size: 1.375rem;
  letter-spacing: 0.01em;
  box-shadow: 
    0 0 0 4px #fff, 
    0 0 0 5px rgba(15, 76, 92, .18), 
    0 10px 28px rgba(15, 76, 92, .22);
  position: relative;
}

.avatar::after {
  content: "";
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--moss);
  border: 3px solid #fff;
}
```

**Validação:** Avatar 76×76 circular, gradiente radial + linear, box-shadow (3 camadas), ::after dot verde.

### 3.7 BLOCO 6: Bio / Info

```css
.info p {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: rgba(10, 14, 26, .70);
  max-width: 520px;
  margin: 0;
}

.authorName {
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.005em;
}

.profileLink {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid rgba(15, 76, 92, .30);
  white-space: nowrap;
  transition: 
    border-color 0.2s ease, 
    color 0.2s ease;
}

.profileLink:hover {
  color: var(--accent-deep);
  border-bottom-color: var(--accent-deep);
}
```

**Validação:** Bio 15px, line-height 1.65. Name bold. Link com underline customizado.

### 3.8 BLOCO 7: Social actions

```css
.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding-left: 28px;
  align-self: stretch;
}

.netLabel {
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(10, 14, 26, .70);
}

.nets {
  display: flex;
  gap: 6px;
}

.net {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff;
  border: 1px solid rgba(10, 14, 26, .10);
  color: var(--accent);
  font-size: 0.9375rem;
  text-decoration: none;
  transition: 
    border-color 0.2s ease, 
    color 0.2s ease, 
    background-color 0.2s ease, 
    transform 0.2s ease, 
    box-shadow 0.2s ease;
}

.net:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: #FAF8F3;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(15, 76, 92, .22);
}
```

**Validação:** Social column, label mono 11px. Ícones 38×38 circular, hover com fill accent.

---

## FASE 4: VALIDAÇÃO VISUAL

### 4.1 Checklist visual no navegador
```
Share strip:
☐ Fundo branco
☐ Label "COMPARTILHAR" em mono, small, uppercase
☐ Linha de 24px após label
☐ Botões de share 34px height
☐ Botões com hover soft accent (fundo claro)
☐ Botão Copy com borda (sem fundo)
☐ Separador tracejado na base

Author section:
☐ Grid com avatar | bio | social
☐ Gradient sutil de fundo (2.5% → 5%)
☐ Border-left 4px accent
☐ Avatar 76×76 circular com gradiente
☐ Ponto verde no canto inferior direito
☐ Bio text 15px, line-height 1.65
☐ Author name bold
☐ Profile link com underline customizado
☐ Social icons 38×38 circular, branco
☐ Hover social: fill accent, sobe, sombra
```

### 4.2 Checklist de cores
```
☐ Background principal: #fff (branco puro)
☐ Border: rgba(10,14,26,0.10) (hairline cinza)
☐ Accent bar: #0F4C5C (petróleo)
☐ Label text: #6F6760 (cinza quente)
☐ Author name: #0A0E1A (preto profundo)
☐ Profile link: #0F4C5C (petróleo)
☐ Hover link: #073642 (petróleo escuro)
☐ Social icon: #0F4C5C (petróleo)
☐ Hover social bg: #0F4C5C (petróleo)
☐ Online dot: #3F6B47 (verde moss)
☐ Gradient bg: rgba(15,76,92,.025) → .05
```

### 4.3 Checklist de espaçamento
```
☐ Container margin-top: 112px
☐ Share padding: 16/24/16/28
☐ Share gap: 18px
☐ Author padding: 28/32/28/36
☐ Author gap: 28px
☐ Actions gap: 12px
☐ Social nets gap: 6px
☐ Button icon gap: 8px
```

### 4.4 Checklist de responsividade
```
☐ Mobile: Author grid muda para 1 coluna
☐ Mobile: Actions muda para row (bottom)
☐ Mobile: Border-left cai, border-top sobe
☐ Mobile: Padding ajustado para mobile
```

---

## FASE 5: INTEGRAÇÃO NO PROJETO

### 5.1 Arquivo para criar/modificar
- **Caminho:** `frontend/components/post/PostFooter.tsx`
- **Estilos:** `frontend/components/post/PostFooter.module.css`
- **Utilização:** Importar em `frontend/app/post/[slug]/page.tsx`

### 5.2 Props de exemplo (para teste)
```jsx
const postFooterProps = {
  author: {
    name: "Marcelo Gonçalves",
    bio: "é Engenheiro Cloud especialista em AWS e DevOps.",
    avatarInitials: "MG",
    profileUrl: "/sobre"
  },
  shareUrls: {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
    twitter: `https://x.com/intent/tweet?url=${window.location.href}&text=Confira este artigo`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
    currentPageUrl: window.location.href
  }
};
```

### 5.3 Deployment
1. Criar arquivo CSS com todos os blocos (3.2-3.8)
2. Atualizar/criar `PostFooter.tsx` com JSX
3. Importar em `[slug]/page.tsx`
4. Executar build local: `npm run build`
5. Validar no navegador (mobile + desktop)
6. Commit + push

---

## FASE 6: TROUBLESHOOTING

### 6.1 Avatar degradê não aparece
**Verificar:** 
- `background:` com 2 gradientes (radial + linear)
- Ordem: radial primeiro, linear segundo
- Não usar `background-color` separado

### 6.2 Sombra avatar fraca
**Verificar:**
- 3 camadas box-shadow
- Spread radius `0 0 0 4px` (anel 1)
- `0 10px 28px` blur + offset (camada 3)

### 6.3 Label não sai "mono"
**Verificar:**
- `font-family: var(--mono)` definido
- Font Awesome carregado (ícones)

### 6.4 Hover botões não funciona
**Verificar:**
- `.sbtn:hover` com `background` e `color`
- `.sbtnCopy:hover` com `border-color`
- `:hover` estados no `.net` social

### 6.5 Grid mobile não quebra
**Adicionar:**
```css
@media (max-width: 720px) {
  .author {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .actions {
    flex-direction: row;
    padding-left: 0;
    padding-top: 20px;
  }
}
```

---

## REFERÊNCIA RÁPIDA DE TOKENS

```css
/* Cores */
--accent: #0F4C5C
--accent-deep: #073642
--accent-mid: #5B8B96
--accent-soft: #E6EEF0
--moss: #3F6B47
--t-muted: #6F6760
--t-meta: #4D453E
--ink: #0A0E1A
--rule: rgba(10, 14, 26, .10)

/* Spacing */
--space-epic: 112px
--gap-share: 18px
--gap-author: 28px
--gap-actions: 12px
--gap-nets: 6px

/* Tipografia */
--mono: 'JetBrains Mono'
--sans: 'Inter'
```

---

## CHECKLIST FINAL

- [ ] Arquivo CSS criado com todos os blocos (3.2-3.8)
- [ ] JSX do componente atualizado
- [ ] Tokens CSS verificados/mapeados
- [ ] Build local passa sem erros
- [ ] Visual validado pixel-perfect (desktop)
- [ ] Mobile responsividade funciona
- [ ] Hover states funcionam (botões, links)
- [ ] Copy button copia link (JS)
- [ ] Commit e push realizado
- [ ] Pipeline verde

---

**Implementação concluída quando todos os checkboxes estiverem marcados.**
