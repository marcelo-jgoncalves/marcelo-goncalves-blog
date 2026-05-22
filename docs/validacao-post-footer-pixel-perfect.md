# Validação Pixel-Perfect: PostFooter

**Protocolo de validação final**  
**Comparar implementação contra: `post-page-prototype.html`**

---

## SEÇÃO 1: CONTAINER & ESTRUTURA

### Container `.post-footer`

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Background | `#fff` (branco puro) | Branco sem transparência | ☐ |
| Border | `1px solid rgba(10,14,26,.10)` | Hairline cinza uniforme | ☐ |
| Border-radius | `16px` | Cantos arredondados consistentes | ☐ |
| Overflow | `hidden` | Conteúdo não escapa dos cantos | ☐ |
| Box-shadow layer 1 | `0 1px 0 rgba(10,14,26,.02)` | Hairline super leve | ☐ |
| Box-shadow layer 2 | `0 10px 32px rgba(15,76,92,.06)` | Drop shadow macio | ☐ |
| Margin-top | `112px (--space-epic)` | Espaço épico separando seções | ☐ |
| ::before width | `4px` | Fina barra na esquerda | ☐ |
| ::before height | 100% (top 0, bottom 0) | Barra vai do topo ao fim | ☐ |
| ::before color | `#0F4C5C (--accent)` | Petróleo profundo | ☐ |

---

## SEÇÃO 2: SHARE STRIP

### Container `.share`

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Display | `flex` | Horizontal flex layout | ☐ |
| Align-items | `center` | Conteúdo alinhado no meio | ☐ |
| Gap | `18px` | Espaço entre elementos | ☐ |
| Padding-top | `16px` | Espaço superior | ☐ |
| Padding-right | `24px` | Espaço direita | ☐ |
| Padding-bottom | `16px` | Espaço inferior | ☐ |
| Padding-left | `28px` | Espaço esquerda (recua) | ☐ |
| Border-bottom | `1px dashed rgba(10,14,26,.10)` | Separador tracejado cinza | ☐ |
| Flex-wrap | `wrap` | Quebra em mobile | ☐ |
| Margin | `0` | Sem margens extras | ☐ |

### Label (`.label`)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Font-family | `'JetBrains Mono'` | Monospace | ☐ |
| Font-size | `0.6875rem (11px)` | Pequeno | ☐ |
| Font-weight | `500` | Medium | ☐ |
| Letter-spacing | `0.22em` | Tracking largo (22%) | ☐ |
| Text-transform | `uppercase` | "COMPARTILHAR" | ☐ |
| Color | `#6F6760 (--t-muted)` | Cinza quente | ☐ |
| Display | `inline-flex` | Flex inline | ☐ |
| Gap | `10px` | Espaço com linha | ☐ |
| Line-height | `1` | Tight (sem extra) | ☐ |

### Label ::after (linha traço)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Content | `""` | Vazio | ☐ |
| Width | `24px` | Comprimento da linha | ☐ |
| Height | `1px` | Hairline fina | ☐ |
| Background | `rgba(10,14,26,.10)` | Cinza hairline | ☐ |
| Display | `inline-block` | Flow inline | ☐ |

### Botões (`.sbtn`)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Display | `inline-flex` | Flex inline | ☐ |
| Align-items | `center` | Ícone + texto no meio | ☐ |
| Gap | `8px` | Espaço ícone-texto | ☐ |
| Height | `34px` | Fixo | ☐ |
| Padding | `0 12px` | Lateral apenas | ☐ |
| Border | `none` | Sem borda padrão | ☐ |
| Background | `transparent` | Invisível até hover | ☐ |
| Cursor | `pointer` | Mão | ☐ |
| Border-radius | `8px` | Canto suave | ☐ |
| Font-family | `'Inter'` | Sans-serif | ☐ |
| Font-size | `0.8125rem (13px)` | Pequeno | ☐ |
| Font-weight | `500` | Medium | ☐ |
| Color | `rgba(10,14,26,.70)` | Cinza escuro suave | ☐ |
| Text-decoration | `none` | Sem underline | ☐ |
| Transition | `background-color 0.15s ease, color 0.15s ease` | Suave (150ms) | ☐ |

### Botões :hover

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Background | `#E6EEF0 (--accent-soft)` | Azul muito claro | ☐ |
| Color | `#0F4C5C (--accent)` | Petróleo (contraste) | ☐ |

### Copy Button (`.sbtnCopy`)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Border | `1px solid rgba(10,14,26,.10)` | Outline cinza | ☐ |
| Border :hover | `#0F4C5C (--accent)` | Border muda para petróleo | ☐ |

---

## SEÇÃO 3: AUTHOR GRID

### Container (`.author`)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Display | `grid` | CSS Grid 3 colunas | ☐ |
| Grid-template-columns | `auto 1fr auto` | Avatar (shrink) \| Bio (grow) \| Social (shrink) | ☐ |
| Gap | `28px` | Espaço entre colunas | ☐ |
| Align-items | `center` | Alinhamento vertical meio | ☐ |
| Padding-top | `28px` | Espaço superior | ☐ |
| Padding-right | `32px` | Espaço direita | ☐ |
| Padding-bottom | `28px` | Espaço inferior | ☐ |
| Padding-left | `36px` | Espaço esquerda | ☐ |
| Margin | `0` | Sem margens extras | ☐ |
| Background | Gradient 180deg, rgba(15,76,92,.025) 0%, rgba(15,76,92,.05) 100% | Degradado sutil petróleo | ☐ |
| Border-left | `4px solid #0F4C5C` | Barra espessa accent | ☐ |
| Box-shadow layer 1 | `0 2px 16px rgba(15,76,92,0.07)` | Profundidade | ☐ |
| Box-shadow layer 2 | `0 1px 4px rgba(15,76,92,0.04)` | Detalhe | ☐ |

---

## SEÇÃO 4: AVATAR

### Avatar (`.avatar`)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Width | `76px` | Quadrado | ☐ |
| Height | `76px` | Quadrado | ☐ |
| Flex | `none` | Não shrink | ☐ |
| Border-radius | `50%` | Perfeitamente circular | ☐ |
| Display | `grid` | Para centralizar | ☐ |
| Place-items | `center` | Centraliza conteúdo | ☐ |
| Color | `#FAF8F3 (--t-invert)` | Creme/ivory | ☐ |
| Font-family | `'Inter'` | Sans-serif | ☐ |
| Font-weight | `800` | Extra bold | ☐ |
| Font-size | `1.375rem (22px)` | Médio | ☐ |
| Letter-spacing | `0.01em` | Tiny tracking | ☐ |
| Position | `relative` | Para ::after | ☐ |

### Avatar Background (radial + linear gradient)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Radial | `circle at 30% 25%, rgba(255,255,255,.18) 0%, transparent 55%` | Brilho de luz 3D | ☐ |
| Linear | `140deg, #073642 0%, #0F4C5C 55%, #5B8B96 100%` | Gradação de cores | ☐ |

### Avatar Box-shadow (3 camadas)

| Layer | Protótipo | Esperado | Status |
|---|---|---|---|
| 1 | `0 0 0 4px #fff` | Anel branco sólido | ☐ |
| 2 | `0 0 0 5px rgba(15,76,92,.18)` | Anel petróleo suave | ☐ |
| 3 | `0 10px 28px rgba(15,76,92,.22)` | Drop shadow macio | ☐ |

### Avatar ::after (online dot)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Content | `""` | Vazio | ☐ |
| Position | `absolute` | Relativo ao avatar | ☐ |
| Right | `-2px` | Sai da borda (overlap) | ☐ |
| Bottom | `-2px` | Sai da borda (overlap) | ☐ |
| Width | `16px` | Círculo | ☐ |
| Height | `16px` | Círculo | ☐ |
| Border-radius | `50%` | Circular | ☐ |
| Background | `#3F6B47 (--moss)` | Verde (online) | ☐ |
| Border | `3px solid #fff` | Anel branco | ☐ |

---

## SEÇÃO 5: BIO / INFO

### Parágrafo (`.info p`)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Font-size | `0.9375rem (15px)` | Body small | ☐ |
| Line-height | `1.65` | Espaçamento generoso | ☐ |
| Color | `rgba(10,14,26,.70)` | Cinza escuro semi-opaco | ☐ |
| Max-width | `520px` | Limite de comprimento | ☐ |
| Margin | `0` | Sem margens | ☐ |

### Author Name (`.authorName`)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Font-weight | `700` | Bold | ☐ |
| Color | `#0A0E1A (--ink)` | Preto profundo | ☐ |
| Letter-spacing | `-0.005em` | Micro tracking negativo | ☐ |

### Profile Link (`.profileLink`)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Color | `#0F4C5C (--accent)` | Petróleo | ☐ |
| Font-weight | `600` | Semibold | ☐ |
| Text-decoration | `none` | Sem underline padrão | ☐ |
| Border-bottom | `1px solid rgba(15,76,92,.30)` | Underline customizado (30%) | ☐ |
| White-space | `nowrap` | Não quebra linha | ☐ |
| Transition | `border-color .2s ease, color .2s ease` | Suave (200ms) | ☐ |

### Profile Link :hover

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Color | `#073642 (--accent-deep)` | Petróleo mais escuro | ☐ |
| Border-bottom-color | `#073642` | Underline mais escuro | ☐ |

---

## SEÇÃO 6: SOCIAL / ACTIONS

### Container (`.actions`)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Display | `flex` | Flexbox | ☐ |
| Flex-direction | `column` | Vertical | ☐ |
| Align-items | `center` | Centraliza horizontalmente | ☐ |
| Justify-content | `center` | Centraliza verticalmente | ☐ |
| Gap | `12px` | Espaço entre label e redes | ☐ |
| Padding-left | `28px` | Margem esquerda | ☐ |
| Align-self | `stretch` | Stretch vertical | ☐ |

### Net Label (`.netLabel`)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Font-family | `'JetBrains Mono'` | Monospace | ☐ |
| Font-size | `0.6875rem (11px)` | Pequeno | ☐ |
| Font-weight | `500` | Medium | ☐ |
| Letter-spacing | `0.22em` | Tracking largo (22%) | ☐ |
| Text-transform | `uppercase` | ACOMPANHE | ☐ |
| Color | `rgba(10,14,26,.70)` | Cinza escuro semi-opaco | ☐ |

### Nets Container (`.nets`)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Display | `flex` | Horizontal | ☐ |
| Gap | `6px` | Espaço pequeno entre ícones | ☐ |

### Ícone Individual (`.net`)

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Width | `38px` | Quadrado | ☐ |
| Height | `38px` | Quadrado | ☐ |
| Border-radius | `50%` | Circular | ☐ |
| Display | `grid` | Para centralizar | ☐ |
| Place-items | `center` | Centraliza ícone | ☐ |
| Background | `#fff` | Branco | ☐ |
| Border | `1px solid rgba(10,14,26,.10)` | Hairline cinza | ☐ |
| Color | `#0F4C5C (--accent)` | Petróleo | ☐ |
| Font-size | `0.9375rem (15px)` | Médio | ☐ |
| Text-decoration | `none` | Sem underline | ☐ |
| Transition | 5 propriedades, 0.2s ease | Suave (200ms) | ☐ |

### Ícone :hover

| Aspecto | Protótipo | Esperado | Status |
|---|---|---|---|
| Background | `#0F4C5C (--accent)` | Fill petróleo | ☐ |
| Border-color | `#0F4C5C` | Muda para petróleo | ☐ |
| Color | `#FAF8F3` | Creme (inverso) | ☐ |
| Transform | `translateY(-2px)` | Sobe levemente | ☐ |
| Box-shadow | `0 6px 16px rgba(15,76,92,.22)` | Sombra elevada | ☐ |

---

## CHECKLIST RESPONSIVIDADE (Mobile)

### Em telas ≤ 720px

| Elemento | Comportamento | Status |
|---|---|---|
| `.author` grid | Muda de 3 colunas para 1 | ☐ |
| `.author` gap | Muda de 28px para 20px | ☐ |
| `.actions` | Muda de flex-direction column para row | ☐ |
| `.actions` padding-left | Muda de 28px para 0 | ☐ |
| `.actions` padding-top | Muda para 20px | ☐ |
| `.actions` border-left | Remove | ☐ |
| `.actions` border-top | Adiciona (1px cinza) | ☐ |
| `.actions` justify-content | Muda para space-between | ☐ |
| `.actions` width | Muda para 100% | ☐ |

---

## PROTOCOLO DE VALIDAÇÃO

### Passo 1: Verificação de cores
1. Abrir DevTools (F12)
2. Inspecionar cada elemento
3. Verificar `background-color`, `color`, `border-color`
4. Comparar com valores em tabela acima
5. Anotar discrepâncias em "Encontrado"

### Passo 2: Verificação de dimensões
1. Usar DevTools → Inspect element
2. Aba "Computed" ou "Styles"
3. Verificar width, height, padding, margin
4. Usar elementos como "76px para avatar" como referência
5. Anotar discrepâncias

### Passo 3: Verificação de espaçamento
1. Inspecionar gaps entre elementos
2. Verificar se 18px (share), 28px (author), 12px (actions), 6px (nets)
3. Usar régua visual ou DevTools medidor
4. Anotar discrepâncias

### Passo 4: Verificação de hover
1. Hover sobre cada botão (share)
2. Verificar background e color mudam
3. Hover sobre cada ícone social
4. Verificar fill, sombra e transform
5. Anotar discrepâncias

### Passo 5: Comparação visual lado-a-lado
1. Abrir protótipo em aba 1
2. Abrir implementação em aba 2
3. Zoom 100% em ambas
4. Comparar pixel-by-pixel
5. Anotar qualquer diferença visual

---

## PLANILHA DE DISCREPÂNCIAS

| Elemento | Esperado | Encontrado | Correção | Status |
|---|---|---|---|---|
| | | | | ☐ |
| | | | | ☐ |
| | | | | ☐ |
| | | | | ☐ |
| | | | | ☐ |

---

## VALIDAÇÃO FINAL

Quando TODOS os checkboxes acima estiverem marcados:

1. **Documentar resultado:**
   ```
   ✅ PostFooter validado pixel-perfect contra protótipo
   Data: [DATA]
   Executor: [NOME]
   Discrepâncias encontradas: [N]
   Status: APROVADO / PRECISA AJUSTE
   ```

2. **Se aprovado:** Commit com mensagem:
   ```
   feat(post-footer): implement pixel-perfect PostFooter with share + author
   
   - Share strip with social buttons
   - Author section with gradient background
   - Social icons with hover animations
   - Responsive design (mobile stacking)
   - Matches post-page-prototype.html exactly
   ```

3. **Se precisa ajuste:** Voltar ao guia de implementação e corrigir.

---

**Validação concluída quando todas as linhas estiverem com ☐ marcado.**
